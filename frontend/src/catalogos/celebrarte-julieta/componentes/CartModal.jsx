import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Calendar, MapPin, Users, Type } from 'lucide-react';
import { useDialog } from '../../../components/ui/Dialog';
import { FaWhatsapp } from 'react-icons/fa';

const CartModal = ({ isOpen, onClose, cartItems, products = [], onAdd, onRemove, onClear, whatsappNumber }) => {
  const [customerName, setCustomerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Cumpleaños');
  const [eventLocation, setEventLocation] = useState('');
  const [eventGuests, setEventGuests] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Obtener imagen del producto desde la base de datos de productos
  const getProductImage = (prodId) => {
    const found = products.find(p => p.id === prodId);
    return found ? found.image : null;
  };

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor ingresá tu nombre');
      return;
    }
    if (!eventDate.trim()) {
      alert('Por favor indicá la fecha estimada del evento');
      return;
    }
    if (!eventLocation.trim()) {
      alert('Por favor indicá la zona o salón del evento');
      return;
    }

    // Formatear mensaje para WhatsApp
    let message = `🎉 *NUEVO PEDIDO DE PRESUPUESTO DESDE EL CATÁLOGO* 🌟\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📅 *Fecha del Evento:* ${eventDate}\n`;
    message += `🎭 *Tipo de Evento:* ${eventType}\n`;
    message += `📍 *Ubicación / Zona:* ${eventLocation}\n`;
    if (eventGuests) {
      message += `👥 *Cant. Invitados (aprox):* ${eventGuests}\n`;
    }
    message += `\n🛒 *Servicios de interés:*\n`;
    cartItems.forEach(item => {
      message += `- *${item.quantity}x* ${item.name} (${item.price > 0 ? '$' + (item.price * item.quantity).toLocaleString('es-AR') : 'Consultar precio'})\n`;
    });
    
    if (total > 0) {
      message += `\n💰 *Total estimado:* $${total.toLocaleString('es-AR')}\n\n`;
    } else {
      message += `\n\n`;
    }
    message += `¡Muchas gracias! Aguardo respuesta para avanzar con la propuesta.`;

    // Registrar clicks de productos en localStorage (para "Más Pedidos" del panel) y registrar en BD
    try {
      const LS_CLICKS = 'celebrarte_product_clicks';
      const clicks = JSON.parse(localStorage.getItem(LS_CLICKS) || '{}');
      const itemsList = [];

      cartItems.forEach(item => {
        clicks[item.id] = (clicks[item.id] || 0) + (item.quantity || 1);
        itemsList.push(`${item.quantity || 1}x ${item.name}`);
      });
      localStorage.setItem(LS_CLICKS, JSON.stringify(clicks));

      const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
      fetch(`${API_BASE}/?request=contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog_id: catalogId,
          name: 'Pedido de Presupuesto',
          phone: '',
          email: '',
          message: `Presupuesto para: ${itemsList.join(', ')} - Cliente: ${customerName}`
        })
      }).catch(() => {});
    } catch {}

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
      {/* Mobile focused Slide-over drawer */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-up rounded-none overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brand text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="font-sans font-bold text-lg">Tu Consulta</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col justify-between py-4">
              {/* Mensaje vacío */}
              <div className="flex flex-col items-center justify-center text-center py-6">
                <ShoppingBag className="w-14 h-14 text-slate-300 mb-3 animate-float" />
                <p className="text-slate-500 font-sans font-bold text-sm">Tu carrito está vacío</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">¡Agregá los servicios que te interesan para empezar!</p>
              </div>

              {/* Recomendados sugeridos */}
              <div className="border-t border-slate-100 pt-6 mt-4 text-left">
                <h4 className="text-[10px] font-sans font-black text-brand uppercase tracking-widest mb-4">
                  Servicios Populares
                </h4>
                
                <div className="space-y-3.5">
                  {[
                    { id: 1, name: 'Ambientaciones', price: 0, desc: 'Diseñamos y decoramos tu evento.' },
                    { id: 2, name: 'Fiesta del Té', price: 0, desc: 'Todo para una tarde de té.' },
                    { id: 3, name: 'Glitter Bar', price: 0, desc: 'Mucho brillo para tu fiesta.' }
                  ].map((prod) => {
                    const img = getProductImage(prod.id);
                    return (
                      <div 
                        key={prod.id} 
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between hover:shadow-xs transition-all gap-3"
                      >
                        {/* Imagen del producto */}
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                          {img ? (
                            <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ShoppingBag className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-sans font-bold text-slate-800 text-xs truncate">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{prod.desc}</p>
                          <p className="text-[10px] font-black text-brand mt-1">{prod.price > 0 ? '$' + prod.price.toLocaleString('es-AR') : 'Consultar'}</p>
                        </div>
                        
                        {/* Botón rápido de agregar */}
                        <button
                          onClick={() => onAdd({ ...prod, image: img, category: 'SERVICIOS', available: true })}
                          className="bg-brand hover:bg-brand-light text-accent p-2 rounded-xl active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
                          title="Agregar rápido"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón de cierre */}
              <button
                onClick={onClose}
                className="mt-6 w-full bg-brand text-accent font-sans font-black text-xs py-3.5 rounded-2xl cursor-pointer shadow-md hover:bg-brand-light active:scale-95 transition-all uppercase tracking-wider"
              >
                Volver al catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Servicios Seleccionados</h3>
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
                          {item.price > 0 ? '$' + item.price.toLocaleString('es-AR') + ' c/u' : 'Consultar Presupuesto'}
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

              {/* Event Info Form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">Datos del Evento</h3>
                
                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tu Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Lucas Ochoa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:border-brand"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Fecha Estimada *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-hidden focus:border-brand"
                    />
                  </div>
                </div>

                {/* Event Type & Guests Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tipo</label>
                    <div className="relative">
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:border-brand appearance-none"
                      >
                        <option value="Cumpleaños">Cumpleaños</option>
                        <option value="Boda">Boda</option>
                        <option value="15 Años">15 Años</option>
                        <option value="Infantil">Infantil</option>
                        <option value="Evento Corporativo">Corporativo</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Invitados</label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        placeholder="Ej. 50"
                        value={eventGuests}
                        onChange={(e) => setEventGuests(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-hidden focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Location */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ubicación / Salón *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ej. Salón en CABA o Dirección"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-hidden focus:border-brand"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            {total > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-500 text-sm">Costo base estimado:</span>
                <span className="font-sans font-black text-xl text-brand">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
            )}
            
            <button
              onClick={handleSendOrder}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold font-sans py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all cursor-pointer"
            >
              <FaWhatsapp className="text-xl" />
              <span>Solicitar Presupuesto</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
