import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Store, Loader2, AlertCircle, Check } from 'lucide-react';

const LoginPanel = ({ onLogin, loading, error, catalogName = 'Comercio', catalogSlug = 'default', logoImage }) => {
  const USER_KEY = `panel_saved_user_${catalogSlug}`;
  const PASS_KEY = `panel_saved_pass_${catalogSlug}`;
  const REMEMBER_KEY = `panel_remember_${catalogSlug}`;

  const [username, setUsername] = useState(() => {
    return localStorage.getItem(USER_KEY) || localStorage.getItem('panel_saved_user') || '';
  });
  const [password, setPassword] = useState(() => {
    return localStorage.getItem(PASS_KEY) || localStorage.getItem('panel_saved_pass') || '';
  });
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    return saved !== null ? saved === 'true' : true; // Por defecto activado para comodidad del cliente
  });
  const [showPass, setShowPass] = useState(false);

  // Cargar credenciales específicas al cambiar de catálogo
  useEffect(() => {
    const savedU = localStorage.getItem(USER_KEY) || localStorage.getItem('panel_saved_user');
    const savedP = localStorage.getItem(PASS_KEY) || localStorage.getItem('panel_saved_pass');
    if (savedU) setUsername(savedU);
    if (savedP) setPassword(savedP);
  }, [catalogSlug, USER_KEY, PASS_KEY]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem(USER_KEY, username);
      localStorage.setItem(PASS_KEY, password);
      localStorage.setItem(REMEMBER_KEY, 'true');
      // Compatibilidad retroactiva
      localStorage.setItem('panel_saved_user', username);
      localStorage.setItem('panel_saved_pass', password);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PASS_KEY);
      localStorage.setItem(REMEMBER_KEY, 'false');
      localStorage.removeItem('panel_saved_user');
      localStorage.removeItem('panel_saved_pass');
    }
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

        {/* Formulario con soporte nativo de autocompletado y guardado */}
        <form method="post" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="panel-username" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="panel-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresá tu usuario"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="panel-password" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="panel-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
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
                title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkbox Recordar Usuario y Contraseña */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand accent-brand cursor-pointer"
              />
              <span className="text-xs text-slate-300 hover:text-white transition-colors">
                Recordar usuario y contraseña
              </span>
            </label>
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
