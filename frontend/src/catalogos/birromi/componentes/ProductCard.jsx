import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, quantityInCart = 0, onAdd, onRemove, onClick }) => {
  const { id, name, description, price, image, category, available = true } = product;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer hover:border-accent/40"
    >
      {/* Product Image */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
        )}
        
        {/* Category Tag */}
        <span className="absolute top-2 left-2 bg-brand/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
          {category}
        </span>

        {!available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-xs uppercase px-3 py-1 rounded-md">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-sans font-bold text-slate-800 text-sm leading-snug mb-1">{name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Precio</span>
            <span className="text-base font-sans font-extrabold text-brand">
              ${price.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Add to Cart Actions */}
          {available && (
            <div onClick={(e) => e.stopPropagation()}>
              {quantityInCart > 0 ? (
                <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => onRemove(id)}
                    className="w-7 h-7 bg-white hover:bg-slate-200 active:scale-90 transition-all rounded-md flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5 text-slate-700" />
                  </button>
                  <span className="font-sans font-bold text-slate-800 text-sm w-4 text-center">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={() => onAdd(product)}
                    className="w-7 h-7 bg-brand hover:bg-brand-light active:scale-90 transition-all rounded-md flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAdd(product)}
                  className="bg-brand hover:bg-brand-light active:scale-95 text-white text-xs font-bold font-sans py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
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
