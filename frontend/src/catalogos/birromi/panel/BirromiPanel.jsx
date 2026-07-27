import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, Save, Plus, Trash2, Edit3, Store, ShoppingBag, BarChart2,
  MessageSquare, LogOut, TrendingUp, Eye, Calendar, Loader2, Phone,
  Mail, Clock, Flame, Minus, Package, Check, Users,
} from 'lucide-react';
import '../birromi.css';
import { BUSINESS_NAME, DEFAULT_HOURS, DEFAULT_ADDRESS } from '../config';
import { useAuth } from './useAuth';
import LoginPanel from './LoginPanel';
import { useDialog } from '../../../components/ui/Dialog';

const API_BASE    = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
const LS_PRODUCTS = 'birromi_products_custom';
const LS_INFO     = 'birromi_info_custom';
const LS_CLICKS   = 'birromi_product_clicks';

const DARK  = '#1a0800';
const BRAND = '#c17f3c';
const BG    = '#f5f2ee';

// ── Default data ──────────────────────────────────────────────────────────────
const defaultProducts = [
  { id: 1, name: 'Blonde Ale (Rubia)', description: 'Cerveza artesanal clásica dorada, ligera y refrescante.', price: 4500, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=60', category: 'LATAS CLÁSICAS', available: true, stock: 50 },
  { id: 2, name: 'Irish Red', description: 'Color rojizo profundo, maltosa con notas a caramelo.', price: 4500, image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop&q=60', category: 'LATAS CLÁSICAS', available: true, stock: 30 },
  { id: 3, name: 'Stout (Negra)', description: 'Cerveza oscura, notas a chocolate amargo y café tostado.', price: 4500, image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=600&auto=format&fit=crop&q=60', category: 'LATAS CLÁSICAS', available: true, stock: 20 },
  { id: 4, name: 'Lata IPA Ludus', description: 'Lúpulos cítricos y amargor persistente característico.', price: 5000, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&auto=format&fit=crop&q=60', category: 'LATAS IPAS', available: true, stock: 40 },
  { id: 5, name: 'Doble NEIPA Argenta', description: 'Extremadamente turbia y jugosa. Explosión de aroma tropical.', price: 5000, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=60', category: 'LATAS IPAS', available: true, stock: 15 },
  { id: 6, name: 'West Coast IPA', description: 'Amargor clásico con lúpulos del pacífico. Bien seca y refrescante.', price: 5000, image: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=600&auto=format&fit=crop&q=60', category: 'LATAS IPAS', available: true, stock: 25 },
  { id: 7, name: 'Promo 6x Mix', description: 'Elegí 6 latas entre toda la variedad disponible.', price: 27000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', category: 'PROMOS', available: true, stock: 10 },
];

const defaultInfo = {
  name: BUSINESS_NAME,
  description: 'Distribuidora oficial de cervezas artesanales Ludus.',
  address: DEFAULT_ADDRESS,
  phone: '5491139246425',
  instagram: '',
  hours: DEFAULT_HOURS,
};

const emptyProduct = { id: null, name: '', description: '', price: '', category: '', image: '', available: true, stock: 0 };

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'products', label: 'Productos',     Icon: ShoppingBag,  emoji: '📦' },
  { id: 'info',     label: 'Mi Comercio',   Icon: Store,        emoji: '🏪' },
  { id: 'popular',  label: 'Más Pedidos',   Icon: Flame,        emoji: '🔥' },
  { id: 'stats',    label: 'Estadísticas',  Icon: BarChart2,    emoji: '📊' },
  { id: 'contacts', label: 'Consultas',     Icon: MessageSquare,emoji: '💬' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatWhatsAppNumber = (rawPhone) => {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('00')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
  
  if (!cleaned.startsWith('54')) {
    if (cleaned.length === 12 && cleaned.substring(2, 4) === '15') {
      cleaned = cleaned.slice(0, 2) + cleaned.slice(4);
    }
    if (cleaned.length === 10) {
      cleaned = '549' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('9')) {
      cleaned = '54' + cleaned;
    } else if (cleaned.length > 10) {
      if (cleaned.length === 12 && cleaned.substring(2, 4) === '15') {
        cleaned = cleaned.slice(0, 2) + cleaned.slice(4);
      } else if (cleaned.length === 13 && cleaned.substring(3, 5) === '15') {
        cleaned = cleaned.slice(0, 3) + cleaned.slice(5);
      } else if (cleaned.length === 14 && cleaned.substring(4, 6) === '15') {
        cleaned = cleaned.slice(0, 4) + cleaned.slice(6);
      }
      if (cleaned.length === 10) {
        cleaned = '549' + cleaned;
      }
    }
  } else {
    if (cleaned.length === 12) {
      cleaned = '549' + cleaned.slice(2);
    }
    if (cleaned.length === 15 && cleaned.substring(3, 5) === '9' && cleaned.substring(5, 7) === '15') {
      cleaned = cleaned.slice(0, 5) + cleaned.slice(7);
    }
    if (cleaned.length === 14 && cleaned.substring(2, 5) === '915') {
      cleaned = cleaned.slice(0, 3) + cleaned.slice(5);
    }
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('9')) {
    cleaned = '54' + cleaned;
  }
  if (cleaned.length === 8) {
    cleaned = '54911' + cleaned;
  }
  return cleaned;
};

const getClickCounts = () => {
  try { return JSON.parse(localStorage.getItem(LS_CLICKS) || '{}'); } catch { return {}; }
};

// ── Sheet Modal (slide desde abajo) ──────────────────────────────────────────
const Sheet = ({ open, onClose, title, children }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: '#fff', borderRadius: '24px 24px 0 0',
          padding: '8px 20px 36px',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
          maxHeight: '92vh', overflowY: 'auto',
          animation: 'sheetUp 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e2e8f0' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: DARK, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #f0ece8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</span>
      <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={14} color={color} />
      </div>
    </div>
    <p style={{ fontSize: '26px', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{sub}</p>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const BirromiPanel = () => {
  const { user, loading: authLoading, error: authError, login, logout, getToken } = useAuth();
  const dialog = useDialog();

  // UI state
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('products');

  // Modals
  const [productModal, setProductModal] = useState({ open: false, mode: 'add', data: { ...emptyProduct } });
  const [stockModal, setStockModal]     = useState({ open: false, product: null, input: '' });

  // Data
  const [products, setProducts]       = useState(defaultProducts);
  const [info, setInfo]               = useState(defaultInfo);
  const [clickCounts, setClickCounts] = useState({});

  // Backend
  const [stats, setStats]                     = useState(null);
  const [statsLoading, setStatsLoading]       = useState(false);
  const [contacts, setContacts]               = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  // ── Init ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('birromi-theme');
    const sp = localStorage.getItem(LS_PRODUCTS);
    const si = localStorage.getItem(LS_INFO);
    if (sp) setProducts(JSON.parse(sp));
    if (si) setInfo(JSON.parse(si));
    setClickCounts(getClickCounts());
    return () => document.body.classList.remove('birromi-theme');
  }, []);

  // ── Persist ────────────────────────────────────────────────────────────────────
  const saveProducts = (updated) => {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(updated));
    setProducts(updated);
  };

  const fetchProductsFromDB = useCallback(async () => {
    const catalogId = user?.catalog_id || 1;
    try {
      const res = await fetch(`${API_BASE}/?request=products/${catalogId}`);
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.data)) {
        const dbProducts = data.data.map(p => {
          if (!p.image || p.image.trim() === '') {
            const defaultProd = defaultProducts.find(dp => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
            if (defaultProd) {
              p.image = defaultProd.image;
            }
          }
          return p;
        });
        setProducts(dbProducts);
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(dbProducts));
      }
    } catch {}
  }, [user?.catalog_id]);

  const fetchStats = useCallback(async () => {
    const token = getToken();
    const catalogId = user?.catalog_id || 1;
    if (!token) {
      setStatsLoading(false);
      return;
    }
    setStatsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/?request=visits/${catalogId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'ok') {
        setStats(data.data);
      } else {
        setStats({ total: 0, today: 0, last_7_days: 0, daily: [] });
      }
    } catch {
      setStats({ total: 0, today: 0, last_7_days: 0, daily: [] });
    } finally {
      setStatsLoading(false);
    }
  }, [getToken, user?.catalog_id]);

  const fetchContacts = useCallback(async () => {
    const token = getToken();
    const catalogId = user?.catalog_id || 1;
    if (!token) {
      setContactsLoading(false);
      return;
    }
    setContactsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/?request=contacts/${catalogId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'ok') {
        setContacts(data.data);
      } else {
        setContacts([]);
      }
    } catch {
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  }, [getToken, user?.catalog_id]);

  useEffect(() => {
    if (!user) return;
    setClickCounts(getClickCounts());
    fetchProductsFromDB();
    if (activeSection === 'stats')    fetchStats();
    if (activeSection === 'contacts') fetchContacts();
  }, [activeSection, user?.catalog_id, fetchStats, fetchContacts, fetchProductsFromDB]);

  // ── Product CRUD ──────────────────────────────────────────────────────────────
  const openAdd  = () => setProductModal({ open: true, mode: 'add', data: { ...emptyProduct } });
  const openEdit = (p) => setProductModal({ open: true, mode: 'edit', data: { ...p } });
  const closeProductModal = () => setProductModal(prev => ({ ...prev, open: false }));

  const setPField = (key, val) =>
    setProductModal(prev => ({ ...prev, data: { ...prev.data, [key]: val } }));

  const handleSaveProduct = async () => {
    const p = productModal.data;
    if (!p.name?.trim() || !p.price || !p.category?.trim()) {
      await dialog.error('Completá Nombre, Precio y Categoría');
      return;
    }
    const clean = {
      ...p,
      catalog_id: user?.catalog_id || 1,
      price:    parseFloat(p.price),
      category: p.category.toUpperCase().trim(),
      stock:    Math.max(0, parseInt(p.stock) || 0),
      image:    p.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
    };

    // Guardar en MySQL Backend
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/?request=products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clean)
      });
      const data = await res.json();
      if (data.status === 'ok' && data.id) {
        clean.id = data.id;
      }
    } catch (err) {
      console.warn('Error al guardar producto en MySQL:', err);
    }

    const isAdd = productModal.mode === 'add';
    if (isAdd) {
      saveProducts([...products.filter(x => x.id !== clean.id), clean]);
    } else {
      saveProducts(products.map(x => x.id === p.id ? clean : x));
    }
    closeProductModal();
    await dialog.success(isAdd ? 'Producto agregado con éxito.' : 'Producto guardado con éxito.');
  };

  const handleDelete = async (id) => {
    const confirmed = await dialog.danger('¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmed) {
      try {
        const token = getToken();
        await fetch(`${API_BASE}/?request=products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
      saveProducts(products.filter(p => p.id !== id));
      await dialog.success('Producto eliminado con éxito.');
    }
  };

  // ── Stock ─────────────────────────────────────────────────────────────────────
  const nudgeStock = (id, delta) =>
    saveProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p));

  const openStockModal = (product) =>
    setStockModal({ open: true, product, input: String(product.stock || 0) });

  const saveStock = async () => {
    const val = parseInt(stockModal.input);
    if (!isNaN(val) && val >= 0) {
      saveProducts(products.map(p => p.id === stockModal.product.id ? { ...p, stock: val } : p));
      setStockModal({ open: false, product: null, input: '' });
      await dialog.success('Stock actualizado con éxito.');
    } else {
      setStockModal({ open: false, product: null, input: '' });
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────────
  const goTo = (section) => { setActiveSection(section); setDrawerOpen(false); };

  // ── Popular ───────────────────────────────────────────────────────────────────
  const popular = [...products]
    .map(p => ({ ...p, clicks: clickCounts[p.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks);

  const formatDate = (d) => !d ? '—' : new Date(d).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  // ── Auth guard ────────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} color="#d4a017" style={{ animation: 'panelSpin 1s linear infinite' }} />
      <style>{`@keyframes panelSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!user) return <LoginPanel onLogin={login} loading={authLoading} error={authError} />;

  const activeNav = NAV.find(n => n.id === activeSection);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter', sans-serif", maxWidth: '480px', margin: '0 auto', position: 'relative' }}>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes panelSpin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sheetUp    { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes drawerSlide{ from { transform: translateX(-100%); } to { transform: translateX(0); } }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>

      {/* ── Drawer overlay ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 500, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ── Drawer ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '268px', height: '100dvh',
        background: DARK, zIndex: 600,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: drawerOpen ? '8px 0 32px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Drawer user section */}
        <div style={{ padding: '20px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Menú</span>
            <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
          {/* Avatar + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #b46414, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(180,100,20,0.4)' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{user.username?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>{info.name || BUSINESS_NAME}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '2px 0 0', fontWeight: 600 }}>@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(193,127,60,0.18)' : 'transparent',
                  color: active ? '#d4a017' : 'rgba(255,255,255,0.55)',
                  fontWeight: 700, fontSize: '14px', marginBottom: '2px',
                  transition: 'all 0.15s',
                  borderLeft: `3px solid ${active ? '#d4a017' : 'transparent'}`,
                  textAlign: 'left',
                }}
              >
                <item.Icon size={16} />
                <span>{item.emoji} {item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link
            to="/mr-bebidas"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}
            onClick={() => setDrawerOpen(false)}
          >
            <Eye size={14} />Ver catálogo
          </Link>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            <LogOut size={14} />Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Header ── */}
      <header style={{
        background: DARK, padding: '0 16px', height: '58px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
      }}>
        <button
          id="burger-menu-btn"
          onClick={() => setDrawerOpen(true)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Menu size={18} color="#fff" />
        </button>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>{info.name || BUSINESS_NAME}</p>
          <p style={{ fontSize: '10px', color: BRAND, margin: 0, fontWeight: 600 }}>{activeNav?.emoji} {activeNav?.label}</p>
        </div>

        {/* Avatar en header */}
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #b46414, #d4a017)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(180,100,20,0.4)' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{user.username?.[0]?.toUpperCase()}</span>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ padding: '18px 16px 60px' }}>

        {/* ─────────────────── PRODUCTOS ─────────────────── */}
        {activeSection === 'products' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: DARK }}>Productos</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{products.length} productos • {products.filter(p => p.available).length} disponibles</p>
              </div>
              <button
                id="add-product-btn"
                onClick={openAdd}
                style={{ background: `linear-gradient(135deg, #b46414, ${BRAND})`, border: 'none', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 16px rgba(180,100,20,0.3)', flexShrink: 0 }}
              >
                <Plus size={15} />Agregar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map(p => {
                const stockLow  = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
                const stockOut  = (p.stock || 0) === 0;
                return (
                  <div key={p.id} style={{
                    background: '#fff', borderRadius: '18px', padding: '14px',
                    border: '1px solid #f0ece8',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.2s',
                  }}>
                    {/* Product info row */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={p.image} alt={p.name} style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover' }} />
                        {/* Disponibilidad badge */}
                        <div style={{
                          position: 'absolute', bottom: '-4px', right: '-4px',
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: p.available ? '#10b981' : '#ef4444',
                          border: '2px solid #fff',
                        }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 800, color: DARK, lineHeight: 1.3 }}>{p.name}</p>
                        <p style={{ margin: '0 0 6px', fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{p.category}</p>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: BRAND }}>${p.price.toLocaleString('es-AR')}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                        <button
                          onClick={() => openEdit(p)}
                          title="Editar"
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '9px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Edit3 size={13} color="#64748b" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Eliminar"
                          style={{ background: '#fef2f2', border: 'none', borderRadius: '9px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </div>

                    {/* Stock row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: stockOut ? '#fef2f2' : stockLow ? '#fffbeb' : '#f8f7f5',
                      borderRadius: '12px', padding: '9px 12px',
                      border: `1px solid ${stockOut ? '#fecaca' : stockLow ? '#fde68a' : '#f0ece8'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={12} color={stockOut ? '#ef4444' : stockLow ? '#f59e0b' : '#94a3b8'} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: stockOut ? '#ef4444' : stockLow ? '#f59e0b' : '#64748b' }}>
                          {stockOut ? '⚠ Sin stock' : stockLow ? '⚠ Stock bajo' : 'Stock disponible'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <button
                          onClick={() => nudgeStock(p.id, -1)}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <Minus size={11} color="#64748b" />
                        </button>
                        <button
                          onClick={() => openStockModal(p)}
                          title="Tocar para editar cantidad"
                          style={{
                            background: stockOut ? '#ef4444' : BRAND,
                            border: 'none', borderRadius: '9px',
                            minWidth: '40px', height: '28px', padding: '0 10px',
                            color: '#fff', fontWeight: 800, fontSize: '14px',
                            cursor: 'pointer', transition: 'transform 0.1s',
                            flexShrink: 0,
                          }}
                          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {p.stock || 0}
                        </button>
                        <button
                          onClick={() => nudgeStock(p.id, 1)}
                          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <Plus size={11} color="#64748b" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────── MI COMERCIO ─────────────────── */}
        {activeSection === 'info' && (
          <form
            onSubmit={async e => {
              e.preventDefault();
              localStorage.setItem(LS_INFO, JSON.stringify(info));
              await dialog.success('Los datos del comercio fueron guardados correctamente.');
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: DARK }}>Mi Comercio</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Datos que se muestran en el catálogo</p>
            </div>

            {[
              { label: 'Nombre del Comercio', key: 'name', required: true },
              { label: 'WhatsApp (código + número, sin +)', key: 'phone', placeholder: '5491123456789', required: true },
              { label: 'Instagram (sin @)', key: 'instagram', placeholder: 'tucuenta' },
              { label: 'Dirección', key: 'address' },
              { label: 'Horarios de Atención', key: 'hours' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{f.label}</label>
                <input
                  type="text"
                  value={info[f.key] || ''}
                  onChange={e => setInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder || ''}
                  required={f.required}
                  style={{ width: '100%', background: '#fff', border: '1px solid #e8e0d8', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = BRAND}
                  onBlur={e => e.target.style.borderColor = '#e8e0d8'}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Descripción</label>
              <textarea
                value={info.description || ''}
                onChange={e => setInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                style={{ width: '100%', background: '#fff', border: '1px solid #e8e0d8', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: DARK, outline: 'none', resize: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = BRAND}
                onBlur={e => e.target.style.borderColor = '#e8e0d8'}
              />
            </div>
            <button type="submit" style={{ background: `linear-gradient(135deg, #b46414, ${BRAND})`, border: 'none', borderRadius: '14px', padding: '15px', color: '#fff', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(180,100,20,0.3)', marginTop: '4px' }}>
              <Save size={16} />Guardar Cambios
            </button>
          </form>
        )}

        {/* ─────────────────── MÁS PEDIDOS ─────────────────── */}
        {activeSection === 'popular' && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: DARK }}>Más Pedidos</h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Ranking de productos por pedidos de WhatsApp</p>
            </div>
            {popular.some(p => p.clicks > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {popular.map((p, i) => {
                  const medalColors = ['#f59e0b', '#94a3b8', '#d97706'];
                  const isTop3 = i < 3;
                  return (
                    <div key={p.id} style={{
                      background: '#fff', borderRadius: '16px', padding: '14px',
                      border: `1px solid ${isTop3 ? '#f0ece8' : '#f5f5f5'}`,
                      boxShadow: isTop3 ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      opacity: p.clicks === 0 ? 0.45 : 1,
                    }}>
                      {/* Rank */}
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: isTop3 ? medalColors[i] : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8' }}>#{i + 1}</span>}
                      </div>
                      <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 800, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>${p.price.toLocaleString('es-AR')}</p>
                      </div>
                      {p.clicks > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff7ed', borderRadius: '10px', padding: '5px 10px', flexShrink: 0 }}>
                          <Flame size={12} color="#f97316" />
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f97316' }}>{p.clicks}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 20px', color: '#94a3b8' }}>
                <Flame size={44} style={{ margin: '0 auto 14px', display: 'block', opacity: 0.25 }} />
                <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 8px', color: '#64748b' }}>Sin datos de pedidos aún</p>
                <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Los clicks se registran cuando los clientes presionan <strong>"Hacer Pedido"</strong> en el catálogo</p>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────── ESTADÍSTICAS ─────────────────── */}
        {activeSection === 'stats' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: DARK }}>Estadísticas</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Visitas al catálogo</p>
              </div>
              <button onClick={fetchStats} style={{ background: '#fff', border: `1.5px solid ${BRAND}`, borderRadius: '10px', padding: '7px 13px', color: BRAND, fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={12} />Actualizar
              </button>
            </div>
            {statsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
                <Loader2 size={28} color={BRAND} style={{ animation: 'panelSpin 1s linear infinite' }} />
              </div>
            ) : stats ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <StatCard icon={Eye}        label="Total"       value={stats.total?.toLocaleString('es-AR') || '0'} color="#b46414" />
                  <StatCard icon={Calendar}   label="Hoy"         value={stats.today?.toLocaleString('es-AR') || '0'} color="#10b981" sub="visitas de hoy" />
                  <StatCard icon={TrendingUp} label="7 días"      value={stats.last_7_days?.toLocaleString('es-AR') || '0'} color="#6366f1" sub="última semana" />
                  <StatCard icon={Users}      label="Promedio"    value={stats.daily?.length > 0 ? Math.round(stats.total / Math.max(stats.daily.length, 1)) : '0'} color="#f59e0b" sub="visitas por día" />
                </div>
                {stats.daily?.length > 0 ? (
                  <div style={{ background: '#fff', borderRadius: '18px', padding: '18px', border: '1px solid #f0ece8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>Últimos 30 días</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '72px' }}>
                      {(() => {
                        const max = Math.max(...stats.daily.map(d => d.visitas), 1);
                        return stats.daily.slice(-28).map((d, i) => (
                          <div
                            key={i}
                            title={`${d.fecha}: ${d.visitas} visitas`}
                            style={{
                              flex: 1, minWidth: '5px',
                              height: `${Math.max((d.visitas / max) * 100, 6)}%`,
                              background: `linear-gradient(180deg, #b46414, #d4a017)`,
                              borderRadius: '4px 4px 0 0',
                              cursor: 'pointer', transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          />
                        ));
                      })()}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fff', borderRadius: '18px', padding: '24px', textAlign: 'center', border: '1px solid #f0ece8' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Aún no hay registro de visitas registrado en la base de datos.</p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 20px', color: '#94a3b8' }}>
                <BarChart2 size={44} style={{ margin: '0 auto 14px', display: 'block', opacity: 0.25 }} />
                <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 8px', color: '#64748b' }}>Sin datos todavía</p>
                <p style={{ fontSize: '13px', margin: 0 }}>Presioná "Actualizar" para cargar los datos del servidor</p>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────── CONSULTAS ─────────────────── */}
        {activeSection === 'contacts' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: DARK }}>Consultas</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{contacts.length} mensajes recibidos</p>
              </div>
              <button onClick={fetchContacts} style={{ background: '#fff', border: `1.5px solid ${BRAND}`, borderRadius: '10px', padding: '7px 13px', color: BRAND, fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MessageSquare size={12} />Actualizar
              </button>
            </div>
            {contactsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
                <Loader2 size={28} color={BRAND} style={{ animation: 'panelSpin 1s linear infinite' }} />
              </div>
            ) : contacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contacts.map(c => (
                  <div key={c.id} style={{ background: '#fff', borderRadius: '18px', padding: '16px', border: '1px solid #f0ece8', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, #b46414, #d4a017)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{c.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: DARK }}>{c.name}</p>
                        <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={9} />{formatDate(c.created_at)}
                        </p>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', lineHeight: 1.6 }}>{c.message}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {c.phone && (
                        <a href={`https://wa.me/${formatWhatsAppNumber(c.phone)}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', background: '#f0fdf4', padding: '6px 10px', borderRadius: '8px' }}>
                          <Phone size={12} />{c.phone}
                        </a>
                      )}
                      {c.email && (
                        <a href={`mailto:${c.email}`} style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', background: '#eef2ff', padding: '6px 10px', borderRadius: '8px' }}>
                          <Mail size={12} />{c.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 20px', color: '#94a3b8' }}>
                <MessageSquare size={44} style={{ margin: '0 auto 14px', display: 'block', opacity: 0.25 }} />
                <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 8px', color: '#64748b' }}>Sin consultas por ahora</p>
                <p style={{ fontSize: '13px', margin: 0 }}>Aparecen acá cuando alguien manda un mensaje desde el catálogo</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════ MODAL: Producto ══════════════ */}
      <Sheet
        open={productModal.open}
        onClose={closeProductModal}
        title={productModal.mode === 'add' ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          {/* Preview imagen si hay URL */}
          {productModal.data.image && (
            <img
              src={productModal.data.image}
              alt="preview"
              style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '14px', marginBottom: '2px' }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Nombre del producto *</label>
            <input
              type="text"
              value={productModal.data.name || ''}
              onChange={e => setPField('name', e.target.value)}
              placeholder="Ej. Blonde Ale"
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Categoría con Dropdown + Opción de Nueva Categoría */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Categoría *</label>
            <input
              type="text"
              list="categories-list"
              value={productModal.data.category || ''}
              onChange={e => setPField('category', e.target.value.toUpperCase())}
              placeholder="Seleccioná o escribí una nueva categoría..."
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <datalist id="categories-list">
              {Array.from(new Set(products.map(p => p.category?.trim()).filter(Boolean))).map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {[
            { label: 'Descripción', key: 'description', placeholder: 'Detalle breve del producto' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{f.label}</label>
              <input
                type="text"
                value={productModal.data[f.key] || ''}
                onChange={e => setPField(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = BRAND}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          ))}

          {/* Campo e Imagen de Producto (Archivo local o URL) */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Imagen del producto</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="file"
                accept="image/*"
                id="birromi-image-file-input"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingImage(true);
                  try {
                    const formData = new FormData();
                    formData.append('image', file);
                    const token = getToken();
                    const res = await fetch(`${API_BASE}/?request=upload`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                      body: formData
                    });
                    const data = await res.json();
                    if (data.status === 'ok' && data.url) {
                      setPField('image', data.url);
                    } else {
                      await dialog.error(data.error || 'No se pudo subir la imagen');
                    }
                  } catch {
                    await dialog.error('Error al subir imagen al servidor');
                  } finally {
                    setUploadingImage(false);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('birromi-image-file-input')?.click()}
                disabled={uploadingImage}
                style={{ background: '#f1f5f9', border: '1.5px solid #cbd5e1', borderRadius: '11px', padding: '10px 14px', fontSize: '13px', fontWeight: 700, color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                {uploadingImage ? <Loader2 size={16} color={BRAND} style={{ animation: 'panelSpin 1s linear infinite' }} /> : '📷 Subir Foto desde mi celular/dispositivo'}
              </button>
            </div>
            <input
              type="text"
              value={productModal.data.image || ''}
              onChange={e => setPField('image', e.target.value)}
              placeholder="O pegá un link de imagen (https://...)"
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '13px', color: DARK, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Precio $ ARS *</label>
              <input type="number" value={productModal.data.price || ''} onChange={e => setPField('price', e.target.value)} placeholder="4500" style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Stock inicial</label>
              <input type="number" value={productModal.data.stock ?? ''} onChange={e => setPField('stock', e.target.value)} placeholder="0" style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '11px', padding: '11px 13px', fontSize: '14px', color: DARK, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 0' }}>
            <input
              type="checkbox"
              checked={productModal.data.available ?? true}
              onChange={e => setPField('available', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: BRAND }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Producto disponible para pedir</span>
          </label>
          <button
            onClick={handleSaveProduct}
            style={{ background: `linear-gradient(135deg, #b46414, ${BRAND})`, border: 'none', borderRadius: '13px', padding: '15px', color: '#fff', fontWeight: 800, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(180,100,20,0.3)', marginTop: '4px' }}
          >
            <Check size={17} />{productModal.mode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
          </button>
        </div>
      </Sheet>

      {/* ══════════════ MODAL: Stock ══════════════ */}
      <Sheet
        open={stockModal.open}
        onClose={() => setStockModal({ open: false, product: null, input: '' })}
        title="✏️ Cambiar Stock"
      >
        {stockModal.product && (
          <div>
            {/* Mini product preview */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8f7f5', borderRadius: '14px', padding: '12px', marginBottom: '24px' }}>
              <img src={stockModal.product.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: DARK }}>{stockModal.product.name}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Stock actual: {stockModal.product.stock || 0} unidades</p>
              </div>
            </div>

            {/* Cantidad editable */}
            <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>Nueva cantidad</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
              <button
                onClick={() => setStockModal(prev => ({ ...prev, input: String(Math.max(0, parseInt(prev.input || '0') - 1)) }))}
                style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px' }}
              >
                <Minus size={20} color="#64748b" />
              </button>
              <input
                type="number"
                value={stockModal.input}
                onChange={e => setStockModal(prev => ({ ...prev, input: e.target.value }))}
                style={{ width: '96px', textAlign: 'center', fontSize: '36px', fontWeight: 800, color: DARK, border: `2.5px solid ${BRAND}`, borderRadius: '16px', padding: '10px 0', outline: 'none', fontFamily: 'inherit', background: '#fffbf5' }}
              />
              <button
                onClick={() => setStockModal(prev => ({ ...prev, input: String(parseInt(prev.input || '0') + 1) }))}
                style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Plus size={20} color="#64748b" />
              </button>
            </div>
            <button
              onClick={saveStock}
              style={{ width: '100%', background: `linear-gradient(135deg, #b46414, ${BRAND})`, border: 'none', borderRadius: '14px', padding: '15px', color: '#fff', fontWeight: 800, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(180,100,20,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Check size={17} />Confirmar Stock
            </button>
          </div>
        )}
      </Sheet>

      {/* Custom Dialog UI */}
      <dialog.DialogUI />
    </div>
  );
};

export default BirromiPanel;
