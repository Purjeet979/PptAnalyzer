import './AnalysisProgress.css';

const STAGE_LABELS = {
  embedding_reference: 'Vectorizing reference PPT...',
  embedding_contenders: 'Vectorizing contender PPTs',
  filtered: 'Pre-filtering top candidates...',
  scoring: 'AI scoring batches',
};

export default function AnalysisProgress({ progress }) {
  const { stage, current, total, parsedCount, totalToParse } = progress;

  const isParsing = stage === 'parsing';
  const isEmbeddingRef = stage === 'embedding_reference';
  const isEmbeddingCont = stage === 'embedding_contenders';
  const isFiltered = stage === 'filtered';
  const isScoring = stage === 'scoring';

  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const steps = [
    { label: 'Parsing PPTs', done: !isParsing, active: isParsing },
    { label: 'Embedding Reference', done: !isEmbeddingRef && !isParsing, active: isEmbeddingRef },
    { label: 'Vectorizing Contenders', done: isFiltered || isScoring, active: isEmbeddingCont },
    { label: 'Pre-Filtering', done: isScoring, active: isFiltered },
    { label: 'AI Scoring', done: false, active: isScoring },
  ];

  return (
    <div className="analysis-progress flex-column gap-6">
      <div className="glass-panel p-6 flex-column gap-6">
        {/* Animated Brain Icon */}
        <div className="brain-container flex-center">
          <div className="brain-pulse">
            <span className="brain-emoji">🧠</span>
          </div>
          <div className="ripples">
            <div className="ripple"></div>
            <div className="ripple delay-1"></div>
            <div className="ripple delay-2"></div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="mb-1">AI Analysis in Progress</h3>
          <p className="text-secondary text-sm">
            {isParsing
              ? `Parsing presentations... ${parsedCount}/${totalToParse}`
              : STAGE_LABELS[stage] || 'Processing...'}
            {(isEmbeddingCont || isScoring) && total > 0 && ` (${current}/${total})`}
          </p>
        </div>

        {/* Progress Bar */}
        {(isEmbeddingCont || isScoring) && total > 0 && (
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <span className="progress-pct text-secondary text-sm">{pct}%</span>
          </div>
        )}

        {/* Step indicators */}
        <div className="steps-list">
          {steps.map((step, i) => (
            <div key={i} className={`step-item ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}`}>
              <div className="step-dot">
                {step.done ? '✓' : step.active ? <span className="dot-spinner"></span> : ''}
              </div>
              <span className="step-label text-sm">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-muted text-sm">
        ⚡ Large batches may take a few minutes. Please keep this tab open.
      </p>
    </div>
  );
}
