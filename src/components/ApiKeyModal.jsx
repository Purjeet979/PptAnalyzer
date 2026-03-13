import { useContext, useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';
import { AppContext } from '../context/AppContext';
export default function ApiKeyModal() {
  const { state, dispatch } = useContext(AppContext);
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.isApiKeyModalOpen) {
      setKeyInput(state.apiKey || '');
      setSaved(false);
    }
  }, [state.isApiKeyModalOpen, state.apiKey]);

  if (!state.isApiKeyModalOpen) return null;

  const handleSave = () => {
    if (keyInput.trim()) {
      dispatch({ type: 'SET_API_KEY', payload: keyInput.trim() });
      setSaved(true);
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false });
      }, 1000);
    }
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-[#0d0f14]/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-[fadeIn_0.3s_ease]">
      <div className="bg-[#161922] border border-white/10 w-full max-w-md md:max-w-lg rounded-2xl relative shadow-2xl overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <button 
          className="absolute top-4 right-4 text-gray-500 bg-transparent border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white" 
          onClick={handleClose}
        >
          <X size={20} />
        </button>
        
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Key size={24} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Groq API Key Required</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            This app runs entirely in your browser. Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="px-8 pb-6">
          <label htmlFor="apiKey" className="block font-medium mb-2 text-sm text-gray-400">Groq Cloud API Key</label>
          <input
            id="apiKey"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-lg text-base font-sans transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
            autoFocus
          />
          <div className="mt-3 text-sm text-gray-500">
            Don't have one? Get it free from{' '}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              Groq Console
            </a>.
          </div>
        </div>

        <div className="px-8 py-6 bg-black/20 border-t border-white/10">
          <button 
            className="btn-primary w-full py-3.5 text-base font-bold shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:-translate-y-0.5" 
            onClick={handleSave}
            disabled={!keyInput.trim() || saved}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check size={18} />
                Saved Successfully
              </span>
            ) : (
              'Save Key & Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
