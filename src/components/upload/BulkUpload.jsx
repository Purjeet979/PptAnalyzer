import { useCallback, useContext, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, Plus, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import './Upload.css';

export default function BulkUpload({ label = 'Contender PPTs', maxFiles }) {
  const { state, dispatch } = useContext(AppContext);
  const { contenderFiles } = state;
  const fileInputRef = useRef(null);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    const pptFiles = files.filter(f => f.name.endsWith('.pptx') || f.name.endsWith('.ppt'));
    
    // Filter out duplicates
    const newFiles = pptFiles.filter(
      newFile => !contenderFiles.some(existingFile => existingFile.name === newFile.name)
    );

    if (newFiles.length > 0) {
      if (maxFiles === 1) {
        dispatch({ type: 'SET_CONTENDER_FILES', payload: [newFiles[0]] });
      } else {
        dispatch({ type: 'ADD_CONTENDER_FILES', payload: newFiles });
      }
    }

  }, [contenderFiles, dispatch]);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (name, e) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_CONTENDER_FILE', payload: name });
  };

  return (
    <div className="upload-card glass-panel flex flex-col h-full p-8">
      <div className="upload-header flex justify-between items-start mb-6">
        <div>
          <div className="slot-badge border-secondary">Slot B</div>
          <h3 className="text-xl font-bold mb-2">{label}</h3>
          <p className="text-gray-400 text-sm">
            {maxFiles === 1 ? 'Upload Presentation B' : 'Upload bulk files to analyze'}
          </p>
        </div>
        
        {contenderFiles.length > 0 && maxFiles !== 1 && (
          <div className="count-badge">
            {contenderFiles.length} {contenderFiles.length === 1 ? 'file' : 'files'}
          </div>
        )}
      </div>

      <div className="bulk-content flex flex-col grow">
        {maxFiles === 1 && contenderFiles.length > 0 ? (
          // Single file success UI (Matching ReferenceUpload)
          <div className="file-item success success-glow">
            <div className="flex-row items-center gap-3">
              <div className="file-icon bg-success-light text-success">
                <CheckCircle2 size={24} />
              </div>
              <div className="file-info">
                <p className="font-medium truncate" title={contenderFiles[0].name}>
                  {contenderFiles[0].name}
                </p>
                <p className="text-muted text-xs">
                  {(contenderFiles[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button className="btn-icon" onClick={(e) => removeFile(contenderFiles[0].name, e)} title="Remove">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <label 
              className={`dropzone bulk-dropzone ${contenderFiles.length > 0 ? 'compact' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <input 
                type="file" 
                accept=".pptx,.ppt" 
                multiple={maxFiles !== 1}
                className="hidden-input" 
                onChange={onDrop}
                ref={fileInputRef}
              />
              <div className="dropzone-content">
                <UploadCloud size={contenderFiles.length > 0 ? 24 : 40} className="text-accent mb-2" />
                <p className="font-medium">
                  {contenderFiles.length > 0 
                    ? (maxFiles === 1 ? 'Replace file' : 'Add more files') 
                    : (maxFiles === 1 ? 'Drag & drop file B' : 'Drag & drop multiple files')}
                </p>
              </div>
            </label>

            {contenderFiles.length > 0 && maxFiles !== 1 && (
              <div className="file-list-container">
                <ul className="file-list">
                  {contenderFiles.map((file, idx) => (
                    <li key={`${file.name}-${idx}`} className="file-item-small">
                      <div className="flex-row items-center gap-2 truncate">
                        <FileIcon size={16} className="text-secondary shrink-0" />
                        <span className="truncate text-sm">{file.name}</span>
                      </div>
                      <button className="remove-btn" onClick={(e) => removeFile(file.name, e)}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
