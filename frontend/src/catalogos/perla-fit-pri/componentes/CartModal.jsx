import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MapPin, Ruler } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CartModal = ({ isOpen, onClose, cartItems, products = [], onAdd, onRemove, onClear, whatsappNumber }) => {
  const [customerName, setCustomerName] = useState('');
  const [itemSizes, setItemSizes] = useState({});
  const [localidad, setLocalidad] = useState('');
  const [nota, setNota] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getProductImage = (prodId) => {
    const found = products.find(p => p.id === prodId);
    if (!found?.image) return null;
    const img = found.image;
    if (img.startsWith('[')) {
      try { const arr = JSON.parse(img); return arr[0] || null; } catch { return img; }
    }
    return img;
  };

  const handleSendOrder = () => {
    if (!customerName.trim()) { alert('Por favor ingresá tu nombre'); return; }
    const missingSize = cartItems.some(item => !itemSizes[item.id]);
    if (missingSize) { alert('Por favor seleccioná el talle para todas las prendas'); return; }
    if (!localidad.trim()) { alert('Por favor indicá tu localidad o dirección de envío'); return; }

    let message = `*NUEVO PEDIDO - PERLA FIT*\n\n`;
    message += `*Nombre:* ${customerName}\n`;
    message += `*Localidad / Direccion:* ${localidad}\n`;
    if (nota.trim()) message += `*Nota:* ${nota}\n`;
    message += `\n*Prendas seleccionadas:*\n`;
    cartItems.forEach(item => {
      const precio = item.price > 0 ? `$${(item.price * item.quantity).toLocaleString('es-AR')}` : 'Consultar precio';
      const talle = itemSizes[item.id];
      message += `  - ${item.quantity}x ${item.name} (Talle: ${talle}) (${precio})\n`;
    });
    if (total > 0) {
      message += `\n*Total estimado:* $${total.toLocaleString('es-AR')}\n`;
    }
    message += `\nMuchas gracias! Quedo esperando respuesta.`;

    try {
      const LS_CLICKS = 'perlafit_product_clicks';
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
          catalog_id: 0,
          name: customerName,
          phone: '',
          email: '',
          message: `Pedido de: ${itemsList.join(', ')} - Localidad: ${localidad}`
        })
      }).catch(() => {});
    } catch {}

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-up rounded-none overflow-hidden">

        {/* ── Header ── */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-brand text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <div>
              <h2 className="font-sans font-black text-base leading-none">Tu Pedido</h2>
              <p className="text-[10px] text-white/50 font-medium mt-0.5">
                {cartItems.length > 0 ? `${cartItems.reduce((a, i) => a + i.quantity, 0)} prenda${cartItems.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}` : 'Vacío'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* ── Contenido ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col justify-between py-4">
              <div className="flex flex-col items-center justify-center text-center py-8">
                <ShoppingBag className="w-14 h-14 text-slate-200 mb-4" />
                <p className="text-slate-600 font-sans font-black text-sm">Tu pedido está vacío</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">¡Agregá las prendas que te gusten para consultar!</p>
              </div>

              {/* Sugeridos */}
              {products && products.length > 0 && (
                <div className="border-t border-slate-100 pt-5">
                  <h4 className="text-[10px] font-sans font-black text-brand uppercase tracking-widest mb-4">Prendas destacadas</h4>
                  <div className="space-y-3">
                    {products.slice(0, 3).map(prod => {
                      const img = getProductImage(prod.id);
                      return (
                        <div key={prod.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3 hover:shadow-xs transition-all">
                          <div className="w-11 h-11 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                            {img ? <img src={img} alt={prod.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 m-auto text-slate-400 opacity-40 mt-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-bold text-slate-800 text-xs truncate">{prod.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{prod.description || 'Consultar detalles'}</p>
                          </div>
                          <button
                            onClick={() => onAdd(prod)}
                            className="bg-brand text-white w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-brand-light active:scale-90 transition-all shrink-0"
                          >+</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button onClick={onClose} className="mt-5 w-full bg-brand text-accent font-sans font-black text-xs py-3.5 rounded-2xl cursor-pointer hover:bg-brand-light active:scale-95 transition-all uppercase tracking-wider">
                Volver al catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Lista de prendas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-sm">Prendas seleccionadas</h3>
                  <button onClick={onClear} className="text-red-400 text-xs flex items-center gap-1 hover:underline cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                </div>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 px-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-3 flex flex-col gap-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-bold text-slate-800 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {item.price > 0 ? `$${item.price.toLocaleString('es-AR')} c/u` : 'Precio a consultar'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => onRemove(item.id)} className="w-7 h-7 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 cursor-pointer text-sm">−</button>
                          <span className="w-5 text-center font-black text-slate-800 text-sm">{item.quantity}</span>
                          <button onClick={() => onAdd(item)} className="w-7 h-7 bg-brand text-white hover:bg-brand-light rounded-lg flex items-center justify-center font-bold cursor-pointer text-sm">+</button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wide flex items-center gap-1">
                          <Ruler className="w-3 h-3" /> Elegí el talle *
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                          {((item.sizes && item.sizes.trim()) ? item.sizes.split(',').map(s => s.trim()).filter(Boolean) : TALLES).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setItemSizes(prev => ({ ...prev, [item.id]: t }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                                itemSizes[item.id] === t
                                  ? 'bg-brand text-white border-brand shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand/50'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario de envío */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-black text-slate-800 text-sm border-b border-slate-200 pb-2.5 flex items-center gap-2">
                  <span className="w-5 h-5 bg-brand rounded-md flex items-center justify-center text-[10px] text-accent">✓</span>
                  Completá tus datos
                </h3>

                {/* Nombre */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Valentina García"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                {/* Localidad */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Localidad / Dirección de envío *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Palermo, CABA"
                    value={localidad}
                    onChange={e => setLocalidad(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                {/* Nota opcional */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Aclaración / Nota (opcional)</label>
                  <textarea
                    placeholder="Ej. ¿Tienen en color negro? ¿Hacen intercambio?"
                    value={nota}
                    onChange={e => setNota(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white space-y-3">
            {total > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-bold">Total estimado</span>
                <span className="font-sans font-black text-xl text-brand">${total.toLocaleString('es-AR')}</span>
              </div>
            )}
            <button
              onClick={handleSendOrder}
              className="w-full bg-brand hover:bg-brand-light active:scale-95 text-white font-black font-sans py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-brand/20 transition-all cursor-pointer text-sm"
            >
              <FaWhatsapp className="text-xl" />
              <span>Enviar pedido</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
