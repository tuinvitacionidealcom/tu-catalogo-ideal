import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ProductModal = ({ product, isOpen, onClose, onAddToCart, quantityInCart = 0, whatsappNumber = '5491131307799' }) => {
  if (!isOpen || !product) return null;

  const { id, name, description, price, image, category, available = true, sizes } = product;

  const sizesList = sizes ? sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
  const [selectedSize, setSelectedSize] = useState(sizesList[0] || '');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    } else {
      setSelectedSize('');
    }
    setQuantity(1);
  }, [product]);

  const handleAdd = () => {
    onAddToCart({
      ...product,
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
          {/* Image */}
          <div className="relative aspect-video w-full bg-slate-100">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-12 h-12 opacity-30" />
              </div>
            )}
            {category && (
              <span className="absolute bottom-3 left-3 bg-brand/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                {category}
              </span>
            )}
          </div>

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
