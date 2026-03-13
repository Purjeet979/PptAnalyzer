import { useContext } from 'react';
import { X, Clock, Trash2, ExternalLink } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import './HistoryDrawer.css';

export default function HistoryDrawer({ isOpen, onClose }) {
  const { state, dispatch } = useContext(AppContext);

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel glass-panel" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h3>Analysis History</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="history-list">
          {state.history.length === 0 ? (
            <div className="empty-history text-center p-8">
              <p className="text-muted">No analysis history yet.</p>
            </div>
          ) : (
            state.history.map((item) => (
              <div key={item.id} className="history-item glass-card">
                <div className="history-item-info">
                  <div className="flex justify-between items-start mb-1">
                    <span className="mode-badge">{item.mode}</span>
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="file-name text-sm font-medium truncate">{item.referenceName}</p>
                </div>
                <div className="history-item-actions">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => {
                      dispatch({ type: 'LOAD_HISTORY_ITEM', payload: item });
                      onClose();
                    }}
                  >
                    <ExternalLink size={16} />
                    View
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => dispatch({ type: 'DELETE_HISTORY_ITEM', payload: item.id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
