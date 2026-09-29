import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper: parsear imágenes (soporta string suelto o JSON array)
const parseImages = (image) => {
  if (!image) return [];
  if (image.startsWith('[')) {
    try { return JSON.parse(image).filter(Boolean); } catch { return [image]; }
  }
  return [image];
};

// Mini carrusel interno de la card
const CardCarousel = ({ images, name, onClick }) => {
  const [idx, setIdx] = useState(0);

  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); };

  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? setIdx((i) => (i + 1) % images.length) : setIdx((i) => (i - 1 + images.length) % images.length);
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
      <img
        src={images[idx]}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />

      {images.length > 1 && (
        <>
          {/* Flechas */}
          <button
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center cursor-pointer transition-all z-10"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center cursor-pointer transition-all z-10"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  i === idx ? 'w-3.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product, quantityInCart = 0, onAdd, onRemove, onClick, horizontalView = false }) => {
  const { id, name, description, price, image, category, available = true } = product;
  const images = parseImages(image);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex cursor-pointer hover:border-accent/40 ${
        horizontalView ? 'flex-row h-32 sm:h-36' : 'flex-col h-full'
      }`}
    >
      {/* Product Image */}
      <div className={`relative bg-slate-100 overflow-hidden shrink-0 ${
        horizontalView ? 'w-28 sm:w-36 h-full' : 'aspect-video w-full'
      }`}>
        {images.length > 0 ? (
          <CardCarousel images={images} name={name} onClick={onClick} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400" onClick={onClick}>
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Category Tag */}
        <span className="absolute top-2 left-2 bg-brand/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full z-10 pointer-events-none">
          {category}
        </span>

        {!available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
            <span className="bg-red-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="p-3 flex flex-col flex-1 min-w-0 justify-between" onClick={onClick}>
        <div>
          <h3 className="font-sans font-bold text-slate-800 text-xs sm:text-sm leading-snug mb-0.5 truncate">{name}</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Precio</span>
            <span className="text-sm sm:text-base font-sans font-extrabold text-brand leading-none">
              {price > 0 ? `$${price.toLocaleString('es-AR')}` : 'Consultar'}
            </span>
          </div>

          {/* Add to Cart Actions */}
          {available && (
            <div onClick={(e) => e.stopPropagation()}>
              {quantityInCart > 0 ? (
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => onRemove(id)}
                    className="w-6 h-6 bg-white hover:bg-slate-200 active:scale-90 transition-all rounded flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Minus className="w-3 h-3 text-slate-700" />
                  </button>
                  <span className="font-sans font-bold text-slate-800 text-xs w-4 text-center">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={() => onAdd(product)}
                    className="w-6 h-6 bg-brand hover:bg-brand-light active:scale-90 transition-all rounded flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAdd(product)}
                  className="bg-brand hover:bg-brand-light active:scale-95 text-white text-[10px] font-bold font-sans py-2 px-3 rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Agregar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
