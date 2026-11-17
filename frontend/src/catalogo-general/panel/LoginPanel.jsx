import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Store, Loader2, AlertCircle } from 'lucide-react';

const LoginPanel = ({ onLogin, loading, error, catalogName = 'Comercio', logoImage }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('panel_saved_user') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('panel_saved_pass') || '');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('panel_saved_user', username);
    localStorage.setItem('panel_saved_pass', password);
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-sm bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-brand/30">
            {logoImage ? (
              <img src={logoImage} alt={catalogName} className="w-10 h-10 object-contain rounded-xl" />
            ) : (
              <Store className="w-7 h-7 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Panel de Control</h2>
          <p className="text-xs text-slate-400">
            {catalogName}
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresá tu usuario"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
                className="w-full pl-10 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brand hover:bg-brand-dark active:scale-98 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Ingresar al Panel</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-slate-500">
          Tu Catálogo Ideal • Panel de Gestión
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
