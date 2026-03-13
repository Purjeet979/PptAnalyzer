import { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Target, TrendingUp, TrendingDown } from 'lucide-react';
function ScoreBar({ score, maxScore = 10 }) {
  const pct = (score / maxScore) * 100;
  const colorClass = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-white/5">
      <div className={`h-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}

function PptDetailCard({ result, rank }) {
  const [expanded, setExpanded] = useState(false);
  const isWinner = rank === 1;

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isWinner ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-[0_4px_20px_rgba(99,102,241,0.1)]' : 'bg-white/5 border border-white/5 hover:border-white/10'}`}>
      <div
        className="flex items-center gap-4 p-4 md:p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-black/20 font-black text-xl border border-white/5 shadow-inner">
           {isWinner ? <span className="text-2xl">🏆</span> : <span className="text-gray-400">#{rank}</span>}
        </div>

        <div className="flex-grow min-w-0">
          <p className={`font-bold truncate text-lg ${isWinner ? 'text-indigo-300' : 'text-gray-200'}`} title={result.fileName}>
            {result.fileName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-gray-300">
              ~{result.similarityScore}% match
            </span>
            <span className="text-gray-500 text-xs">
              {result.criteriaScores?.length || 0} criteria scored
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end pl-4 border-l border-white/10">
          <span className={`text-2xl md:text-3xl font-black ${isWinner ? 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-400' : 'text-gray-300'}`}>
            {Math.round(result.totalScore)}
          </span>
          <span className="text-gray-500 text-xs font-bold tracking-wider uppercase">Score</span>
        </div>

        <button className="text-gray-400 hover:text-white ml-2 transition-colors">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 md:p-6 border-t border-white/5 bg-black/20">
          {/* Summary */}
          {result.summary && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6 italic border-l-2 border-indigo-500 pl-4">{result.summary}</p>
          )}

          {/* Criteria Breakdown */}
          {result.criteriaScores?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Score Breakdown</p>
              <div className="space-y-3">
                 {result.criteriaScores.map((c, i) => (
                   <div key={i} className="">
                     <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-gray-300 font-medium">{c.name}</span>
                       <span className="font-bold text-gray-400">{c.score}/10</span>
                     </div>
                     <ScoreBar score={c.score} />
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            {result.strengths?.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-emerald-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                  <TrendingUp size={16} /> Strengths
                </p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-emerald-500">•</span> {s}</li>)}
                </ul>
              </div>
            )}
            {result.weaknesses?.length > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                <p className="text-rose-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                  <TrendingDown size={16} /> Weaknesses
                </p>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-rose-500">•</span> {w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard({ results, onReset }) {
  const { rankings, winner, skippedCount } = results;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full px-4 pb-20 mt-8">
      {/* Winner Hero */}
      {winner && (
        <div className="glass-panel p-10 flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-b from-indigo-900/40 to-transparent border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-2 transform hover:scale-110 transition-transform duration-500">
            <span className="text-5xl">🏆</span>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 font-bold tracking-widest uppercase text-sm mb-1">Overall Best Presentation</h2>
            <p className="text-4xl md:text-5xl font-black text-white">{winner.fileName}</p>
          </div>
          
          <div className="flex bg-black/30 w-full max-w-md mx-auto rounded-2xl p-6 border border-white/10 items-center justify-center gap-4 shadow-inner">
            <Target size={32} className="text-indigo-400" />
            <div className="flex flex-col">
               <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Final Score</span>
               <span className="text-3xl font-black text-white">{Math.round(winner.totalScore)}<span className="text-gray-500 text-xl font-medium">/100</span></span>
            </div>
          </div>
          
          {winner.summary && (
            <p className="text-gray-300 text-lg text-center max-w-2xl leading-relaxed mt-4 italic">
               "{winner.summary}"
            </p>
          )}

        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:border-indigo-500/30 transition-colors">
          <span className="text-5xl font-black text-white">{rankings.length}</span>
          <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">PPTs Ranked</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:border-indigo-500/30 transition-colors">
          <span className="text-5xl font-black text-gray-300">{skippedCount || 0}</span>
          <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Filtered Out</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:border-indigo-500/30 transition-colors">
          <span className="text-5xl font-black text-emerald-400">{Math.round(winner?.totalScore || 0)}</span>
          <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Top Score</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-panel p-8 rounded-3xl mt-4 border border-white/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Trophy size={24} />
          </div>
          <h3 className="text-3xl font-bold m-0">Leaderboard Rankings</h3>
        </div>
        <div className="flex flex-col gap-4">
          {rankings.map((result) => (
            <PptDetailCard key={result.fileName} result={result} rank={result.rank} />
          ))}
        </div>
      </div>

      {/* Reset button */}
      <div className="flex justify-center mt-12">
        <button className="btn-secondary px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors" onClick={onReset}>
          ↩ Analyze New Presentations
        </button>
      </div>
    </div>
  );
}
