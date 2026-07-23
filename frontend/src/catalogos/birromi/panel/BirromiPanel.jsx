import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Edit3, Check, Store,
  ShoppingBag, BarChart2, MessageSquare, LogOut, TrendingUp,
  Eye, Users, Calendar, Loader2, Phone, Mail, Clock,
} from 'lucide-react';
import '../birromi.css';
import { BUSINESS_NAME, DEFAULT_HOURS, DEFAULT_ADDRESS } from '../config';
import { useAuth } from './useAuth';
import LoginPanel from './LoginPanel';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
const CATALOG_ID = 1; // ID del catálogo Birromi en la BD

const LOCAL_STORAGE_PRODUCTS_KEY = 'birromi_products_custom';
const LOCAL_STORAGE_INFO_KEY     = 'birromi_info_custom';

const defaultProducts = [
  { id: 1, name: 'Lata Clásica Ludus (1 Unidad)', description: 'Cerveza artesanal Ludus clásica. Variedades Golden, Honey o Scottish según disponibilidad.', price: 4500, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=60', category: 'LATAS CLÁSICAS', available: true },
  { id: 2, name: 'Promo 3x Latas Clásicas Ludus', description: 'Pack de 3 latas de variedades clásicas a elección. ¡Ideal para compartir!', price: 13000, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=60', category: 'PROMOS CLÁSICAS', available: true },
  { id: 3, name: 'Promo 6x Latas Clásicas Ludus', description: 'Pack de 6 latas de variedades clásicas. La mejor relación precio-calidad.', price: 24000, image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=600&auto=format&fit=crop&q=60', category: 'PROMOS CLÁSICAS', available: true },
  { id: 4, name: 'Lata IPA Ludus (1 Unidad)', description: 'Cerveza artesanal Ludus IPA / NEIPA con lúpulos seleccionados de aroma y amargor intenso.', price: 5000, image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop&q=60', category: 'LATAS IPAS', available: true },
  { id: 5, name: 'Promo 3x Latas IPAs Ludus', description: 'Pack de 3 latas de variedades lupuladas de la marca Ludus.', price: 14000, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&auto=format&fit=crop&q=60', category: 'PROMOS IPAS', available: true },
  { id: 6, name: 'Promo 6x Latas IPAs Ludus', description: 'Pack de 6 latas de variedades lupuladas Ludus.', price: 27000, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&auto=format&fit=crop&q=60', category: 'PROMOS IPAS', available: true },
  { id: 7, name: 'Promo Mundial Ludus', description: '¡Super Combo Especial! Una selección imperdible de latas clásicas y lúpulos premium.', price: 35000, image: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=600&auto=format&fit=crop&q=60', category: 'PROMO MUNDIAL', available: true },
];

const defaultInfo = {
  name: BUSINESS_NAME,
  description: 'Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.',
  address: DEFAULT_ADDRESS,
  phone: '5491139246425',
  instagram: '',
  hours: DEFAULT_HOURS,
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{
    background: '#fff', borderRadius: '16px', padding: '18px',
    border: '1px solid #f0ece8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</span>
      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={color} />
      </div>
    </div>
    <p style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{sub}</p>}
  </div>
);

// ── Componente principal ───────────────────────────────────────────────────────
const BirromiPanel = () => {
  const { user, loading: authLoading, error: authError, login, logout, getToken } = useAuth();

  const [products, setProducts]     = useState(defaultProducts);
  const [info, setInfo]             = useState(defaultInfo);
  const [activeTab, setActiveTab]   = useState('info');

  // Stats
  const [stats, setStats]           = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Consultas
  const [contacts, setContacts]     = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Product Form
  const [editingProduct, setEditingProduct]         = useState(null);
  const [newProductName, setNewProductName]         = useState('');
  const [newProductDesc, setNewProductDesc]         = useState('');
  const [newProductPrice, setNewProductPrice]       = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage]       = useState('');
  const [newProductAvailable, setNewProductAvailable] = useState(true);

  // ── Load localStorage ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('birromi-theme');
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    const savedInfo     = localStorage.getItem(LOCAL_STORAGE_INFO_KEY);
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedInfo)     setInfo(JSON.parse(savedInfo));
    return () => document.body.classList.remove('birromi-theme');
  }, []);

  // ── Fetch stats ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setStatsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/?request=visits/${CATALOG_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'ok') setStats(data.data);
    } catch { /* sin backend en dev */ }
    finally { setStatsLoading(false); }
  }, [getToken]);

  // ── Fetch contacts ─────────────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setContactsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/?request=contacts/${CATALOG_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'ok') setContacts(data.data);
    } catch { /* sin backend en dev */ }
    finally { setContactsLoading(false); }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      if (activeTab === 'stats')    fetchStats();
      if (activeTab === 'contacts') fetchContacts();
    }
  }, [activeTab, user, fetchStats, fetchContacts]);

  // ── Helpers localStorage ───────────────────────────────────────────────────
  const saveToLocalStorage = (updatedProducts, updatedInfo) => {
    if (updatedProducts) {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
    if (updatedInfo) {
      localStorage.setItem(LOCAL_STORAGE_INFO_KEY, JSON.stringify(updatedInfo));
      setInfo(updatedInfo);
    }
  };

  const handleInfoChange = e => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = e => {
    e.preventDefault();
    saveToLocalStorage(null, info);
    alert('Configuración guardada correctamente.');
  };

  const handleSaveProduct = e => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductCategory) {
      alert('Completá los campos obligatorios: Nombre, Precio y Categoría');
      return;
    }
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p =>
        p.id === editingProduct.id
          ? { ...p, name: newProductName, description: newProductDesc, price: parseFloat(newProductPrice), category: newProductCategory.toUpperCase(), image: newProductImage, available: newProductAvailable }
          : p
      );
      setEditingProduct(null);
    } else {
      const newProduct = {
        id: Date.now(), name: newProductName, description: newProductDesc,
        price: parseFloat(newProductPrice), category: newProductCategory.toUpperCase(),
        image: newProductImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
        available: newProductAvailable,
      };
      updatedProducts = [...products, newProduct];
    }
    saveToLocalStorage(updatedProducts, null);
    clearProductForm();
  };

  const handleEditProduct = product => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductDesc(product.description);
    setNewProductPrice(product.price);
    setNewProductCategory(product.category);
    setNewProductImage(product.image);
    setNewProductAvailable(product.available);
  };

  const handleDeleteProduct = id => {
    if (confirm('¿Seguro que querés eliminar este producto?')) {
      saveToLocalStorage(products.filter(p => p.id !== id), null);
    }
  };

  const clearProductForm = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice('');
    setNewProductCategory('');
    setNewProductImage('');
    setNewProductAvailable(true);
  };

  const formatDate = dateStr => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ── Auth Guard ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a0a00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#d4a017" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginPanel onLogin={login} loading={authLoading} error={authError} />;
  }

  // ── Tabs config ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'info',     label: 'Comercio',  icon: Store        },
    { id: 'products', label: `Productos (${products.length})`, icon: ShoppingBag },
    { id: 'stats',    label: 'Estadísticas', icon: BarChart2  },
    { id: 'contacts', label: 'Consultas', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-md flex flex-col">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-brand text-white p-4 flex items-center justify-between border-b border-white/10">
          <Link to="/birromi" className="text-white hover:text-accent transition-all flex items-center gap-1 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Catálogo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-accent" />
            <h1 className="font-sans font-extrabold text-base">{info.name || BUSINESS_NAME}</h1>
          </div>
          <button
            id="panel-logout-btn"
            onClick={logout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

        {/* ── User badge ──────────────────────────────────────────────────── */}
        <div style={{ background: '#faf8f5', borderBottom: '1px solid #f0ece8', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #b46414, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>{user.username?.[0]?.toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Sesión activa: <strong style={{ color: '#64748b' }}>{user.username}</strong></span>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px',
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid #b46414' : '2px solid transparent',
                color: activeTab === tab.id ? '#b46414' : '#94a3b8',
                background: activeTab === tab.id ? '#fff' : 'transparent',
              }}
            >
              <tab.icon style={{ width: '14px', height: '14px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="p-5 flex-1">

          {/* ── TAB: Información Comercial ─────────────────────────────── */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              {[
                { label: 'Nombre del Comercio', name: 'name', type: 'text', required: true },
                { label: 'WhatsApp (código + número, sin +)', name: 'phone', type: 'text', placeholder: 'Ej: 5491123456789', required: true },
                { label: 'Instagram (sin @)', name: 'instagram', type: 'text' },
                { label: 'Dirección Física', name: 'address', type: 'text' },
                { label: 'Horarios de Atención', name: 'hours', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={info[field.name] || ''}
                    onChange={handleInfoChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Descripción</label>
                <textarea
                  name="description"
                  value={info.description}
                  onChange={handleInfoChange}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="w-full bg-brand hover:bg-brand-light active:scale-95 text-white font-sans font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all mt-6 cursor-pointer">
                <Save className="w-4 h-4 text-accent" />
                <span>Guardar Cambios</span>
              </button>
            </form>
          )}

          {/* ── TAB: Productos ────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveProduct} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  {editingProduct ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                  <span>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                    <input type="text" placeholder="Ej. Burguer Bacon" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoría *</label>
                    <input type="text" placeholder="Ej. HAMBURGUESAS" value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-accent" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descripción</label>
                  <input type="text" placeholder="Detalle de ingredientes o especificaciones" value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Precio ($ ARS) *</label>
                    <input type="number" placeholder="Ej. 6500" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Imagen URL</label>
                    <input type="text" placeholder="Unsplash o link público" value={newProductImage} onChange={e => setNewProductImage(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-accent" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={newProductAvailable} onChange={e => setNewProductAvailable(e.target.checked)} className="rounded border-slate-300" />
                    <span>¿Hay Stock?</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {editingProduct && (
                      <button type="button" onClick={clearProductForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold py-2 px-3 rounded-lg cursor-pointer">Cancelar</button>
                    )}
                    <button type="submit" className="bg-brand hover:bg-brand-light text-white text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer">
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingProduct ? 'Actualizar' : 'Agregar'}</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Listado de Productos</h4>
                <div className="divide-y divide-slate-100">
                  {products.map(p => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.category} • ${p.price.toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleEditProduct(p)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-all cursor-pointer" title="Editar"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Estadísticas ─────────────────────────────────────────── */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Visitas del catálogo</h3>
                <button onClick={fetchStats} className="text-xs text-brand font-bold cursor-pointer hover:underline flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Actualizar
                </button>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-brand animate-spin" /></div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard icon={Eye}      label="Total visitas" value={stats.total.toLocaleString('es-AR')}      color="#b46414" />
                    <StatCard icon={Calendar} label="Hoy"           value={stats.today.toLocaleString('es-AR')}      color="#10b981" sub="visitas de hoy" />
                    <StatCard icon={TrendingUp} label="Esta semana" value={stats.last_7_days.toLocaleString('es-AR')} color="#6366f1" sub="últimos 7 días" />
                    <StatCard icon={Users}    label="Promedio/día"  value={stats.daily.length > 0 ? Math.round(stats.total / Math.max(stats.daily.length, 1)).toLocaleString('es-AR') : '—'} color="#f59e0b" sub="últ. 30 días" />
                  </div>

                  {stats.daily.length > 0 && (
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #f1f5f9' }}>
                      <p className="text-[11px] font-bold text-slate-500 uppercase mb-3">Visitas por día (últ. 30 días)</p>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
                        {(() => {
                          const max = Math.max(...stats.daily.map(d => d.visitas), 1);
                          return stats.daily.slice(-20).map((d, i) => (
                            <div key={i} title={`${d.fecha}: ${d.visitas} visitas`} style={{
                              flex: 1, minWidth: '6px',
                              height: `${Math.max((d.visitas / max) * 100, 6)}%`,
                              background: 'linear-gradient(180deg, #b46414, #d4a017)',
                              borderRadius: '3px 3px 0 0',
                              cursor: 'pointer', transition: 'opacity 0.2s',
                            }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            />
                          ));
                        })()}
                      </div>
                      <p style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '6px', textAlign: 'right' }}>
                        {stats.daily.length} días con actividad
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                  <BarChart2 style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Sin datos de visitas aún</p>
                  <p style={{ fontSize: '11px', marginTop: '4px' }}>Se registran automáticamente cuando alguien ve el catálogo</p>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Consultas ────────────────────────────────────────────── */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Consultas recibidas</h3>
                <button onClick={fetchContacts} className="text-xs text-brand font-bold cursor-pointer hover:underline flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Actualizar
                </button>
              </div>

              {contactsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-brand animate-spin" /></div>
              ) : contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.map(c => (
                    <div key={c.id} style={{
                      background: '#fff', border: '1px solid #f1f5f9', borderRadius: '14px',
                      padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #b46414, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{c.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', margin: 0 }}>{c.name}</p>
                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={9} />{formatDate(c.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px', lineHeight: 1.5, background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
                        {c.message}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {c.phone && (
                          <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <Phone size={11} />{c.phone}
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <Mail size={11} />{c.email}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                  <MessageSquare style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Sin consultas por ahora</p>
                  <p style={{ fontSize: '11px', marginTop: '4px' }}>Aparecen acá cuando alguien manda un mensaje desde el catálogo</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BirromiPanel;
