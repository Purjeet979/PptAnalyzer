import { useContext } from 'react';
import { Key, Clock, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { logout } from '../utils/api';

export default function Header() {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <style>{`
        .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
      `}</style>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0f] border-b border-[#1f1f2e] flex items-center px-4 md:px-6 w-full">
        <div className="flex items-center justify-between w-full mx-auto">
          {/* Left: Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.location.href = '/'}
          >
            <div className="text-xl group-hover:rotate-12 transition-transform duration-300 select-none text-white">✦</div>
            <h1 className="text-xl md:text-2xl font-grotesk font-bold tracking-tight text-white glassy-text-hover">
              Kaun<span className="text-[#7c3aed]">Jeeta</span>
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-4 h-full">
            <button
              className={`hidden md:flex items-center gap-2 font-mono text-xs border px-3 py-1.5 rounded-sm transition-colors ${!state.apiKey ? 'border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10' : 'border-[#1f1f2e] text-[#6b7280] hover:text-white'}`}
              onClick={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true })}
            >
              <Key size={14} />
              <span>
                {state.apiKey ? 'Key Connected' : 'Set API Key'}
              </span>
              {!state.apiKey && <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse ml-1"></div>}
            </button>

            <button
              className="hidden md:flex w-9 h-9 items-center justify-center text-[#6b7280] hover:text-white border border-transparent hover:border-[#1f1f2e] rounded-sm transition-colors"
              onClick={() => {
                if (state.isLoggedIn) {
                  window.location.href = '/history';
                } else {
                  window.location.href = 'http://localhost:5000/login/google';
                }
              }}
              title="View History"
            >
              <Clock size={16} />
            </button>
            
            {/* Divider */}
            {state.isLoggedIn && state.user && (
              <div className="hidden md:block w-px h-6 bg-[#1f1f2e] mx-1"></div>
            )}

            {state.isLoggedIn && state.user ? (
              <div className="flex items-center gap-3 ml-1 md:ml-0">
                <img 
                  src={state.user.avatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-sm border border-[#7c3aed] object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <button 
                  onClick={logout} 
                  className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-[#1f1f2e] border border-transparent hover:border-[#1f1f2e] rounded-sm transition-colors" 
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                  className="bg-[#7c3aed] text-white font-grotesk font-bold text-sm px-4 md:px-5 py-2 rounded-sm hover:brightness-110 active:scale-95 transition-all ml-2"
                  onClick={() => window.location.href = 'http://localhost:5000/login/google'}
              >
                  Login with Google
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Spacer to push content down because header is fixed */}
      <div className="h-16 w-full"></div>
    </>
  );
}
