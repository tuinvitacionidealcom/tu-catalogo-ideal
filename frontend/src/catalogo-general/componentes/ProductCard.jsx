import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, quantityInCart = 0, onAdd, onRemove, onClick, horizontalView = false }) => {
  const { id, name, description, price, image, category, available = true, sizes } = product;

  const sizesList = sizes ? sizes.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex cursor-pointer hover:border-brand/40 ${
        horizontalView ? 'flex-row h-32 sm:h-36' : 'flex-col h-full'
      }`}
    >
      {/* Product Image */}
      <div className={`relative bg-slate-100 overflow-hidden shrink-0 ${
        horizontalView ? 'w-28 sm:w-36 h-full' : 'aspect-video w-full'
      }`}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
        )}
        
        {/* Category Tag */}
        {category && (
          <span className="absolute top-2 left-2 bg-brand/90 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            {category}
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="p-3.5 flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <h3 className="font-sans font-bold text-slate-800 text-xs sm:text-sm leading-snug mb-0.5 truncate">{name}</h3>
          {description && (
            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
          )}

          {/* Sizes badges */}
          {sizesList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {sizesList.slice(0, 4).map(s => (
                <span key={s} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
              {sizesList.length > 4 && (
                <span className="text-[9px] font-semibold text-slate-400">+{sizesList.length - 4}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
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
                    aria-label="Restar uno"
                  >
                    <Minus className="w-3 h-3 text-slate-700" />
                  </button>
                  <span className="font-sans font-bold text-slate-800 text-xs w-4 text-center">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={() => onAdd(product)}
                    className="w-6 h-6 bg-brand hover:bg-brand-dark active:scale-90 transition-all rounded flex items-center justify-center shadow-xs cursor-pointer"
                    aria-label="Sumar uno"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAdd(product)}
                  className="bg-brand hover:bg-brand-dark active:scale-95 text-white text-[10px] font-bold font-sans py-2 px-3 rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer"
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
