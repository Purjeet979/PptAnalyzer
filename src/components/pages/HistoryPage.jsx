import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteHistoryItem } from '../../utils/api';
import { AppContext } from '../../context/AppContext';
import { Calendar, ChevronRight, BarChart3, Clock, History, X, Trophy, Target, ArrowLeft, Trash2 } from 'lucide-react';

const FullResultsModal = ({ item, onClose }) => {
    const fullResult = item.full_result || {};
    const rankings = fullResult.rankings || [];
    const isComparison = item.type === 'COMPARISON';

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto" style={{background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)'}}>
            <div className="relative w-full max-w-4xl mx-4 my-8 rounded-2xl border border-white/10 bg-[#111118] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h2 className="font-bold text-xl text-white">{item.ppt2_name}</h2>
                            <p className="text-sm text-gray-400">vs {item.ppt1_name} • {new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* AI Summary */}
                    {item.summary && (
                        <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
                            <h3 className="font-bold mb-3 flex items-center gap-2 text-purple-300">
                                <BarChart3 size={16} /> AI Summary
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{item.summary}</p>
                        </div>
                    )}

                    {/* Rankings (Leaderboard mode) */}
                    {!isComparison && rankings.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                                <Trophy size={16} className="text-yellow-400" /> Leaderboard Rankings
                            </h3>
                            <div className="space-y-3">
                                {rankings.map((r, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#0a0a0f] hover:border-purple-500/30 transition-colors">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                            idx === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                                            idx === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/40' :
                                            idx === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                                            'bg-white/5 text-gray-400 border border-white/10'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{r.name || r.filename || 'Unknown'}</p>
                                            {r.strengths && <p className="text-xs text-gray-500 truncate mt-0.5">{r.strengths}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-bold text-purple-400 text-lg">{Math.round(r.score || 0)}</div>
                                            <div className="text-xs text-gray-500">score</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 1v1 Comparison Results */}
                    {isComparison && (
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                                <Target size={16} className="text-cyan-400" /> Comparison Result
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl border border-white/10 bg-[#0a0a0f] text-center">
                                    <p className="text-sm text-gray-400 mb-2">Reference</p>
                                    <p className="font-bold text-white truncate">{item.ppt1_name}</p>
                                </div>
                                <div className={`p-5 rounded-xl border text-center ${fullResult.winner === item.ppt2_name ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 bg-[#0a0a0f]'}`}>
                                    <p className="text-sm text-gray-400 mb-2">Contender</p>
                                    <p className="font-bold text-white truncate">{item.ppt2_name}</p>
                                    {fullResult.winner === item.ppt2_name && <span className="text-xs text-green-400 mt-1 block">🏆 Winner</span>}
                                </div>
                            </div>
                            {fullResult.feedback && (
                                <div className="mt-4 p-4 rounded-xl border border-white/5 bg-[#0a0a0f]">
                                    <p className="text-sm text-gray-300 leading-relaxed">{fullResult.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Criteria Scores */}
                    {fullResult.criteriaScores && Object.keys(fullResult.criteriaScores).length > 0 && (
                        <div>
                            <h3 className="font-bold mb-4 text-white">Criteria Breakdown</h3>
                            <div className="space-y-3">
                                {Object.entries(fullResult.criteriaScores).map(([key, val]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <p className="text-sm text-gray-300 w-48 flex-shrink-0">{key}</p>
                                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500" style={{width: `${Math.min(100, (val / 10) * 100)}%`}}></div>
                                        </div>
                                        <span className="text-sm font-bold text-purple-400 w-10 text-right">{typeof val === 'number' ? val.toFixed(1) : val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [viewingResult, setViewingResult] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // prevent row expand toggle
        if (!window.confirm('Are you sure you want to delete this comparison?')) return;
        setDeletingId(id);
        try {
            await deleteHistoryItem(id);
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
            alert('Delete failed. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getHistory();
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-400 font-mono text-sm">Loading history...</p>
        </div>
    );

    return (
        <div className="py-10 px-4 md:px-6 max-w-5xl mx-auto" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
            {viewingResult && <FullResultsModal item={viewingResult} onClose={() => setViewingResult(null)} />}

            <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                <History className="text-purple-500" /> Comparison History
            </h1>

            {history.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#111118]">
                    <Clock size={48} className="mx-auto opacity-20 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No comparisons yet</h3>
                    <p className="text-gray-400">Your past analyses will appear here once you start using the app.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="rounded-xl overflow-hidden border border-white/10 bg-[#111118] transition-all duration-300 hover:border-purple-500/30">
                            <div
                                className="p-5 cursor-pointer flex items-center justify-between gap-4"
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="h-12 w-12 rounded-xl bg-purple-900/30 flex-shrink-0 flex items-center justify-center border border-purple-500/30">
                                        <span className="text-purple-400 font-bold">{Math.round(item.score || 0)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-base md:text-lg truncate">{item.ppt2_name}</h4>
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                                            vs {item.ppt1_name} • <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 hidden sm:block">
                                        {item.type === 'LEADERBOARD' ? 'Leaderboard' : '1v1'}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, item.id)}
                                        disabled={deletingId === item.id}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                                        title="Delete"
                                    >
                                        {deletingId === item.id 
                                            ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                            : <Trash2 size={15} />
                                        }
                                    </button>
                                    <ChevronRight className={`transition-transform duration-300 ${expandedId === item.id ? 'rotate-90' : ''}`} size={18} />
                                </div>
                            </div>

                            {expandedId === item.id && (
                                <div className="px-5 pb-5 border-t border-purple-500/10 bg-purple-500/5 pt-4">
                                    <div className="mb-4">
                                        <h5 className="font-bold mb-2 flex items-center gap-2 text-sm text-gray-300">
                                            <BarChart3 size={14} /> AI Summary
                                        </h5>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {item.summary || <span className="italic text-gray-600">No summary saved for this comparison.</span>}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setViewingResult(item)}
                                        className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                                    >
                                        <BarChart3 size={14} /> View Full Detailed Results
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
