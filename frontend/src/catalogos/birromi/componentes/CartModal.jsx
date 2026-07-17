import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const CartModal = ({ isOpen, onClose, cartItems, onAdd, onRemove, onClear, whatsappNumber }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('takeaway'); // 'takeaway' or 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'transfer'

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor ingresá tu nombre');
      return;
    }
    if (deliveryMethod === 'delivery' && !customerAddress.trim()) {
      alert('Por favor ingresá tu dirección para el envío');
      return;
    }

    // Formatear mensaje para WhatsApp
    let message = `🍺 *PEDIDO DESDE EL CATÁLOGO DIGITAL* 🍔\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `🛵 *Entrega:* ${deliveryMethod === 'delivery' ? 'Envío a domicilio' : 'Retiro por local'}\n`;
    if (deliveryMethod === 'delivery') {
      message += `📍 *Dirección:* ${customerAddress}\n`;
    }
    message += `💳 *Pago:* ${paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia Bancaria'}\n\n`;
    
    message += `🛒 *Detalle del Pedido:*\n`;
    cartItems.forEach(item => {
      message += `- *${item.quantity}x* ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})\n`;
    });
    
    message += `\n💵 *Total a Pagar:* $${total.toLocaleString('es-AR')}\n\n`;
    message += `¡Muchas gracias! Espero la confirmación.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
      {/* Mobile focused Slide-over drawer */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-up rounded-l-3xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brand text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="font-sans font-bold text-lg">Tu Pedido</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-slate-300 mb-4 animate-float" />
              <p className="text-slate-500 font-sans font-medium text-sm">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="mt-4 bg-brand text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Productos</h3>
                  <button onClick={onClear} className="text-red-500 text-xs flex items-center gap-1 hover:underline cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <p className="font-sans font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400 font-medium">
                          ${item.price.toLocaleString('es-AR')} c/u
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => onAdd(item)}
                          className="w-7 h-7 bg-brand text-white hover:bg-brand-light rounded-md flex items-center justify-center font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info Form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Datos de Entrega</h3>
                
                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tu Nombre</label>
                  <input
                    type="text"
                    placeholder="Ej. Lucas Ochoa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:border-accent"
                  />
                </div>

                {/* Delivery Method Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Método de entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryMethod('takeaway')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        deliveryMethod === 'takeaway'
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Retiro por Local
                    </button>
                    <button
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        deliveryMethod === 'delivery'
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Envío a Domicilio
                    </button>
                  </div>
                </div>

                {/* Address (If delivery) */}
                {deliveryMethod === 'delivery' && (
                  <div className="animate-slide-up">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      placeholder="Ej. Av. de Mayo 1234, Dpto 2B"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:border-accent"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Medio de Pago</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Efectivo
                    </button>
                    <button
                      onClick={() => setPaymentMethod('transfer')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'transfer'
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Transferencia
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 text-sm">Total estimado:</span>
              <span className="font-sans font-black text-xl text-brand">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            
            <button
              onClick={handleSendOrder}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold font-sans py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all cursor-pointer"
            >
              <FaWhatsapp className="text-xl" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
