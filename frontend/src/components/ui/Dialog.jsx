import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

// ─── Tipos de diálogo ──────────────────────────────────────────────────────────
const ICONS = {
  success: { Icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)' },
  error:   { Icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
  warning: { Icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  info:    { Icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
  danger:  { Icon: Trash2, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
};

// ─── DialogModal ───────────────────────────────────────────────────────────────
const DialogModal = ({ dialog, onResolve }) => {
  const overlayRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onResolve(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onResolve]);

  if (!dialog) return null;

  const {
    type = 'info',
    title,
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    showCancel = false,
  } = dialog;

  const cfg = ICONS[type] || ICONS.info;
  const { Icon } = cfg;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onResolve(false);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Inter', -apple-system, sans-serif",
        animation: 'dialogFadeIn 0.18s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          animation: 'dialogSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        {/* Barra de color superior */}
        <div style={{ height: '4px', background: cfg.color, opacity: 0.9 }} />

        {/* Contenido */}
        <div style={{ padding: '28px 28px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {/* Ícono */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px',
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={cfg.color} />
              </div>
              {/* Título */}
              {title && (
                <h3 style={{
                  margin: 0, fontSize: '16px', fontWeight: 700,
                  color: '#0f172a', lineHeight: 1.3,
                }}>
                  {title}
                </h3>
              )}
            </div>
            {/* Botón X */}
            <button
              onClick={() => onResolve(false)}
              aria-label="Cerrar"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '10px',
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '12px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              <X size={15} color="#64748b" />
            </button>
          </div>

          {/* Mensaje */}
          {message && (
            <p style={{
              margin: '0 0 24px',
              fontSize: '14px',
              color: '#475569',
              lineHeight: 1.6,
              paddingLeft: '54px', // alineado con el título
            }}>
              {message}
            </p>
          )}

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}>
            {showCancel && (
              <button
                onClick={() => onResolve(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fff',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => onResolve(true)}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                background: type === 'danger' || type === 'error'
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : `linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd)`,
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: `0 4px 14px ${cfg.color}40`,
                fontFamily: 'inherit',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${cfg.color}55`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${cfg.color}40`; }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dialogFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dialogSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

// ─── Hook useDialog ────────────────────────────────────────────────────────────
export function useDialog() {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const open = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog(options);
    });
  }, []);

  const handleResolve = useCallback((value) => {
    setDialog(null);
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
  }, []);

  // Atajos semánticos
  const alert = useCallback((message, options = {}) =>
    open({ type: 'info', title: 'Aviso', message, confirmText: 'Aceptar', showCancel: false, ...options }),
  [open]);

  const success = useCallback((message, options = {}) =>
    open({ type: 'success', title: '¡Listo!', message, confirmText: 'Aceptar', showCancel: false, ...options }),
  [open]);

  const error = useCallback((message, options = {}) =>
    open({ type: 'error', title: 'Error', message, confirmText: 'Aceptar', showCancel: false, ...options }),
  [open]);

  const confirm = useCallback((message, options = {}) =>
    open({ type: 'warning', title: '¿Estás seguro?', message, confirmText: 'Confirmar', cancelText: 'Cancelar', showCancel: true, ...options }),
  [open]);

  const danger = useCallback((message, options = {}) =>
    open({ type: 'danger', title: '¿Eliminar?', message, confirmText: 'Sí, eliminar', cancelText: 'Cancelar', showCancel: true, ...options }),
  [open]);

  const DialogUI = useCallback(
    () => <DialogModal dialog={dialog} onResolve={handleResolve} />,
    [dialog, handleResolve]
  );

  return { alert, success, error, confirm, danger, DialogUI };
}

export default DialogModal;
