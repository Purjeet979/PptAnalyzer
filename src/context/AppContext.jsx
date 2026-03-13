import { createContext, useReducer, useEffect } from 'react';

const initialState = {
  apiKey: localStorage.getItem('groqApiKey') || '',
  isApiKeyModalOpen: !localStorage.getItem('groqApiKey'),
  currentStep: 1, // 1: Upload, 2: Criteria, 3: Analysis, 4: Results
  analysisMode: 'LEADERBOARD', // 'LEADERBOARD' or 'COMPARISON'
  history: JSON.parse(localStorage.getItem('analysisHistory') || '[]'),
  
  // Auth
  user: null,
  isLoggedIn: false,
  authLoading: true,  // true until first auth check completes
  freeTryUsed: false,
  
  // Files
  referenceFile: null, // Slot A
  contenderFiles: [], // Slot B
  
  // ... rest of the state remains the same but initialized here for clarity
  referenceData: null,
  contenderData: [],
  topContenders: [],
  isParsing: false,
  parsedCount: 0,
  totalToParse: 0,
  isAnalyzing: false,
  analyzedCount: 0,
  
  criteriaList: [
    { id: '1', name: 'Problem Statement Clarity', weight: 8, description: 'How clearly is the problem defined?' },
    { id: '2', name: 'Technical Feasibility', weight: 10, description: 'Is the proposed solution technically viable within a hackathon?' },
    { id: '3', name: 'Innovation & Originality', weight: 9, description: 'How unique and creative is the solution?' },
    { id: '4', name: 'Business Value / Impact', weight: 7, description: 'What is the potential real-world impact?' },
    { id: '5', name: 'Presentation Quality', weight: 6, description: 'Flow, design, and readability of the PPT.' },
  ],
  results: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      localStorage.setItem('groqApiKey', action.payload);
      return { ...state, apiKey: action.payload, isApiKeyModalOpen: false };
    case 'SET_MODE':
      return { ...state, analysisMode: action.payload, contenderFiles: [] }; // Reset Slot B on mode change

    case 'TOGGLE_API_KEY_MODAL':
      return { ...state, isApiKeyModalOpen: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_REFERENCE_FILE':
      return { ...state, referenceFile: action.payload };
    case 'SET_CONTENDER_FILES':
      return { ...state, contenderFiles: action.payload };
    case 'ADD_CONTENDER_FILES':
      return { ...state, contenderFiles: [...state.contenderFiles, ...action.payload] };
    case 'REMOVE_CONTENDER_FILE':
      return { 
        ...state, 
        contenderFiles: state.contenderFiles.filter(f => f.name !== action.payload) 
      };
    case 'UPDATE_CRITERIA':
      return { ...state, criteriaList: action.payload };
    case 'SET_PARSING_PROGRESS':
      return { 
        ...state, 
        isParsing: action.payload.isParsing,
        parsedCount: action.payload.parsedCount,
        totalToParse: action.payload.totalToParse
      };
    case 'SET_PARSED_DATA':
      return {
        ...state,
        referenceData: action.payload.referenceData || state.referenceData,
        contenderData: action.payload.contenderData || state.contenderData
      };
    case 'SET_ANALYZING_PROGRESS':
      return {
        ...state,
        isAnalyzing: action.payload.isAnalyzing,
        analyzedCount: action.payload.analyzedCount || state.analyzedCount,
        topContenders: action.payload.topContenders || state.topContenders
      };
    case 'SET_RESULTS': {
      const newResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        mode: state.analysisMode,
        referenceName: state.referenceFile.name,
        data: action.payload
      };
      const newHistory = [newResult, ...state.history].slice(0, 20); // Keep last 20
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
      return { ...state, results: action.payload, history: newHistory, currentStep: 4, isAnalyzing: false };
    }
    case 'DELETE_HISTORY_ITEM': {
      const filteredHistory = state.history.filter(h => h.id !== action.payload);
      localStorage.setItem('analysisHistory', JSON.stringify(filteredHistory));
      return { ...state, history: filteredHistory };
    }
    case 'LOAD_HISTORY_ITEM':
      return { 
        ...state, 
        results: action.payload.data, 
        analysisMode: action.payload.mode,
        currentStep: 4 
      };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: !!action.payload, authLoading: false };
    case 'SET_FREE_TRY_USED':
      return { ...state, freeTryUsed: action.payload };
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false, authLoading: false };
    case 'RESET_APP':
      return { 
        ...initialState, 
        apiKey: state.apiKey, 
        isApiKeyModalOpen: false,
        criteriaList: state.criteriaList,
        history: state.history,
        analysisMode: state.analysisMode,
        // Preserve auth state so authLoading doesn't get stuck
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        authLoading: false,
        freeTryUsed: state.freeTryUsed,
      };

    default:
      return state;
  }
}

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
