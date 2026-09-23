// CustomAlert.js
// Sobrescribe window.alert con un modal estilizado que hereda las variables CSS del catálogo

const overrideWindowAlert = () => {
  window.alert = (message) => {
    // Si ya hay una alerta abierta, la removemos
    const existing = document.getElementById('custom-global-alert');
    if (existing) {
      document.body.removeChild(existing);
    }

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'custom-global-alert';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'rgba(0,0,0,0.55)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.style.fontFamily = "'Inter', -apple-system, sans-serif";
    overlay.style.animation = 'dialogFadeIn 0.18s ease';

    // Animación de entrada
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes dialogFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dialogSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .custom-alert-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
      .custom-alert-close:hover { background: #e2e8f0 !important; }
    `;
    document.head.appendChild(style);

    // Crear card
    const card = document.createElement('div');
    card.style.width = '100%';
    card.style.maxWidth = '380px';
    card.style.background = '#ffffff';
    card.style.borderRadius = '24px';
    card.style.boxShadow = '0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)';
    card.style.overflow = 'hidden';
    card.style.animation = 'dialogSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)';
    card.style.position = 'relative';

    // Usar el color del catálogo si existe, sino un default neutral
    const brandColor = 'var(--color-brand, #0f172a)';
    const brandLight = 'var(--color-brand-light, #e2e8f0)';

    card.innerHTML = `
      <div style="height: 4px; background: ${brandColor}; opacity: 0.9;"></div>
      <div style="padding: 24px 24px 20px;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <div style="width: 42px; height: 42px; border-radius: 14px; background: ${brandLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0.8;">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${brandColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.3;">
              Aviso
            </h3>
          </div>
          <button class="custom-alert-close" style="background: #f1f5f9; border: none; border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-left: 12px; transition: background 0.15s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6; padding-left: 54px;">
          ${message}
        </p>
        <div style="display: flex; justify-content: flex-end;">
          <button class="custom-alert-btn" style="padding: 10px 24px; border-radius: 12px; border: none; background: ${brandColor}; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: inherit;">
            Aceptar
          </button>
        </div>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const closeAlert = () => {
      document.body.removeChild(overlay);
    };

    const closeBtn = overlay.querySelector('.custom-alert-close');
    const acceptBtn = overlay.querySelector('.custom-alert-btn');

    closeBtn.onclick = closeAlert;
    acceptBtn.onclick = closeAlert;

    // Click outside to close
    overlay.onclick = (e) => {
      if (e.target === overlay) closeAlert();
    };
  };
};

export default overrideWindowAlert;
