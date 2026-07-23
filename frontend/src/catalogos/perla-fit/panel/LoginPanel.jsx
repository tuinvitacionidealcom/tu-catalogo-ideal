import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Beer, Loader2, AlertCircle } from 'lucide-react';

const LoginPanel = ({ onLogin, loading, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,100,20,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,100,20,0.1) 0%, transparent 70%)',
        }} />
        {/* Patrón de puntos */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#d4a017" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,160,23,0.2)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo / Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #b46414 0%, #d4a017 100%)',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(180,100,20,0.4)',
          }}>
            <Beer size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>
            Panel de Control
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Ingresá con tu usuario y contraseña
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '12px 14px', marginBottom: '20px',
          }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 600 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Usuario */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              letterSpacing: '0.8px', marginBottom: '8px',
            }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} color="rgba(255,255,255,0.25)" style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                id="panel-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="tu usuario"
                required
                autoComplete="username"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '13px 14px 13px 38px',
                  fontSize: '14px', color: '#fff',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              letterSpacing: '0.8px', marginBottom: '8px',
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="rgba(255,255,255,0.25)" style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              }} />
              <input
                id="panel-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '13px 42px 13px 38px',
                  fontSize: '14px', color: '#fff',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            id="panel-login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', marginTop: '8px',
              background: loading
                ? 'rgba(180,100,20,0.5)'
                : 'linear-gradient(135deg, #b46414 0%, #d4a017 100%)',
              border: 'none', borderRadius: '14px',
              padding: '15px', cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff', fontSize: '14px', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(180,100,20,0.35)',
              transition: 'all 0.2s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verificando...</>
            ) : (
              <><Lock size={15} /> Ingresar al Panel</>
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px', marginBottom: 0,
          fontSize: '11px', color: 'rgba(255,255,255,0.2)',
        }}>
          Tu Catálogo Ideal © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default LoginPanel;
