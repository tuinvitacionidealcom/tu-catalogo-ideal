import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Search, ShoppingBag, Grid, List, X, ArrowUp } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

import HeroCatalogo from './componentes/HeroCatalogo';
import ServiciosSeccion from './componentes/ServiciosSeccion';
import CategoryTabs from './componentes/CategoryTabs';
import ProductCard from './componentes/ProductCard';
import ProductModal from './componentes/ProductModal';
import CartModal from './componentes/CartModal';
import FAQ from './componentes/FAQ';
import FooterCatalogo from './componentes/FooterCatalogo';

import catalogosData from '../config';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';

const CatalogoGeneral = ({ slugOverride }) => {
  const { slug: routeSlug } = useParams();
  const location = useLocation();

  // Obtener slug desde prop, parámetro de ruta o pathname (/celebrarte -> celebrarte)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const detectedSlug = pathSegments[0] || '';
  const rawSlug = slugOverride || routeSlug || detectedSlug;

  // Resolver slug efectivo (soporta alias como celebrarte-julieta -> celebrarte)
  const normalizedSlug = rawSlug ? rawSlug.toLowerCase().trim() : '';
  const effectiveSlug = (normalizedSlug === 'celebrarte-julieta') ? 'celebrarte' : normalizedSlug;

  // Configuración base desde catalogos.json
  const config = catalogosData[effectiveSlug] || {
    slug: effectiveSlug,
    name: effectiveSlug.replace(/-/g, ' ').toUpperCase(),
    businessType: "Catálogo Online",
    phone: "5491131307799",
    instagram: "",
    address: "Argentina",
    hours: "Lunes a Sábados: 9 a 20 hs",
    description: "Bienvenidos a nuestro catálogo digital. Conocé nuestros productos y servicios.",
    isServices: false,
    theme: {
      "--color-brand": "#2563eb",
      "--color-brand-light": "#60a5fa",
      "--color-brand-dark": "#1d4ed8",
      "--color-accent": "#dbeafe",
      "--color-accent-light": "#eff6ff",
      "--color-accent-dark": "#bfdbfe",
      "--color-web-bg": "#ffffff",
      "--color-web-bg-warm": "#f8fafc",
      "--color-web-card": "#ffffff",
      "--color-web-border": "#f0f0f0",
      "--color-web-text": "#0f172a",
      "--color-web-text-muted": "#64748b",
      "--color-web-dark": "#0f172a",
      "--color-web-dark-soft": "#1e293b"
    },
    features: [],
    faq: []
  };

  const [info, setInfo] = useState(config);
  const [products, setProducts] = useState([]);
  const [catalogId, setCatalogId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtros y Carrito
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productsSectionRef = useRef(null);

  // 1. Inyectar variables de tema CSS dinámicamente
  useEffect(() => {
    const root = document.documentElement;
    const theme = config.theme || {};
    
    Object.entries(theme).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Cleanup: restaurar al desmontar
    return () => {
      Object.keys(theme).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [config.theme]);

  // 2. Cargar datos del catálogo y productos desde MySQL
  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/?request=catalogs/${effectiveSlug}`)
      .then(res => res.json())
      .then(catalogRes => {
        if (catalogRes.status === 'ok' && catalogRes.data) {
          const dbCat = catalogRes.data;
          setCatalogId(dbCat.id);

          // Actualizar info con datos de la BD si están presentes
          setInfo(prev => ({
            ...prev,
            name: dbCat.business_name || prev.name,
            description: dbCat.description || prev.description,
            phone: dbCat.phone || prev.phone,
            businessType: dbCat.business_type || prev.businessType
          }));

          // Registrar visita
          fetch(`${API_BASE}/?request=visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catalog_id: dbCat.id })
          }).catch(() => {});

          // Cargar productos
          return fetch(`${API_BASE}/?request=products/${dbCat.id}`);
        } else {
          throw new Error('Catálogo no encontrado');
        }
      })
      .then(res => res ? res.json() : null)
      .then(productsRes => {
        if (productsRes && productsRes.status === 'ok' && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        }
      })
      .catch((err) => {
        console.warn('Error al cargar datos del catálogo desde la API:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Título, Favicon y Metadatos dinámicos
    const originalTitle = document.title;
    document.title = `${config.name} | Catálogo Digital`;

    const faviconLink = document.querySelector("link[rel*='icon']");
    const originalFavicon = faviconLink ? faviconLink.href : '/favicon.svg';
    if (faviconLink && config.logoImage) {
      faviconLink.href = config.logoImage;
    }

    // Actualizar meta description y OpenGraph en el cliente
    const updateMeta = (selector, attr, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attr, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', config.description);
    updateMeta('meta[property="og:title"]', 'content', `${config.name} | Catálogo Digital`);
    updateMeta('meta[property="og:description"]', 'content', config.description);
    if (config.logoImage || config.coverImage) {
      updateMeta('meta[property="og:image"]', 'content', config.logoImage || config.coverImage);
    }

    return () => {
      document.title = originalTitle;
      if (faviconLink) {
        faviconLink.href = originalFavicon;
      }
    };
  }, [effectiveSlug]);

  // Manejador de Scroll al Catálogo
  const scrollToProducts = () => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Manejo de Carrito
  const handleAddToCart = (product) => {
    setCart(prev => {
      const matchIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === product.selectedSize
      );
      const qtyToAdd = product.customQuantity || 1;

      if (matchIndex > -1) {
        const next = [...prev];
        next[matchIndex] = {
          ...next[matchIndex],
          quantity: next[matchIndex].quantity + qtyToAdd
        };
        return next;
      } else {
        return [...prev, { ...product, quantity: qtyToAdd }];
      }
    });
  };

  const handleUpdateQuantity = (productId, selectedSize, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter(
          item => !(item.id === productId && item.selectedSize === selectedSize)
        );
      }
      return prev.map(item =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQty }
          : item
      );
    });
  };

  const handleRemoveItem = (productId, selectedSize) => {
    setCart(prev =>
      prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  // Obtener categorías únicas de los productos
  const categories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  );

  // Filtrado de productos por búsqueda y categoría
  const filteredProducts = products.filter(p => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (p.category && p.category.toUpperCase() === selectedCategory.toUpperCase());
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* ── Top Bar Fija ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {info.logoImage ? (
              <img src={info.logoImage} alt={info.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-xl" />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                {info.name.charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">
              {info.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Carrito Header */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-brand hover:bg-brand-dark active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pedido</span>
              {cartTotalCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-brand text-[11px] font-black flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Portada ── */}
      <HeroCatalogo info={info} onScrollToProducts={scrollToProducts} />

      {/* ── Sección Beneficios / Servicios ── */}
      <ServiciosSeccion features={info.features} />

      {/* ── Sección Productos ── */}
      <main ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Input Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, servicios u opciones..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Grid / List view */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-brand text-white border-brand shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              aria-label="Vista cuadrícula"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-brand text-white border-brand shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              aria-label="Vista lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categorías */}
        {categories.length > 0 && (
          <div className="mb-6">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Grilla / Lista de Productos */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base mb-1">No se encontraron productos</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Intentá con otro término de búsqueda o seleccioná otra categoría.
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
              : "flex flex-col gap-3 max-w-3xl mx-auto"
          }>
            {filteredProducts.map((product) => {
              const inCartQty = cart
                .filter(i => i.id === product.id)
                .reduce((acc, i) => acc + i.quantity, 0);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={inCartQty}
                  onAdd={() => handleAddToCart(product)}
                  onRemove={() => handleUpdateQuantity(product.id, null, inCartQty - 1)}
                  onClick={() => setSelectedProduct(product)}
                  horizontalView={viewMode === 'list'}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* ── FAQs ── */}
      <FAQ faqs={info.faq} />

      {/* ── Footer ── */}
      <FooterCatalogo info={info} />

      {/* ── Modal Detalle de Producto ── */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        whatsappNumber={info.phone}
      />

      {/* ── Drawer Carrito de Pedido ── */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        businessName={info.name}
        whatsappNumber={info.phone}
        catalogId={catalogId}
        isServices={info.isServices}
      />

      {/* ── Botón Flotante de Carrito en Mobile ── */}
      {cartTotalCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-brand hover:bg-brand-dark text-white p-4 rounded-full shadow-xl shadow-brand/30 flex items-center justify-center transition-all cursor-pointer animate-bounce-short"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[11px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {cartTotalCount}
          </span>
        </button>
      )}

    </div>
  );
};

export default CatalogoGeneral;
