import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// Helper: parsear imágenes
const parseImages = (image) => {
  if (!image) return [];
  if (image.startsWith('[')) {
    try { return JSON.parse(image).filter(Boolean); } catch { return [image]; }
  }
  return [image];
};

// ── Lightbox pantalla completa ─────────────────────────────────────────────
const Lightbox = ({ images, startIdx, onClose }) => {
  const [idx, setIdx] = useState(startIdx);
  const touchStartX = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, images.length]);

  const handleTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0
        ? setIdx(i => (i + 1) % images.length)
        : setIdx(i => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imagen centrada */}
      <img
        key={idx}
        src={images[idx]}
        alt={`foto ${idx + 1}`}
        className="max-w-full max-h-full object-contain select-none"
        style={{ maxHeight: '90vh', maxWidth: '96vw', animation: 'lbFadeIn .2s ease' }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 z-10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Contador */}
      {images.length > 1 && (
        <span className="absolute top-5 left-5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {idx + 1} / {images.length}
        </span>
      )}

      {/* Flechas */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`rounded-full transition-all duration-200 cursor-pointer ${
                i === idx ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Hint deslizar */}
      {images.length > 1 && (
        <span className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
          Deslizá para cambiar foto
        </span>
      )}

      <style>{`@keyframes lbFadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
};

// ── ProductModal ────────────────────────────────────────────────────────────
const ProductModal = ({ isOpen, onClose, product, whatsappNumber, catalogId = 1 }) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) return; // el lightbox maneja sus propias teclas
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) setPhotoIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft'  && images.length > 1) setPhotoIdx(i => (i - 1 + images.length) % images.length);
    };
    if (isOpen) { setPhotoIdx(0); window.addEventListener('keydown', handleKeyDown); }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, lightboxOpen]);

  if (!isOpen || !product) return null;

  const { name, description, price, image, category, available = true } = product;
  const images = parseImages(image);
  const currentImage = images[photoIdx];

  const handleBuyDirect = () => {
    try {
      const LS_CLICKS = 'perlafit_product_clicks';
      const clicks = JSON.parse(localStorage.getItem(LS_CLICKS) || '{}');
      if (product.id) clicks[product.id] = (clicks[product.id] || 0) + 1;
      localStorage.setItem(LS_CLICKS, JSON.stringify(clicks));
      const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
      fetch(`${API_BASE}/?request=contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_id: catalogId, name: 'Cliente Catálogo', phone: '', email: '',
          message: `Consulta por producto: ${name} (${price > 0 ? '$' + price : 'Consultar'})` })
      }).catch(() => {});
    } catch {}
    let message = `*¡Hola! Quiero consultar por este producto:* 👋\n\n`;
    message += `📌 *Producto:* ${name}\n`;
    message += `💰 *Precio:* ${price > 0 ? '$' + price.toLocaleString('es-AR') : 'A consultar'}\n`;
    if (description) message += `📝 *Detalle:* _${description}_\n`;
    message += `\n¿Tienen stock disponible actualmente? ¡Muchas gracias!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0
        ? setPhotoIdx(i => (i + 1) % images.length)
        : setPhotoIdx(i => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* Lightbox pantalla completa */}
      {lightboxOpen && (
        <Lightbox images={images} startIdx={photoIdx} onClose={() => setLightboxOpen(false)} />
      )}

      <div
        className="fixed inset-0 bg-brand/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[88vh] sm:h-auto sm:max-h-[92vh]"
          style={{ animation: 'slideUp .3s cubic-bezier(.4,0,.2,1)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Galería ── */}
          <div
            className="relative bg-white overflow-hidden shrink-0 cursor-zoom-in"
            style={{ height: '42vh' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => currentImage && setLightboxOpen(true)}
          >
            {currentImage ? (
              <img
                key={photoIdx}
                src={currentImage}
                alt={`${name} foto ${photoIdx + 1}`}
                className="w-full h-full object-contain transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-16 h-16 opacity-30" />
              </div>
            )}

            {/* Hint ampliar */}
            {currentImage && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full pointer-events-none z-10">
                <ZoomIn className="w-3 h-3" />
                <span>Tocá para ampliar</span>
              </div>
            )}

            {/* Flechas */}
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setPhotoIdx(i => (i - 1 + images.length) % images.length); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-all z-10 active:scale-90">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setPhotoIdx(i => (i + 1) % images.length); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-all z-10 active:scale-90">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                    className={`rounded-full transition-all duration-200 cursor-pointer shadow ${
                      i === photoIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Cerrar */}
            <button onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-brand p-2.5 rounded-full shadow-lg active:scale-90 transition-all cursor-pointer z-20">
              <X className="w-5 h-5" />
            </button>

            {/* Contador */}
            {images.length > 1 && (
              <span className="absolute top-4 left-4 bg-black/35 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                {photoIdx + 1}/{images.length}
              </span>
            )}
          </div>

          {/* ── Cuerpo ── */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
            <div>
              <h2 className="font-serif font-black text-2xl text-brand leading-tight">{name}</h2>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {available ? 'Stock Disponible' : 'Sin Stock Temporal'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Precio</span>
              <span className="font-sans font-black text-2xl text-brand">
                {price > 0 ? `$${price.toLocaleString('es-AR')}` : 'Consultar'}
              </span>
            </div>

            {/* Talles disponibles */}
            {(() => {
              const sizesRaw = product.sizes || '';
              const avail = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
              if (avail.length === 0) return null;
              return (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talles disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {avail.map(t => (
                      <span key={t} className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-brand text-white border border-brand">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalle e información</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium">
                {description || 'No hay descripción disponible para esta prenda.'}
              </p>
            </div>

            {!available && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center border border-red-100">
                Podés consultar si ingresa próximamente presionando el botón de abajo.
              </div>
            )}
          </div>

          {/* ── Acción ── */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              onClick={handleBuyDirect}
              className="w-full bg-accent hover:bg-accent/90 active:scale-95 text-brand font-sans font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all cursor-pointer text-sm tracking-wide"
            >
              <FaWhatsapp className="text-lg" />
              <span>Consultar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
    </>
  );
};

export default ProductModal;
