import { useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import ReferenceUpload from './components/upload/ReferenceUpload';
import BulkUpload from './components/upload/BulkUpload';
import TemplateEditor from './components/template/TemplateEditor';
import AnalysisProgress from './components/analysis/AnalysisProgress';
import ResultsDashboard from './components/results/ResultsDashboard';
import ComparisonResults from './components/results/ComparisonResults';
import { AppContext } from './context/AppContext';
import HistoryDrawer from './components/history/HistoryDrawer';
import { parsePptxQueue } from './utils/pptxParser';
import { analyzePresentations } from './utils/groqAnalyzer';
import { getAuthStatus, saveComparison } from './utils/api';
import LandingPage from './components/pages/LandingPage';
import HistoryPage from './components/pages/HistoryPage';
import { Target, Zap } from 'lucide-react';
import './App.css';

const STEPS = ['Upload', 'Criteria', 'Analysis', 'Results'];

function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator flex items-center justify-between w-full max-w-3xl mx-auto mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        ></div>
      </div>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        return (
          <div key={label} className="step-unit flex flex-col items-center gap-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isDone ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] ring-4 ring-indigo-500/30' :
                  'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
              {isDone ? '✓' : stepNum}
            </div>
            <span className={`text-xs md:text-sm font-medium transition-colors ${isActive || isDone ? 'text-gray-200' : 'text-gray-500'
              }`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AnalyzerView() {
  const { state, dispatch } = useContext(AppContext);
  const [progress, setProgress] = useState({ stage: 'parsing', current: 0, total: 0 });
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const analysisStarted = useRef(false);

  const canProceedToCriteria = state.referenceFile && state.contenderFiles.length > 0;

  useEffect(() => {
    if (state.currentStep !== 3) {
      analysisStarted.current = false;
      return;
    }
    if (analysisStarted.current) return;
    analysisStarted.current = true;
    setError(null);
    runAnalysis();
  }, [state.currentStep]);

  async function runAnalysis() {
    if (!state.apiKey) {
      setError('Please set your Groq API key first.');
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      dispatch({ type: 'SET_STEP', payload: 2 });
      return;
    }

    try {
      setProgress({ stage: 'parsing', current: 0, total: 1, parsedCount: 0, totalToParse: 1 + state.contenderFiles.length });
      const [referenceData] = await parsePptxQueue([state.referenceFile], (done, total) => {
        setProgress(p => ({ ...p, parsedCount: done, totalToParse: total }));
      });

      let parsedSoFar = 1;
      const contenderData = await parsePptxQueue(state.contenderFiles, (done, total) => {
        setProgress({ stage: 'parsing', current: done, total, parsedCount: parsedSoFar + done, totalToParse: 1 + total });
      });

      const results = await analyzePresentations(
        referenceData,
        contenderData,
        state.criteriaList,
        state.apiKey,
        ({ stage, current, total }) => {
          setProgress({ stage, current, total });
        },
        state.analysisMode
      );

      // Save result to backend
      // For COMPARISON: score = winner's totalScore, summary = comparisonSummary
      // For LEADERBOARD: score = top-ranked PPT's totalScore, summary = top PPT's summary
      const isComp = results.isComparison;
      const compScore = isComp
        ? (results.recommendedWinner === 'B'
            ? results.presentationB?.totalScore
            : results.presentationA?.totalScore) ?? 0
        : results.rankings?.[0]?.totalScore ?? 0;
      const compSummary = isComp
        ? results.comparisonSummary || ''
        : results.rankings?.[0]?.summary || '';

      const comparisonPayload = {
        type: state.analysisMode,
        ppt1_name: state.referenceFile.name,
        ppt2_name: isComp ? state.contenderFiles[0].name : `${state.contenderFiles.length} Contenders`,
        score: compScore,
        summary: compSummary,
        full_result: results
      };

      try {
        const res = await saveComparison(comparisonPayload);
        if (res.data.free_try) {
          dispatch({ type: 'SET_FREE_TRY_USED', payload: true });
          setShowLoginModal(true);
        }
      } catch (err) {
        console.error("Failed to save comparison", err);
      }

      dispatch({ type: 'SET_RESULTS', payload: results });

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during analysis.');
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_APP' });
    setProgress({ stage: 'parsing', current: 0, total: 0 });
    setError(null);
  };

  return (
    <div className="analyzer-view w-full min-h-[calc(100vh-64px)] relative flex justify-center py-8">
      {/* 3D Particle Background - different from landing page */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img src="/inner_particles_bg.png" alt="" className="w-full h-full object-cover animate-float-bg opacity-40 md:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 to-[#0a0a0f]/95"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        <StepIndicator currentStep={state.currentStep} />

        {showLoginModal && (
          <div className="login-modal-overlay">
            <div className="glass-panel p-10 text-center max-w-md mx-auto relative z-50 slide-up">
              <h2 className="text-2xl font-bold mb-4">Save your Results!</h2>
              <p className="text-gray-300 mb-8">Save this result & see history → Login with Google</p>
              <div className="flex flex-col gap-4">
                <button
                  className="btn-primary"
                  onClick={() => window.location.href = 'http://localhost:5000/login/google'}
                >
                  Login with Google
                </button>
                <button className="text-sm text-gray-500" onClick={() => setShowLoginModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      {/* STEP 1: Upload */}
      {state.currentStep === 1 && (
        <div className="step-container fade-in">
          <h2 className="mb-2 text-center">Analyze Your Presentations</h2>
          <div className="flex justify-center mb-12 w-full max-w-4xl mx-auto mt-8">
            <div className="grid md:grid-cols-2 gap-8 w-full">
              <div
                onClick={() => dispatch({ type: 'SET_MODE', payload: 'LEADERBOARD' })}
                className={`glass-panel p-8 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center group border-2 ${state.analysisMode === 'LEADERBOARD' ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.25)] bg-indigo-500/10 transform scale-[1.02]' : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/5'}`}
              >
                <div className={`mb-5 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 ${state.analysisMode === 'LEADERBOARD' ? 'bg-indigo-500/20 text-indigo-400 scale-110' : 'bg-black/30 text-gray-500 group-hover:text-indigo-400 group-hover:scale-110 shadow-inner'}`}>
                  <Target size={40} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 transition-colors ${state.analysisMode === 'LEADERBOARD' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>Leaderboard Mode</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">Upload a reference PPT and multiple contenders to find the best match instantly.</p>
              </div>

              <div
                onClick={() => dispatch({ type: 'SET_MODE', payload: 'COMPARISON' })}
                className={`glass-panel p-8 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center group border-2 ${state.analysisMode === 'COMPARISON' ? 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.25)] bg-purple-500/10 transform scale-[1.02]' : 'border-white/5 hover:border-purple-500/30 hover:bg-white/5'}`}
              >
                <div className={`mb-5 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 ${state.analysisMode === 'COMPARISON' ? 'bg-purple-500/20 text-purple-400 scale-110' : 'bg-black/30 text-gray-500 group-hover:text-purple-400 group-hover:scale-110 shadow-inner'}`}>
                  <Zap size={40} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 transition-colors ${state.analysisMode === 'COMPARISON' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>1v1 Comparison</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">Direct side-by-side comparison of two presentations with a detailed winner breakdown.</p>
              </div>
            </div>
          </div>
          <div className={`${state.analysisMode === 'LEADERBOARD' ? 'upload-grid' : 'upload-grid-1v1'}`}>
            <ReferenceUpload label={state.analysisMode === 'COMPARISON' ? 'Presentation A' : 'Slot A: Reference'} />
            <BulkUpload
              label={state.analysisMode === 'COMPARISON' ? 'Presentation B' : 'Slot B: Contenders'}
              maxFiles={state.analysisMode === 'COMPARISON' ? 1 : undefined}
            />
          </div>
          <div className="flex-center mt-8">
            <button
              className="btn-primary"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
              disabled={!canProceedToCriteria}
            >
              Next: Configure Criteria →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Criteria */}
      {state.currentStep === 2 && (
        <div className="step-container fade-in">
          <h2 className="mb-2 text-center">Configure Evaluation Criteria</h2>
          <TemplateEditor />
        </div>
      )}

      {/* STEP 3: Analysis Progress */}
      {state.currentStep === 3 && (
        <div className="step-container fade-in">
          <h2 className="mb-2 text-center">Analyzing Presentations</h2>
          {error ? (
            <div className="error-panel glass-panel p-6 flex-column items-center gap-4">
              <span className="error-icon">⚠️</span>
              <p className="text-error font-medium text-center">{error}</p>
              <button className="btn-secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>
                ← Go Back
              </button>
            </div>
          ) : (
            <AnalysisProgress progress={progress} />
          )}
        </div>
      )}

      {/* STEP 4: Results */}
      {state.currentStep === 4 && state.results && (
        <div className="step-container-wide fade-in">
          <h2 className="mb-2 text-center">{state.results.isComparison ? 'Comparison Results' : 'Analysis Results'}</h2>
          {state.results.isComparison ? (
            <ComparisonResults results={state.results} onReset={handleReset} />
          ) : (
            <ResultsDashboard results={state.results} onReset={handleReset} />
          )}
        </div>
      )}
      </div>
    </div>
  );
}

function AppContent() {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getAuthStatus();
        if (res.data.logged_in) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
        } else {
          dispatch({ type: 'SET_USER', payload: null }); // Dispatch null user if not logged in
        }
        if (res.data.free_try_used) {
          dispatch({ type: 'SET_FREE_TRY_USED', payload: true });
        }
      } catch (err) {
        console.error("Auth check failed", err);
        dispatch({ type: 'SET_USER', payload: null }); // Dispatch null user on error
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="app-layout">
      <Header />
      <ApiKeyModal />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyzer" element={<AnalyzerView />} />
          <Route
            path="/history"
            element={
              state.authLoading
                ? <div className="flex items-center justify-center py-40 text-gray-400" style={{ fontFamily: 'Space Mono, monospace' }}>Loading...</div>
                : state.isLoggedIn
                  ? <HistoryPage />
                  : <Navigate to="/" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

