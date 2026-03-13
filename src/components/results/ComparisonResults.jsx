import { ArrowLeft, Trophy, AlertCircle, FileText, Award, Star, RotateCcw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ComparisonResults({ results, onReset }) {
  const navigate = useNavigate();
  const pptA = results.presentationA;
  const pptB = results.presentationB;
  const summary = results.comparisonSummary;
  const winner = results.recommendedWinner; // "A" or "B"

  if (!pptA && !pptB) return null;

  const winnerName = winner === 'A' ? pptA?.fileName : pptB?.fileName;

  return (
    <div className="results-container pb-20 max-w-6xl mx-auto w-full px-4">
      <div className="flex justify-between items-center mb-10">
        <button className="btn-secondary flex items-center gap-2 hover:bg-white/5 transition-colors" onClick={onReset}>
          <ArrowLeft size={18} />
          Back to Upload
        </button>
        <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold tracking-wide border border-indigo-500/30">1v1 Comparison Mode</div>
      </div>

      {/* Winner Banner */}
      <div className="winner-banner glass-panel mb-12 p-8 flex items-center gap-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
        <div className="p-4 rounded-full bg-amber-500/20 shrink-0">
          <Award size={48} className="text-amber-400" />
        </div>
        <div>
          <span className="text-sm font-bold uppercase text-amber-500/80 tracking-widest mb-1 block">Recommended Winner</span>
          <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{winnerName || 'N/A'}</h3>
        </div>
      </div>

      {/* Side-by-side Cards */}
      <div className="comparison-grid grid md:grid-cols-2 gap-8 relative items-stretch">
        
        {/* Presentation A */}
        <div className={`comparison-card glass-panel flex flex-col p-8 rounded-2xl transition-all duration-300 ${winner === 'A' ? 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/40 relative transform hover:-translate-y-1' : 'border-white/5 opacity-80 hover:opacity-100'}`}>
          {winner === 'A' && <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl"><div className="absolute top-[1.2rem] right-[-1.6rem] bg-emerald-500 text-white text-xs font-bold uppercase py-1 w-24 text-center transform rotate-45 shadow-md">Winner</div></div>}
          
          <div className="card-header border-b border-white/10 pb-5 mb-6 text-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-2">Presentation A</span>
            <h3 className="text-2xl font-bold truncate text-white" title={pptA?.fileName}>{pptA?.fileName || 'Unknown'}</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className={`winner-status px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${winner === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'}`}>
              {winner === 'A' ? <Trophy size={18} /> : <Star size={18} />}
              <span>{winner === 'A' ? 'Winner' : 'Contender'}</span>
            </div>
            <div className="score-main text-center bg-black/20 rounded-2xl p-6 w-full border border-white/5">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-400">{pptA?.totalScore ?? '—'}</span>
              <span className="text-gray-500 block mt-2 text-sm uppercase tracking-widest font-bold">Total Score</span>
            </div>
          </div>

          {/* A's Strengths & Weaknesses */}
          <div className="mt-auto flex-grow flex flex-col justify-end">
             <div className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4">
                <h4 className="flex items-center gap-2 text-emerald-400 mb-4 font-bold text-sm uppercase tracking-wide">
                  <FileText size={16} /> Strengths
                </h4>
                <ul className="space-y-2">
                  {pptA?.strengths?.length > 0 
                    ? pptA.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm flex gap-3"><span className="text-emerald-500 mt-1 shrink-0">•</span> {s}</li>) 
                    : <li className="text-gray-500 italic text-sm">No specific strengths noted</li>}
                </ul>
             </div>
             <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                <h4 className="flex items-center gap-2 text-rose-400 mb-4 font-bold text-sm uppercase tracking-wide">
                  <AlertCircle size={16} /> Weaknesses
                </h4>
                <ul className="space-y-2">
                  {pptA?.weaknesses?.length > 0 
                    ? pptA.weaknesses.map((w, i) => <li key={i} className="text-gray-300 text-sm flex gap-3"><span className="text-rose-500 mt-1 shrink-0">•</span> {w}</li>) 
                    : <li className="text-gray-500 italic text-sm">No specific weaknesses noted</li>}
                </ul>
             </div>
          </div>
        </div>

        {/* VS Divider - positioned absolutely between the cards */}
        <div className="hidden md:flex absolute top-[10%] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#0d0f14] border-4 border-[#161922] items-center justify-center font-black text-xl text-gray-500 z-10 shadow-lg">VS</div>

        {/* Presentation B */}
        <div className={`comparison-card glass-panel flex flex-col p-8 rounded-2xl transition-all duration-300 ${winner === 'B' ? 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/40 relative transform hover:-translate-y-1' : 'border-white/5 opacity-80 hover:opacity-100'}`}>
          {winner === 'B' && <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl"><div className="absolute top-[1.2rem] right-[-1.6rem] bg-emerald-500 text-white text-xs font-bold uppercase py-1 w-24 text-center transform rotate-45 shadow-md">Winner</div></div>}
          
          <div className="card-header border-b border-white/10 pb-5 mb-6 text-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-2">Presentation B</span>
            <h3 className="text-2xl font-bold truncate text-white" title={pptB?.fileName}>{pptB?.fileName || 'Unknown'}</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className={`winner-status px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${winner === 'B' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'}`}>
              {winner === 'B' ? <Trophy size={18} /> : <Star size={18} />}
              <span>{winner === 'B' ? 'Winner' : 'Contender'}</span>
            </div>
            <div className="score-main text-center bg-black/20 rounded-2xl p-6 w-full border border-white/5">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-400">{pptB?.totalScore ?? '—'}</span>
              <span className="text-gray-500 block mt-2 text-sm uppercase tracking-widest font-bold">Total Score</span>
            </div>
          </div>

          {/* B's Strengths & Weaknesses */}
          <div className="mt-auto flex-grow flex flex-col justify-end">
             <div className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4">
                <h4 className="flex items-center gap-2 text-emerald-400 mb-4 font-bold text-sm uppercase tracking-wide">
                  <FileText size={16} /> Strengths
                </h4>
                <ul className="space-y-2">
                  {pptB?.strengths?.length > 0 
                    ? pptB.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm flex gap-3"><span className="text-emerald-500 mt-1 shrink-0">•</span> {s}</li>) 
                    : <li className="text-gray-500 italic text-sm">No specific strengths noted</li>}
                </ul>
             </div>
             <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                <h4 className="flex items-center gap-2 text-rose-400 mb-4 font-bold text-sm uppercase tracking-wide">
                  <AlertCircle size={16} /> Weaknesses
                </h4>
                <ul className="space-y-2">
                  {pptB?.weaknesses?.length > 0 
                    ? pptB.weaknesses.map((w, i) => <li key={i} className="text-gray-300 text-sm flex gap-3"><span className="text-rose-500 mt-1 shrink-0">•</span> {w}</li>) 
                    : <li className="text-gray-500 italic text-sm">No specific weaknesses noted</li>}
                </ul>
             </div>
          </div>
        </div>
      </div>

      {/* Comparative Summary */}
      <div className="mt-8 glass-panel p-8">
        <h3 className="section-title mb-6">Comparative Synthesis</h3>
        <p className="text-lg leading-relaxed text-secondary italic">
          "{summary || 'No detailed comparison available.'}"
        </p>
      </div>

      {/* Criteria Breakdown */}
      {pptA?.criteriaScores?.length > 0 && (
        <div className="mt-12 glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">🎯</span>
            Criteria Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                  <th className="pb-4 font-semibold">Evaluation Criteria</th>
                  <th className="pb-4 font-semibold text-center w-32">Presentation A</th>
                  <th className="pb-4 font-semibold text-center w-32">Presentation B</th>
                  <th className="pb-4 font-semibold text-center w-32">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pptA.criteriaScores.map((cA, i) => {
                  const cB = pptB?.criteriaScores?.[i];
                  const aScore = cA.score ?? 0;
                  const bScore = cB?.score ?? 0;
                  const better = aScore > bScore ? 'A' : bScore > aScore ? 'B' : 'Tie';
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 pr-4 font-medium text-gray-200 group-hover:text-white transition-colors">{cA.name}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${better === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>{aScore}/10</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${better === 'B' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>{bScore}/10</span>
                      </td>
                      <td className="py-4 text-center">
                        {better === 'Tie' ? (
                          <span className="text-gray-500 font-bold text-sm">🤝 TIE</span>
                        ) : better === 'A' ? (
                          <span className="text-indigo-400 font-bold text-sm flex items-center justify-center gap-1"><ArrowLeft size={14} /> A</span>
                        ) : (
                          <span className="text-purple-400 font-bold text-sm flex items-center justify-center gap-1">B <span className="transform rotate-180"><ArrowLeft size={14} /></span></span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ Bottom Action Panel — Compare Another / View History */}
      <div className="mt-12 glass-panel p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Kya aur compare karna hai?</h3>
        <p className="text-gray-400 text-sm mb-6">Ek aur 1v1 comparison karo ya history dekho</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <RotateCcw size={18} />
            Compare Another PPT
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <History size={18} />
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
