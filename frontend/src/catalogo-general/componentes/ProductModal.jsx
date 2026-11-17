import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const getProductImages = (imgData) => {
  if (!imgData) return [];
  if (Array.isArray(imgData)) return imgData.filter(Boolean);
  if (typeof imgData === 'string') {
    const trimmed = imgData.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [trimmed].filter(Boolean);
  }
  return [];
};

const ProductModal = ({ product, isOpen, onClose, onAddToCart, quantityInCart = 0, whatsappNumber = '5491131307799' }) => {
  if (!isOpen || !product) return null;

  const { id, name, description, price, image, category, available = true, sizes } = product;

  const images = getProductImages(image);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const sizesList = sizes ? sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
  const [selectedSize, setSelectedSize] = useState(sizesList[0] || '');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImageIdx(0);
    if (sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    } else {
      setSelectedSize('');
    }
    setQuantity(1);
  }, [product]);

  const handleNextImage = () => {
    if (images.length > 1) {
      setActiveImageIdx((activeImageIdx + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) {
      setActiveImageIdx((activeImageIdx - 1 + images.length) % images.length);
    }
  };

  const currentDisplayImage = images[activeImageIdx] || images[0] || '';

  const handleAdd = () => {
    onAddToCart({
      ...product,
      image: currentDisplayImage,
      selectedSize: selectedSize || null,
      customQuantity: quantity
    });
    onClose();
  };

  const handleDirectWhatsApp = () => {
    let msg = `Hola! Te consulto por el siguiente servicio/producto de tu catálogo:\n\n`;
    msg += `📌 *${name}*\n`;
    if (price > 0) {
      msg += `💰 *Precio:* $${price.toLocaleString('es-AR')}\n`;
    }
    if (selectedSize) {
      msg += `📏 *Talle/Opción:* ${selectedSize}\n`;
    }
    if (description) {
      msg += `📝 *Detalle:* ${description}\n`;
    }
    msg += `\n¿Podrías darme más información y disponibilidad? ¡Muchas gracias!`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md backdrop-blur-xs transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1">
          {/* Gallery / Image Carousel */}
          <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
            {currentDisplayImage ? (
              <img
                src={currentDisplayImage}
                alt={name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-12 h-12 opacity-30" />
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter Badge */}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {activeImageIdx + 1} / {images.length}
                </span>
              </>
            )}

            {category && (
              <span className="absolute bottom-3 left-3 bg-brand/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                {category}
              </span>
            )}
          </div>

          {/* Thumbnails strip */}
          {images.length > 1 && (
            <div className="flex gap-2 px-6 pt-3 overflow-x-auto scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-brand scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight mb-2">
              {name}
            </h2>

            {/* Price */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Precio</span>
              <span className="text-2xl font-extrabold text-brand">
                {price > 0 ? `$${price.toLocaleString('es-AR')}` : 'Consultar'}
              </span>
            </div>

            {/* Sizes selector */}
            {sizesList.length > 0 && (
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Elegí tu Talle / Medida:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-brand text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Descripción
                </span>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {available ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-white hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-800 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-white hover:bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-brand hover:bg-brand-dark active:scale-98 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar al Pedido</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold">
                  Producto actualmente sin stock
                </div>
              )}

              {/* Direct WhatsApp button */}
              <button
                onClick={handleDirectWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Consultar directo por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

