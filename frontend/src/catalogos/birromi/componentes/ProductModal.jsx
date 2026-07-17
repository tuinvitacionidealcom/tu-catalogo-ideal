import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ProductModal = ({ isOpen, onClose, product, whatsappNumber }) => {
  if (!isOpen || !product) return null;

  const { name, description, price, image, category, available = true } = product;

  const handleBuyDirect = () => {
    let message = `🍺 *CONSULTA DIRECTA DE PRODUCTO* 🍔\n\n`;
    message += `Hola! Estoy interesado en el siguiente producto de su catálogo:\n\n`;
    message += `- *${name}* ($${price.toLocaleString('es-AR')})\n`;
    message += `- _${description || 'Sin descripción'}_ \n\n`;
    message += `¿Tienen disponibilidad en este momento? ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 bg-brand/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center transition-all duration-300"
      onClick={onClose}
    >
      {/* Modal Container - Ocupa casi todo el alto en mobile y se desliza desde abajo */}
      <div 
        className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up border border-slate-100 flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header - Agrandada para ocupar más altura */}
        <div className="relative h-[40vh] sm:h-[35vh] w-full bg-slate-100 overflow-hidden shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-16 h-16 opacity-30" />
            </div>
          )}
          {/* Close Button overlay */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 bg-white/90 hover:bg-white text-brand p-2.5 rounded-full shadow-lg active:scale-90 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5 font-bold" />
          </button>

          {/* Category Tag */}
          <span className="absolute bottom-5 left-5 bg-brand text-accent text-[9px] uppercase font-black tracking-widest px-3.5 py-2 rounded-full shadow-lg border border-white/10">
            {category}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          <div>
            <h2 className="font-serif font-black text-2xl text-brand leading-tight">
              {name}
            </h2>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {available ? 'Stock Disponible' : 'Sin Stock Temporal'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Precio Sugerido</span>
            <span className="font-sans font-black text-2xl text-brand">
              ${price.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nota de cata e información</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium">
              {description || 'No hay descripción disponible para esta variedad.'}
            </p>
          </div>

          {!available && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center border border-red-100">
              Podés consultar si ingresa próximamente presionando el botón de abajo.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={handleBuyDirect}
            className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-sans font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/25 transition-all cursor-pointer text-sm tracking-wide"
          >
            <FaWhatsapp className="text-xl" />
            <span>Comprar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
