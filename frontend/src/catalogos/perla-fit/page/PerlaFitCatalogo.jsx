import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowLeft, Store, X, ArrowUp, Grid, List } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import HeroCatalogo from '../componentes/HeroCatalogo';
import ServiciosSeccion from '../componentes/ServiciosSeccion';
import ProductCard from '../componentes/ProductCard';
import CategoryTabs from '../componentes/CategoryTabs';
import CartModal from '../componentes/CartModal';
import FooterCatalogo from '../componentes/FooterCatalogo';
import ProductModal from '../componentes/ProductModal';
import FAQ from '../componentes/FAQ';
import { Link } from 'react-router-dom';
import '../perla-fit.css';
import { BUSINESS_NAME, DEFAULT_HOURS, DEFAULT_ADDRESS } from '../config';

// Importación de imágenes locales
import logoImg from '../img/logo.webp';
import blondeAleImg from '../img/productos/blondeale(rubia).webp';
import irishRedImg from '../img/productos/irishred.webp';
import stoutImg from '../img/productos/stout.webp';
import ipaArgentaImg from '../img/productos/ipaargenta.webp';
import doubleNeipaImg from '../img/productos/dobleneipaargenta.webp';
import westCoastIpaImg from '../img/productos/westcoastipa.webp';
import imgPromo1Img from '../img/productos/imgpromo1.webp';

const LOCAL_STORAGE_PRODUCTS_KEY = 'perlafit_products_custom';
const LOCAL_STORAGE_INFO_KEY = 'perlafit_info_custom';

const defaultProducts = [
  {
    id: 1,
    name: 'Top Deportivo High Impact',
    description: 'Top deportivo de máxima sujeción y compresión, ideal para entrenamientos de alta intensidad. Tela respirable.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=60',
    category: 'TOPS',
    available: true
  },
  {
    id: 2,
    name: 'Legging Seamless Black',
    description: 'Calza tiro alto sin costuras con efecto moldeador y secado rápido. Sentadilla a prueba de transparencias.',
    price: 28900,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=60',
    category: 'CALZAS',
    available: true
  },
  {
    id: 3,
    name: 'Conjunto Training Pro',
    description: 'Set exclusivo de Top + Legging Seamless combinados. Máxima comodidad y flexibilidad.',
    price: 43500,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=60',
    category: 'CONJUNTOS',
    available: true
  },
  {
    id: 4,
    name: 'Remera Oversize Training',
    description: 'Remera 100% algodón premium estilo oversize. Cómoda, fresca y versátil para tu rutina.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
    category: 'REMERAS',
    available: true
  }
];

const defaultInfo = {
  name: BUSINESS_NAME,
  description: "Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.",
  address: DEFAULT_ADDRESS,
  phone: "5491139246425",
  instagram: "",
  hours: DEFAULT_HOURS,
  logo: logoImg
};

const PerlaFitCatalogo = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [info, setInfo] = useState(defaultInfo);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (2 columnas) o 'list' (1 columna / lista)

  // Load custom data from localStorage if exists + Update Title & Favicon
  useEffect(() => {
    // Aplicar clase de tema para colores marrones
    document.body.classList.add('perla-fit-theme');

    const savedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    const savedInfo = localStorage.getItem(LOCAL_STORAGE_INFO_KEY);

    let currentInfo = defaultInfo;
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedInfo) {
      currentInfo = JSON.parse(savedInfo);
      setInfo(currentInfo);
    }

    // Guardar favicon y título originales
    const originalTitle = document.title;
    const faviconLink = document.querySelector("link[rel*='icon']");
    const originalFavicon = faviconLink ? faviconLink.href : '/favicon.svg';

    // Establecer título y favicon del negocio
    document.title = `${currentInfo.name} | Catálogo Digital`;
    if (faviconLink && currentInfo.logo) {
      faviconLink.href = currentInfo.logo;
    }

    // Cleanup: Restaurar valores originales al salir del catálogo
    return () => {
      document.body.classList.remove('perla-fit-theme');
      document.title = originalTitle;
      if (faviconLink) {
        faviconLink.href = originalFavicon;
      }
    };
  }, []);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === productId);
      if (existing.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const getProductQuantity = (productId) => {
    const found = cart.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };

  // Filter Categories
  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('seccion-productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [showHeader, setShowHeader] = useState(false);
  const [showWspMessage, setShowWspMessage] = useState(false);
  const [wspMessageDismissed, setWspMessageDismissed] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);

  useEffect(() => {
    let timeoutId;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 80;
      setShowHeader(isScrolled);
      
      // Mostrar scroll-up si el usuario está scrolleando hacia arriba Y pasó los 300px
      if (currentScrollY > 300 && currentScrollY < lastScrollY) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }

      // Detectar si el scroll llegó al bottom de la web (menos de 150px del final)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = (currentScrollY + windowHeight) >= (documentHeight - 150);
      setShowMobileNav(!isNearBottom);
      
      // Mostrar el globo y el boton verde solo cuando salimos de la altura del Hero en Mobile (window.innerHeight)
      const outOfHero = currentScrollY >= window.innerHeight - 50;

      if (outOfHero && !wspMessageDismissed) {
        setShowWspMessage(true);

        // Ocultar automáticamente el globo flotante de sugerencia después de 6 segundos
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowWspMessage(false);
        }, 6000);
      } else if (!outOfHero) {
        setShowWspMessage(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [wspMessageDismissed]);

  return (
    <div className="min-h-screen bg-web-bg-warm pb-0 text-slate-800 font-sans relative">
      {/* Overlay 'Próximamente' sobre todo el catálogo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 900,
          letterSpacing: '8px',
          margin: '0 0 16px 0',
          color: '#ffffff',
          textTransform: 'uppercase'
        }}>
          PERLA FIT
        </h1>

        <p style={{
          fontSize: '18px',
          fontWeight: 500,
          letterSpacing: '4px',
          color: '#888888',
          margin: '0 0 28px 0',
          textTransform: 'uppercase'
        }}>
          Próximamente
        </p>

        <a
          href="https://www.instagram.com/perlafit.ind/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Perla Fit"
          style={{
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaInstagram size={22} />
        </a>
      </div>
      {/* Header bar - Flotante y Minimalista (Aparece al hacer Scroll) */}
      <div 
        className={`fixed top-0 left-0 right-0 z-45 bg-brand/95 backdrop-blur-md text-white px-5 py-3 flex items-center justify-between shadow-md transition-all duration-300 gap-4 ${
          showHeader 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        {/* Logo y Nombre del Emprendimiento (Juntos a la izquierda) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-serif font-black text-brand text-xs shadow-md shrink-0 overflow-hidden">
            {info.logo ? (
              <img src={info.logo} alt={info.name} className="w-full h-full object-cover" />
            ) : (
              info.name ? info.name.charAt(0).toUpperCase() : BUSINESS_NAME.charAt(0).toUpperCase()
            )}
          </div>
          <span className="font-serif font-black text-sm uppercase tracking-widest text-white">
            {info.name}
          </span>
        </div>

        {/* Lupa de Búsqueda interactiva que se expande hacia la izquierda y WhatsApp Outline */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Input de Búsqueda Desplegable (Posicionado antes para expandirse hacia la izquierda) */}
          <div className={`relative transition-all duration-350 ease-out origin-right ${isSearchOpen ? 'w-32 xs:w-44 sm:w-56 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/15 focus:bg-white focus:text-slate-800 border border-transparent focus:border-accent rounded-full pl-7 pr-7 py-1 text-[11px] text-white placeholder-slate-300 transition-all focus:outline-hidden font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Botón Lupa / Cruz Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${isSearchOpen ? 'bg-accent text-brand' : 'hover:bg-white/10 text-white'}`}
            title="Buscar variedades"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* WhatsApp Icono Outline en Color Accent */}
          <a
            href={`https://wa.me/${info.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border border-accent hover:bg-accent hover:text-brand text-accent rounded-full transition-all active:scale-90 cursor-pointer flex items-center justify-center"
            title="Enviar WhatsApp"
          >
            <FaWhatsapp className="text-base" />
          </a>
        </div>
      </div>

      {/* Main Layout - Responsive (Desktop & Mobile) sin margen superior extra para que el Hero empiece arriba de todo */}
      <div className="max-w-6xl mx-auto lg:px-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Section (Catálogo + Hero) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white lg:rounded-3xl shadow-xs overflow-hidden lg:border border-slate-100">
              {/* Hero Section */}
              <HeroCatalogo info={info} onScrollToProducts={scrollToProducts} />

              {/* Servicios Section */}
              <ServiciosSeccion />

              {/* Anchor for products */}
              <div id="seccion-productos" className="px-6 pt-6 pb-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar variedades clásicas, IPAs, combos o promos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-hidden focus:bg-white focus:border-accent text-slate-700 transition-all font-medium"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Category Navigation y Controles de Vista */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 gap-4">
                <div className="flex-1 min-w-0">
                  <CategoryTabs
                    categories={categories}
                    activeCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>
                {/* Selector de Vista (Grid / Lista) */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-brand text-accent shadow-xs'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Vista en cuadrícula (2 columnas)"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-brand text-accent shadow-xs'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Vista en lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="px-6 py-6">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-sm">No encontramos productos que coincidan con tu búsqueda.</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={getProductQuantity(product.id)}
                        onAdd={handleAddToCart}
                        onRemove={handleRemoveFromCart}
                        onClick={() => setSelectedProduct(product)}
                        horizontalView={viewMode === 'list'}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <FAQ />

          </div>

          {/* Right Section: Pedido en vivo (Siempre visible en Desktop) */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 sticky top-28 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand" />
                  <h3 className="font-sans font-bold text-base text-brand">Tu Pedido Actual</h3>
                </div>
                {cart.length > 0 && (
                  <span className="bg-accent/20 text-brand text-xs px-2.5 py-1 rounded-full font-extrabold">
                    {totalCartItems} items
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-medium">El carrito está vacío en este momento.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {cart.map(item => (
                      <div key={item.id} className="py-3 flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">
                            ${item.price.toLocaleString('es-AR')} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold text-xs text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-6 h-6 bg-brand text-white hover:bg-brand-light rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="text-brand font-extrabold text-base">
                      ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-brand hover:bg-brand-light transition-all text-white font-sans font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Confirmar y Enviar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Completo */}
      <FooterCatalogo info={info} topProducts={products} />

      {/* Mobile Navigation Bar Flotante (Abajo de todo en Mobile) */}
      <div className={`fixed bottom-6 inset-x-4 z-45 max-w-sm mx-auto bg-brand/95 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-4 flex items-center justify-between shadow-2xl shadow-brand/40 lg:hidden gap-2 transition-all duration-300 transform ${
        showMobileNav 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-12 pointer-events-none'
      }`}>
        
        {/* Lado Izquierdo: Scroll Up animado con efecto de entrada/salida y colapso de espacio */}
        <div className={`transition-all duration-350 ease-out flex items-center justify-center shrink-0 ${
          showScrollUp ? 'w-10 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`w-9 h-9 rounded-full bg-white/10 text-accent flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all duration-300 cursor-pointer ${
              showScrollUp ? 'scale-100' : 'scale-75'
            }`}
            title="Subir al inicio"
          >
            <ArrowUp className="w-4 h-4 font-bold" />
          </button>
        </div>

        {/* Centro: Botón de Carrito Dinámico que ocupa todo el ancho restante */}
        <div className="flex-1 flex justify-center min-w-0 transition-all duration-350">
          {totalCartItems > 0 ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between bg-accent hover:bg-accent/90 active:scale-95 transition-all text-brand font-sans font-black py-2.5 px-4 rounded-full shadow-md cursor-pointer text-xs gap-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <ShoppingBag className="w-4 h-4 text-brand shrink-0" />
                <span className="truncate">Ver Pedido</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="bg-brand text-accent rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                  {totalCartItems}
                </div>
                <span className="text-[10px] font-black opacity-80">
                  (${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('es-AR')})
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 text-slate-300 hover:text-white active:scale-95 transition-all py-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider select-none truncate">
                Tu carrito está vacío
              </span>
            </button>
          )}
        </div>

        {/* Lado Derecho: WhatsApp Outline en Color Acento */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <a
            href={`https://wa.me/${info.phone}?text=Hola!%20Quería%20hacerles%20una%20consulta.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 border border-accent hover:bg-accent hover:text-brand text-accent rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
            title="Escribinos por WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
          </a>
        </div>

      </div>

      {/* Cart Drawer Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        products={products}
        onAdd={handleAddToCart}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        whatsappNumber={info.phone}
      />

      {/* Product Detail Modal */}
      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        whatsappNumber={info.phone}
      />
    </div>
  );
};

export default PerlaFitCatalogo;
