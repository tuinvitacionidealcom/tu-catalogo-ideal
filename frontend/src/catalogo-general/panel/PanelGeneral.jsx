import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  ShoppingBag, Store, BarChart2, MessageSquare, LogOut,
  Plus, Edit3, Trash2, Check, X, Loader2, Upload, ExternalLink,
  Search, Eye, AlertCircle, Images
} from 'lucide-react';

import { useAuth } from './useAuth';
import LoginPanel from './LoginPanel';
import catalogosData from '../../config';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';

const getProductImages = (imgData) => {
  if (!imgData) return [];
  if (Array.isArray(imgData)) return imgData.filter(Boolean);
  if (typeof imgData === 'string') {
    const trimmed = imgData.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [trimmed].filter(Boolean);
  }
  return [];
};

const emptyProduct = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  images: [],
  available: true,
  stock: 0,
  sizes: ''
};

const PanelGeneral = ({ slugOverride }) => {
  const { slug: routeSlug } = useParams();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const detectedSlug = pathSegments[0] || '';
  const rawSlug = slugOverride || routeSlug || detectedSlug;

  const normalizedSlug = rawSlug ? rawSlug.toLowerCase().trim() : '';
  const effectiveSlug = (normalizedSlug === 'celebrarte-julieta') ? 'celebrarte' : normalizedSlug;

  const catalogPreset = catalogosData[effectiveSlug] || {
    name: effectiveSlug.replace(/-/g, ' ').toUpperCase(),
    theme: {
      "--color-brand": "#2563eb",
      "--color-brand-dark": "#1d4ed8"
    }
  };

  const { user, loading: authLoading, error: authError, login, logout, getToken } = useAuth(effectiveSlug);

  // Estados de navegación
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'info' | 'stats' | 'contacts'

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [info, setInfo] = useState({
    name: catalogPreset.name || '',
    phone: catalogPreset.phone || '',
    address: catalogPreset.address || '',
    hours: catalogPreset.hours || '',
    instagram: catalogPreset.instagram || '',
    description: catalogPreset.description || ''
  });

  // Modal Producto (Agregar / Editar)
  const [productModal, setProductModal] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    data: { ...emptyProduct }
  });
  const [urlInput, setUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Notificaciones Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Inyectar tema
  useEffect(() => {
    if (catalogPreset?.theme) {
      Object.entries(catalogPreset.theme).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val);
      });
    }
  }, [catalogPreset]);

  // Cargar productos desde MySQL
  const fetchProducts = useCallback(async (catalogId) => {
    if (!catalogId) return;
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/?request=products/${catalogId}`);
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.warn('Error al cargar productos:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const fetchStats = useCallback(async (catalogId) => {
    if (!catalogId) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/?request=visits/${catalogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setStats(data);
      }
    } catch (err) {
      console.warn('Error al cargar estadísticas:', err);
    }
  }, [getToken]);

  // Cargar consultas recibidas
  const fetchContacts = useCallback(async (catalogId) => {
    if (!catalogId) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/?request=contacts/${catalogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.data)) {
        setContacts(data.data);
      }
    } catch (err) {
      console.warn('Error al cargar consultas:', err);
    }
  }, [getToken]);

  useEffect(() => {
    if (user?.catalog_id) {
      fetchProducts(user.catalog_id);
      fetchStats(user.catalog_id);
      fetchContacts(user.catalog_id);
    }
  }, [user?.catalog_id, fetchProducts, fetchStats, fetchContacts]);

  // Subir imágenes múltiples (máximo 5)
  const handleImagesUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const currentImages = productModal.data.images || [];
    const remaining = 5 - currentImages.length;

    if (remaining <= 0) {
      alert('Ya alcanzaste el máximo de 5 fotos para este producto.');
      return;
    }

    const filesToUpload = Array.from(fileList).slice(0, remaining);
    if (fileList.length > remaining) {
      alert(`Solo podés agregar ${remaining} foto(s) más (máximo 5 en total).`);
    }

    setUploadingImage(true);
    try {
      const token = getToken();
      const uploadedUrls = [];

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_BASE}/?request=upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        const data = await res.json();
        if (data.status === 'ok' && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setProductModal(prev => ({
          ...prev,
          data: {
            ...prev.data,
            images: [...(prev.data.images || []), ...uploadedUrls]
          }
        }));
        showToast(`${uploadedUrls.length} foto(s) subida(s) con éxito`);
      }
    } catch (err) {
      alert('Error de conexión al subir imágenes.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductModal(prev => ({
      ...prev,
      data: {
        ...prev.data,
        images: (prev.data.images || []).filter((_, idx) => idx !== indexToRemove)
      }
    }));
  };

  const handleAddUrlImage = (url) => {
    if (!url || !url.trim()) return;
    const currentImages = productModal.data.images || [];
    if (currentImages.length >= 5) {
      alert('Máximo 5 imágenes por producto.');
      return;
    }
    setProductModal(prev => ({
      ...prev,
      data: {
        ...prev.data,
        images: [...(prev.data.images || []), url.trim()]
      }
    }));
  };

  // Guardar Producto
  const handleSaveProduct = async () => {
    const p = productModal.data;
    if (!p.name?.trim()) {
      alert('Por favor completá el nombre del producto o servicio.');
      return;
    }
    if (!p.category?.trim()) {
      alert('Por favor ingresá una categoría.');
      return;
    }

    setSavingProduct(true);
    try {
      const token = getToken();
      const parsedPrice = (p.price === '' || p.price === null || p.price === undefined) ? 0 : parseFloat(p.price);

      const imagesArray = p.images || [];
      const imagePayload = imagesArray.length > 0 ? JSON.stringify(imagesArray) : '';

      const payload = {
        id: p.id || undefined,
        catalog_id: user?.catalog_id,
        name: p.name.trim(),
        description: p.description?.trim() || '',
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        category: p.category.toUpperCase().trim(),
        image: imagePayload,
        available: p.available ? 1 : 0,
        stock: parseInt(p.stock) || 0,
        sizes: p.sizes ? p.sizes.trim() : ''
      };

      const res = await fetch(`${API_BASE}/?request=products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'ok') {
        throw new Error(data.error || 'Error al guardar el producto');
      }

      showToast(productModal.mode === 'add' ? 'Producto agregado con éxito' : 'Producto guardado');
      setProductModal({ open: false, mode: 'add', data: { ...emptyProduct } });
      fetchProducts(user?.catalog_id);
    } catch (err) {
      alert(err.message || 'Error al guardar.');
    } finally {
      setSavingProduct(false);
    }
  };

  // Eliminar Producto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/?request=products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'ok') {
        showToast('Producto eliminado');
        fetchProducts(user?.catalog_id);
      } else {
        alert(data.error || 'No se pudo eliminar');
      }
    } catch (err) {
      alert('Error de conexión al eliminar.');
    }
  };

  // Guardar datos del comercio
  const handleSaveInfo = (e) => {
    e.preventDefault();
    localStorage.setItem(`info_${effectiveSlug}`, JSON.stringify(info));
    showToast('Datos del comercio guardados correctamente');
  };

  // Si no está autenticado, renderizar Login
  if (!user) {
    return (
      <LoginPanel
        onLogin={login}
        loading={authLoading}
        error={authError}
        catalogName={catalogPreset.name}
        catalogSlug={effectiveSlug}
        logoImage={catalogPreset.logoImage}
      />
    );
  }

  const filteredProducts = products.filter(p => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-white text-xs font-bold flex items-center gap-2 animate-slide-left ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'
        }`}>
          <Check className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Panel */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center font-bold text-white text-sm">
              {catalogPreset.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">{catalogPreset.name}</h1>
              <p className="text-[10px] text-slate-400">Panel de Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/${effectiveSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand" />
              <span>Ver Catálogo</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2.5">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Mi Comercio</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Estadísticas</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-brand text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consultas ({contacts.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        
        {/* ── TAB: PRODUCTOS ── */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Catálogo de Productos y Servicios</h2>
                <p className="text-xs text-slate-500">Agregá, editá o actualizá precios y fotos en tiempo real.</p>
              </div>

              <button
                onClick={() => setProductModal({ open: true, mode: 'add', data: { ...emptyProduct } })}
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:scale-95 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
            </div>

            {/* Buscador de productos */}
            <div className="mb-6 relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar por nombre o categoría..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand shadow-xs"
              />
            </div>

            {/* Grilla de productos en panel */}
            {productsLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 text-base mb-1">No hay productos cargados</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  Comenzá agregando el primer producto o servicio que querés mostrar en tu catálogo.
                </p>
                <button
                  onClick={() => setProductModal({ open: true, mode: 'add', data: { ...emptyProduct } })}
                  className="bg-brand text-white text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-brand-dark transition-all cursor-pointer"
                >
                  Nuevo Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const prodImages = getProductImages(p.image);
                  const mainThumb = prodImages[0] || '';

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex gap-3.5 items-start justify-between hover:border-slate-300 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
                        {mainThumb ? (
                          <img src={mainThumb} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingBag className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                        {prodImages.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Images className="w-2.5 h-2.5" />
                            <span>{prodImages.length}</span>
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand block mb-0.5">
                          {p.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 leading-tight truncate mb-1">
                          {p.name}
                        </h4>
                        <p className="text-xs font-extrabold text-slate-700 mb-1">
                          {p.price > 0 ? `$${p.price.toLocaleString('es-AR')}` : 'A consultar'}
                        </p>
                        {p.sizes && (
                          <span className="text-[10px] text-slate-500 font-medium block truncate">
                            Talles: {p.sizes}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                          p.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {p.available ? 'Disponible' : 'Sin Stock'}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => setProductModal({ open: true, mode: 'edit', data: { ...p, images: prodImages } })}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MI COMERCIO ── */}
        {activeTab === 'info' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Datos de tu Comercio</h2>
            <p className="text-xs text-slate-500 mb-6">Esta información se muestra en el encabezado, pie de página y mensajes de WhatsApp.</p>

            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">WhatsApp de Pedidos (con código de país, sin 15 ni guiones)</label>
                <input
                  type="text"
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  placeholder="Ej: 5491131307799"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Usuario de Instagram</label>
                  <input
                    type="text"
                    value={info.instagram}
                    onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                    placeholder="Ej: celebrarte_ok"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Horarios de Atención</label>
                  <input
                    type="text"
                    value={info.hours}
                    onChange={(e) => setInfo({ ...info, hours: e.target.value })}
                    placeholder="Ej: Lunes a Sábados de 9 a 20 hs"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Ubicación / Dirección</label>
                <input
                  type="text"
                  value={info.address}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  placeholder="Ej: Ciudad Autónoma de Buenos Aires"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Descripción de Portada</label>
                <textarea
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <button
                type="submit"
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* ── TAB: ESTADÍSTICAS ── */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Métricas y Rendimiento</h2>
            <p className="text-xs text-slate-500 mb-6">Monitoreá las visitas y consultas que genera tu catálogo.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Visitas Totales</span>
                <span className="text-3xl font-extrabold text-brand">
                  {stats?.total_visits || stats?.total || 0}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Personas que abrieron tu catálogo</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Consultas Recibidas</span>
                <span className="text-3xl font-extrabold text-emerald-600">
                  {contacts.length}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Contactos por formulario / pedido</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Productos Activos</span>
                <span className="text-3xl font-extrabold text-slate-800">
                  {products.filter(p => p.available).length}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Visibles para tus clientes</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CONSULTAS ── */}
        {activeTab === 'contacts' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Consultas y Pedidos Recibidos</h2>
            <p className="text-xs text-slate-500 mb-6">Mensajes registrados desde tu catálogo digital.</p>

            {contacts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 text-base mb-1">Sin mensajes aún</h3>
                <p className="text-xs text-slate-400">Cuando tus clientes envíen consultas o pedidos, se registrarán acá.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="font-bold text-sm text-slate-800">{c.name || 'Cliente'}</span>
                      <span className="text-[10px] text-slate-400">{c.created_at}</span>
                    </div>
                    {c.phone && <p className="text-xs text-brand font-semibold mb-1">WhatsApp: {c.phone}</p>}
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── MODAL PRODUCTO (AGREGAR / EDITAR) ── */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-sm">
                {productModal.mode === 'add' ? 'Nuevo Producto / Servicio' : 'Editar Producto'}
              </h3>
              <button
                onClick={() => setProductModal({ ...productModal, open: false })}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Formulario */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Fotos del Producto (Hasta 5) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Fotos del Producto ({productModal.data.images?.length || 0}/5)
                  </label>
                  <span className="text-[10px] text-slate-400">Máximo 5 fotos</span>
                </div>

                {/* Grilla de Miniaturas */}
                <div className="grid grid-cols-5 gap-2.5 mb-3">
                  {(productModal.data.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                      <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-brand text-white text-[8px] font-bold px-1 rounded shadow-xs">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
                        title="Eliminar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Slot para agregar si no llegó a 5 */}
                  {(productModal.data.images?.length || 0) < 5 && (
                    <label
                      htmlFor="multi-file-upload-input"
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-brand bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Subir foto"
                    >
                      <Plus className="w-5 h-5 text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400">Agregar</span>
                    </label>
                  )}
                </div>

                {/* Botón de subida y link */}
                {(productModal.data.images?.length || 0) < 5 && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="multi-file-upload-input"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        handleImagesUpload(e.target.files);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="multi-file-upload-input"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-all border border-slate-200"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-brand" />
                          <span>Subiendo fotos...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-brand" />
                          <span>📸 Subir fotos desde mi celular/PC (hasta 5)</span>
                        </>
                      )}
                    </label>

                    {/* Pegar link directo */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="O pegá un link directo (https://...)"
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleAddUrlImage(urlInput);
                          setUrlInput('');
                        }}
                        disabled={!urlInput.trim()}
                        className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nombre del Producto o Servicio *
                </label>
                <input
                  type="text"
                  value={productModal.data.name}
                  onChange={(e) => setProductModal({
                    ...productModal,
                    data: { ...productModal.data, name: e.target.value }
                  })}
                  placeholder="Ej: Ambientaciones o Calza Deportiva"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Precio $ ARS (0 para 'Consultar')
                  </label>
                  <input
                    type="number"
                    value={productModal.data.price}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      data: { ...productModal.data, price: e.target.value }
                    })}
                    placeholder="Ej: 15000 (o 0)"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    value={productModal.data.category}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      data: { ...productModal.data, category: e.target.value }
                    })}
                    placeholder="Ej: SERVICIOS o ROPA"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Talles / Medidas (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={productModal.data.sizes || ''}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      data: { ...productModal.data, sizes: e.target.value }
                    })}
                    placeholder="Ej: S, M, L, XL"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={productModal.data.stock ?? 0}
                    onChange={(e) => setProductModal({
                      ...productModal,
                      data: { ...productModal.data, stock: e.target.value }
                    })}
                    placeholder="0"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Descripción
                </label>
                <textarea
                  value={productModal.data.description}
                  onChange={(e) => setProductModal({
                    ...productModal,
                    data: { ...productModal.data, description: e.target.value }
                  })}
                  rows={3}
                  placeholder="Detalles sobre el producto, materiales, servicios incluidos, etc."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prod-available"
                  checked={productModal.data.available}
                  onChange={(e) => setProductModal({
                    ...productModal,
                    data: { ...productModal.data, available: e.target.checked }
                  })}
                  className="w-4 h-4 text-brand rounded cursor-pointer"
                />
                <label htmlFor="prod-available" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Producto disponible para pedir (si se desmarca, aparecerá como Sin Stock)
                </label>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductModal({ ...productModal, open: false })}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={savingProduct}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand hover:bg-brand-dark text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {savingProduct ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Guardar Producto</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PanelGeneral;
