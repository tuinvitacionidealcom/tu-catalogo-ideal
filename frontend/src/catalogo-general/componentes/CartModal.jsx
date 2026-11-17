import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const CartModal = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  businessName = "Comercio",
  whatsappNumber = "5491131307799",
  catalogId = null,
  isServices = false,
  showDeliveryOptions = false,
  deliveryOptions = ['Envío a domicilio', 'Retiro en persona'],
  addressLabel = "Dirección o Zona / Localidad",
  addressPlaceholder = "Ej: Palermo, CABA",
  notesLabel = "Aclaraciones o fecha de evento / entrega",
  notesPlaceholder = "Ej: ¿Tienen disponibilidad para el próximo sábado?"
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState(
    deliveryOptions && deliveryOptions.length > 0 ? deliveryOptions[0] : 'Envío a domicilio'
  );
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasPricedItems = cartItems.some(i => i.price > 0);

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor ingresá tu nombre para que podamos atenderte mejor.');
      return;
    }

    let msg = `Hola *${businessName}*! 👋 Quiero hacer el siguiente pedido desde su catálogo online:\n\n`;
    msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    if (showDeliveryOptions && deliveryType) {
      msg += `📦 *Modalidad:* ${deliveryType}\n`;
    }
    if (address.trim()) {
      msg += `📍 *${addressLabel}:* ${address.trim()}\n`;
    }
    msg += `\n🛒 *DETALLE DEL PEDIDO:*\n`;

    cartItems.forEach((item, idx) => {
      const sizeStr = item.selectedSize ? ` [Talle/Opción: ${item.selectedSize}]` : '';
      const priceStr = item.price > 0 ? ` - $${(item.price * item.quantity).toLocaleString('es-AR')}` : '';
      msg += `${idx + 1}. *${item.quantity}x* ${item.name}${sizeStr}${priceStr}\n`;
    });

    if (hasPricedItems && totalPrice > 0) {
      msg += `\n💰 *TOTAL ESTIMADO:* $${totalPrice.toLocaleString('es-AR')}\n`;
    }

    if (notes.trim()) {
      msg += `\n📝 *${notesLabel}:* ${notes.trim()}\n`;
    }

    msg += `\n¿Me confirman disponibilidad y los pasos para coordinar? ¡Muchas gracias!`;

    // Intentar registrar el contacto en la base de datos de Hostinger
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
      if (catalogId) {
        fetch(`${API_BASE}/?request=contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            catalog_id: catalogId,
            name: customerName,
            phone: '',
            email: '',
            message: `Pedido por WhatsApp: ${cartItems.map(i => `${i.quantity}x ${i.name}`).join(', ')}`
          })
        }).catch(() => {});
      }
    } catch {}

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brand text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <div>
              <h2 className="font-bold text-base leading-tight">Tu Pedido</h2>
              <p className="text-[11px] text-white/70">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} seleccionados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 text-base mb-1">Tu carrito está vacío</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Agregá los productos o servicios que te interesen para armar tu pedido o presupuesto.
            </p>
            <button
              onClick={onClose}
              className="bg-brand text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs hover:bg-brand-dark transition-all cursor-pointer"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* List of items */}
            <div className="space-y-2.5">
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.id}-${item.selectedSize || ''}-${idx}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                    {item.selectedSize && (
                      <span className="text-[10px] text-brand font-semibold block">
                        Talle/Opción: {item.selectedSize}
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-slate-700">
                      {item.price > 0 ? `$${(item.price * item.quantity).toLocaleString('es-AR')}` : 'A consultar'}
                    </span>
                  </div>

                  {/* Quantities */}
                  <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-slate-200 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-brand transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedSize)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Customer Details Form */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Completá tus datos para el pedido
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Tu Nombre y Apellido *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Julieta Gómez"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              {/* Selector de Entrega / Retiro solo si el catálogo lo tiene configurado */}
              {showDeliveryOptions && deliveryOptions && deliveryOptions.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {deliveryOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeliveryType(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        deliveryType === opt
                          ? 'border-brand bg-brand/5 text-brand shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {addressLabel}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={addressPlaceholder}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {notesLabel}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={notesPlaceholder}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer with WhatsApp button */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            {hasPricedItems && totalPrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Estimado</span>
                <span className="text-lg font-black text-brand">
                  ${totalPrice.toLocaleString('es-AR')}
                </span>
              </div>
            )}

            <button
              onClick={handleSendOrder}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer text-sm"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>Enviar Pedido por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

