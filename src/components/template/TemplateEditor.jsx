import { useContext } from 'react';
import { Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import './TemplateEditor.css';

export default function TemplateEditor() {
  const { state, dispatch } = useContext(AppContext);
  const { criteriaList } = state;

  const updateCriterion = (id, field, value) => {
    const updated = criteriaList.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    dispatch({ type: 'UPDATE_CRITERIA', payload: updated });
  };

  const addCriterion = () => {
    const newCriterion = {
      id: Date.now().toString(),
      name: 'New Criterion',
      weight: 5,
      description: 'Description of what to evaluate'
    };
    dispatch({ type: 'UPDATE_CRITERIA', payload: [...criteriaList, newCriterion] });
  };

  const removeCriterion = (id) => {
    if (criteriaList.length <= 1) return; // Prevent removing last one
    const updated = criteriaList.filter(c => c.id !== id);
    dispatch({ type: 'UPDATE_CRITERIA', payload: updated });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
    // This transition will trigger the analysis flow in App.jsx or a useEffect later
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <div className="template-editor flex-column gap-6">
      <div className="glass-panel p-6">
        <div className="flex-row justify-between items-center mb-6">
          <div className="flex-row items-center gap-3">
            <div className="icon-circle-small bg-accent">
              <SlidersHorizontal size={20} className="text-white" />
            </div>
            <h3 className="m-0">Evaluation Criteria</h3>
          </div>
          <button className="btn-secondary text-sm" onClick={addCriterion}>
            <Plus size={16} /> Add Criterion
          </button>
        </div>

        <div className="criteria-list">
          {criteriaList.map((criterion, index) => (
            <div key={criterion.id} className="criterion-card flex-column gap-3">
              <div className="flex-row justify-between items-start gap-4">
                <div className="flex-column grow gap-2">
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                    className="criterion-input-title"
                    placeholder="Criterion Name"
                  />
                  <input
                    type="text"
                    value={criterion.description}
                    onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                    className="criterion-input-desc"
                    placeholder="Detailed description for the AI..."
                  />
                </div>
                
                <div className="weight-container flex-column items-center gap-2 shrink-0">
                  <span className="text-xs text-muted font-medium uppercase tracking-wide">Weight</span>
                  <div className="weight-badge">{criterion.weight}</div>
                </div>
                
                {criteriaList.length > 1 && (
                  <button 
                    className="btn-icon text-muted hover-danger shrink-0 mt-1" 
                    onClick={() => removeCriterion(criterion.id)}
                    title="Remove Criterion"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="slider-wrapper mt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={criterion.weight}
                  onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value))}
                  className="weight-slider"
                />
                <div className="slider-labels flex-row justify-between text-xs text-muted mt-1">
                  <span>Low Importance</span>
                  <span>High Importance</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-row justify-between items-center mt-4">
        <button className="btn-secondary" onClick={handleBack}>
          Back to Uploads
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Start AI Analysis ✨
        </button>
      </div>
    </div>
  );
}
