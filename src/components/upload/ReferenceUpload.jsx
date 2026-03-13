import { useCallback, useContext } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import './Upload.css';

export default function ReferenceUpload({ label = 'Reference PPT' }) {
  const { state, dispatch } = useContext(AppContext);
  const { referenceFile } = state;

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const pptFile = files.find(f => f.name.endsWith('.pptx') || f.name.endsWith('.ppt'));
    
    if (pptFile) {
      dispatch({ type: 'SET_REFERENCE_FILE', payload: pptFile });
    } else {
      alert('Please upload a valid .pptx or .ppt file.');
    }
  }, [dispatch]);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_REFERENCE_FILE', payload: null });
  };

  return (
    <div className="upload-card glass-panel flex flex-col p-8">
      <div className="upload-header mb-6">
        <div className="slot-badge">Slot A</div>
        <h3 className="text-xl font-bold mb-2">{label}</h3>
        <p className="text-gray-400 text-sm">
          {label.includes('A') ? 'Upload Presentation A' : 'Upload the "Ideal" presentation'}
        </p>
      </div>

      {!referenceFile ? (
        <label 
          className="dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <input 
            type="file" 
            accept=".pptx,.ppt" 
            className="hidden-input" 
            onChange={onDrop}
          />
          <div className="dropzone-content">
            <UploadCloud size={40} className="text-accent mb-3" />
            <p className="font-medium">Drag & drop or click to upload</p>
            <p className="text-muted text-sm mt-1">Accepts .pptx</p>
          </div>
        </label>
      ) : (
        <div className="file-item success success-glow">
          <div className="flex-row items-center gap-3">
            <div className="file-icon bg-success-light text-success">
              <CheckCircle2 size={24} />
            </div>
            <div className="file-info">
              <p className="font-medium truncate" title={referenceFile.name}>
                {referenceFile.name}
              </p>
              <p className="text-muted text-xs">
                {(referenceFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={removeFile} title="Remove">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
