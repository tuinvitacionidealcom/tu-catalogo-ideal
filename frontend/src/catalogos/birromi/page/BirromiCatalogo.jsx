import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowLeft, Store, X } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import HeroCatalogo from '../componentes/HeroCatalogo';
import ProductCard from '../componentes/ProductCard';
import CategoryTabs from '../componentes/CategoryTabs';
import CartModal from '../componentes/CartModal';
import FooterCatalogo from '../componentes/FooterCatalogo';
import ProductModal from '../componentes/ProductModal';
import { Link } from 'react-router-dom';

// Importación de imágenes locales
import logoImg from '../img/logo.webp';
import blondeAleImg from '../img/blondeale(rubia).webp';
import irishRedImg from '../img/irishred.webp';
import stoutImg from '../img/stout.webp';
import ipaArgentaImg from '../img/ipaargenta.webp';
import doubleNeipaImg from '../img/dobleneipaargenta.webp';
import westCoastIpaImg from '../img/westcoastipa.webp';
import imgPromo1Img from '../img/imgpromo1.webp';
import copaOlavarriaImg from '../img/copaargentina2024olavarria2023.webp';
import copaCervezasImg from '../img/copaargentinadecervezas2026.webp';
import copaAustralImg from '../img/copaaustraloro2025.webp';

const LOCAL_STORAGE_PRODUCTS_KEY = 'birromi_products_custom';
const LOCAL_STORAGE_INFO_KEY = 'birromi_info_custom';

const defaultProducts = [
  {
    id: 1,
    name: 'Blonde Ale (Rubia)',
    description: 'Cerveza artesanal clásica dorada, ligera y refrescante, de amargor bajo y notas maltosas suaves.',
    price: 4500,
    image: blondeAleImg,
    category: 'LATAS CLÁSICAS',
    available: true
  },
  {
    id: 2,
    name: 'Irish Red',
    description: 'De color rojizo profundo, maltosa con sutiles notas a caramelo y un amargor muy equilibrado.',
    price: 4500,
    image: irishRedImg,
    category: 'LATAS CLÁSICAS',
    available: true
  },
  {
    id: 3,
    name: 'Stout (Negra)',
    description: 'Cerveza oscura con cuerpo, marcadas notas a chocolate amargo y café tostado.',
    price: 4500,
    image: stoutImg,
    category: 'LATAS CLÁSICAS',
    available: true
  },
  {
    id: 4,
    name: 'IPA Argenta',
    description: 'Una IPA con identidad nacional, lúpulos cítricos y amargor persistente característico.',
    price: 5000,
    image: ipaArgentaImg,
    category: 'LATAS IPAS',
    available: true
  },
  {
    id: 5,
    name: 'Doble NEIPA Argenta',
    description: 'Cerveza extremadamente turbia y jugosa. Una explosión de aroma y sabor a lúpulo tropical sin amargor agresivo.',
    price: 5000,
    image: doubleNeipaImg,
    category: 'LATAS IPAS',
    available: true
  },
  {
    id: 6,
    name: 'West Coast IPA',
    description: 'IPA clásica de la costa oeste estadounidense: seca, de amargor alto, resinosa y frutal.',
    price: 5000,
    image: westCoastIpaImg,
    category: 'LATAS IPAS',
    available: true
  },
  {
    id: 7,
    name: 'Promo Mundial Ludus',
    description: '¡Combo especial! Llevate una selección de nuestras latas premiadas clásicas e IPAs a un precio promocional.',
    price: 35000,
    image: imgPromo1Img,
    category: 'PROMO MUNDIAL',
    available: true
  },
  {
    id: 8,
    name: 'Promo 3x Latas Clásicas',
    description: 'Pack de 3 latas de variedades clásicas (Blonde Ale, Irish Red o Stout).',
    price: 13000,
    image: copaOlavarriaImg,
    category: 'PROMOS CLÁSICAS',
    available: true
  },
  {
    id: 9,
    name: 'Promo 6x Latas Clásicas',
    description: 'Pack de 6 latas clásicas para stockearte al mejor precio.',
    price: 24000,
    image: copaCervezasImg,
    category: 'PROMOS CLÁSICAS',
    available: true
  },
  {
    id: 10,
    name: 'Promo 3x Latas IPAs',
    description: 'Pack de 3 latas de nuestras variedades lupuladas más intensas.',
    price: 14000,
    image: copaAustralImg,
    category: 'PROMOS IPAS',
    available: true
  },
  {
    id: 11,
    name: 'Promo 6x Latas IPAs',
    description: 'Pack de 6 latas IPAs para disfrutar de la máxima frescura de lúpulo.',
    price: 27000,
    image: copaAustralImg,
    category: 'PROMOS IPAS',
    available: true
  }
];

const defaultInfo = {
  name: "Birromi Cerveza Artesanal",
  description: "Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.",
  address: "Av. de Mayo 1420, Ramos Mejía",
  phone: "5491139246425",
  instagram: "birromi.ludus",
  hours: "Lunes a Sábados de 10:00 a 20:00",
  logo: logoImg
};

const BirromiCatalogo = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [info, setInfo] = useState(defaultInfo);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load custom data from localStorage if exists
  useEffect(() => {
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    const savedInfo = localStorage.getItem(LOCAL_STORAGE_INFO_KEY);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedInfo) {
      setInfo(JSON.parse(savedInfo));
    }
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

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      setShowHeader(isScrolled);
      
      // Mostrar el mensaje flotante de WhatsApp solo si no fue descartado y el usuario baja
      if (isScrolled && !wspMessageDismissed) {
        setShowWspMessage(true);

        // Ocultar automáticamente el mensaje después de 6 segundos
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowWspMessage(false);
        }, 6000);
      } else {
        setShowWspMessage(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [wspMessageDismissed]);

  return (
    <div className="min-h-screen bg-web-bg-warm pb-0 text-slate-800 font-sans relative">
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
              "B!"
            )}
          </div>
          <span className="font-serif font-black text-sm uppercase tracking-widest text-white">
            Birromi
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

              {/* Category Navigation */}
              <CategoryTabs
                categories={categories}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Product Grid */}
              <div className="px-6 py-8">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-sm">No encontramos productos que coincidan con tu búsqueda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={getProductQuantity(product.id)}
                        onAdd={handleAddToCart}
                        onRemove={handleRemoveFromCart}
                        onClick={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section (Anchor 'Más Info') */}
            <div id="informacion-contacto" className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
              <h3 className="font-serif font-black text-lg text-brand border-b border-slate-100 pb-2">
                Información de Entrega y Contacto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                <div className="space-y-2">
                  <p className="font-bold text-brand uppercase text-[10px] tracking-wider">Dirección de Retiro</p>
                  <p>{info.address}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-brand uppercase text-[10px] tracking-wider">Horario de Atención</p>
                  <p>{info.hours}</p>
                </div>
              </div>
            </div>

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

      {/* Floating Action Button (Cart for Mobile) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 px-6 max-w-md mx-auto lg:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-brand hover:bg-brand-light active:scale-95 transition-all text-white font-sans font-bold py-4 rounded-2xl flex items-center justify-between px-6 shadow-xl shadow-brand/35 animate-bounce cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent text-brand rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
                {totalCartItems}
              </div>
              <span className="text-sm">Ver mi pedido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <span className="text-sm font-extrabold">
                ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('es-AR')}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Mensaje flotante de WhatsApp temporario (aparece al hacer scroll y tiene cruz para cerrar) */}
      {showWspMessage && (
        <div className="fixed bottom-6 right-6 z-45 max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-slide-up flex items-start gap-3">
          <div className="bg-green-500 text-white p-2.5 rounded-xl shrink-0">
            <FaWhatsapp className="text-xl animate-bounce" />
          </div>
          <div className="flex-1 text-left min-w-0 pr-4">
            <p className="font-sans font-bold text-slate-800 text-xs">¿Tenés alguna duda?</p>
            <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
              Hacé click acá para consultarnos directo por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${info.phone}?text=Hola!%20Quería%20hacerles%20una%20consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-[10px] text-green-500 hover:text-green-600 font-bold underline cursor-pointer"
            >
              Iniciar Chat
            </a>
          </div>
          {/* Cruz para cerrar el mensaje */}
          <button
            onClick={() => {
              setShowWspMessage(false);
              setWspMessageDismissed(true);
            }}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-all p-1 cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
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

export default BirromiCatalogo;
