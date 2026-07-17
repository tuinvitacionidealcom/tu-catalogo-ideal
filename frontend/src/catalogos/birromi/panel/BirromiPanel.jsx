import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit3, Check, Store, ShoppingBag } from 'lucide-react';

const LOCAL_STORAGE_PRODUCTS_KEY = 'birromi_products_custom';
const LOCAL_STORAGE_INFO_KEY = 'birromi_info_custom';

const defaultProducts = [
  {
    id: 1,
    name: 'Lata Clásica Ludus (1 Unidad)',
    description: 'Cerveza artesanal Ludus clásica. Variedades Golden, Honey o Scottish según disponibilidad.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=60',
    category: 'LATAS CLÁSICAS',
    available: true
  },
  {
    id: 2,
    name: 'Promo 3x Latas Clásicas Ludus',
    description: 'Pack de 3 latas de variedades clásicas a elección. ¡Ideal para compartir!',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=60',
    category: 'PROMOS CLÁSICAS',
    available: true
  },
  {
    id: 3,
    name: 'Promo 6x Latas Clásicas Ludus',
    description: 'Pack de 6 latas de variedades clásicas. La mejor relación precio-calidad.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=600&auto=format&fit=crop&q=60',
    category: 'PROMOS CLÁSICAS',
    available: true
  },
  {
    id: 4,
    name: 'Lata IPA Ludus (1 Unidad)',
    description: 'Cerveza artesanal Ludus IPA / NEIPA con lúpulos seleccionados de aroma y amargor intenso.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop&q=60',
    category: 'LATAS IPAS',
    available: true
  },
  {
    id: 5,
    name: 'Promo 3x Latas IPAs Ludus',
    description: 'Pack de 3 latas de variedades lupuladas de la marca Ludus.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&auto=format&fit=crop&q=60',
    category: 'PROMOS IPAS',
    available: true
  },
  {
    id: 6,
    name: 'Promo 6x Latas IPAs Ludus',
    description: 'Pack de 6 latas de variedades lupuladas Ludus. Para los verdaderos amantes del lúpulo.',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&auto=format&fit=crop&q=60',
    category: 'PROMOS IPAS',
    available: true
  },
  {
    id: 7,
    name: 'Promo Mundial Ludus',
    description: '¡Super Combo Especial! Una selección imperdible de latas clásicas y lúpulos premium para alentar a la selección.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=600&auto=format&fit=crop&q=60',
    category: 'PROMO MUNDIAL',
    available: true
  }
];

const defaultInfo = {
  name: "Birromi Cerveza Artesanal",
  description: "Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.",
  address: "Av. de Mayo 1420, Ramos Mejía",
  phone: "5491139246425",
  instagram: "birromi.ludus",
  hours: "Lunes a Sábados de 10:00 a 20:00"
};

const BirromiPanel = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [info, setInfo] = useState(defaultInfo);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'products'
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductAvailable, setNewProductAvailable] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    const savedInfo = localStorage.getItem(LOCAL_STORAGE_INFO_KEY);
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedInfo) setInfo(JSON.parse(savedInfo));
  }, []);

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

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...info, [name]: value };
    setInfo(updated);
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    saveToLocalStorage(null, info);
    alert('Configuración comercial guardada correctamente.');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductCategory) {
      alert('Completá los campos obligatorios: Nombre, Precio y Categoría');
      return;
    }

    let updatedProducts;
    if (editingProduct) {
      // Edit
      updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: newProductName,
              description: newProductDesc,
              price: parseFloat(newProductPrice),
              category: newProductCategory.toUpperCase(),
              image: newProductImage,
              available: newProductAvailable
            }
          : p
      );
      setEditingProduct(null);
    } else {
      // Create
      const newProduct = {
        id: Date.now(),
        name: newProductName,
        description: newProductDesc,
        price: parseFloat(newProductPrice),
        category: newProductCategory.toUpperCase(),
        image: newProductImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
        available: newProductAvailable
      };
      updatedProducts = [...products, newProduct];
    }

    saveToLocalStorage(updatedProducts, null);
    clearProductForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductDesc(product.description);
    setNewProductPrice(product.price);
    setNewProductCategory(product.category);
    setNewProductImage(product.image);
    setNewProductAvailable(product.available);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('¿Seguro que querés eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      saveToLocalStorage(updated, null);
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-md flex flex-col">
        {/* Header */}
        <div className="bg-brand text-white p-5 flex items-center justify-between border-b border-white/10">
          <Link to="/birromi" className="text-white hover:text-accent transition-all flex items-center gap-1 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Catálogo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-accent" />
            <h1 className="font-sans font-extrabold text-lg">Panel Birromi</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3.5 text-center font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-b-2 border-brand text-brand bg-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Información Comercial
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3.5 text-center font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-b-2 border-brand text-brand bg-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Productos ({products.length})
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 flex-1">
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Nombre del Comercio</label>
                <input
                  type="text"
                  name="name"
                  value={info.name}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Descripción</label>
                <textarea
                  name="description"
                  value={info.description}
                  onChange={handleInfoChange}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">WhatsApp (Código de país + número, sin +)</label>
                <input
                  type="text"
                  name="phone"
                  value={info.phone}
                  onChange={handleInfoChange}
                  placeholder="Ej: 5491123456789"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Instagram (Usuario sin @)</label>
                <input
                  type="text"
                  name="instagram"
                  value={info.instagram}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Dirección Física</label>
                <input
                  type="text"
                  name="address"
                  value={info.address}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Horarios de Atención</label>
                <input
                  type="text"
                  name="hours"
                  value={info.hours}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-light active:scale-95 text-white font-sans font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all mt-6 cursor-pointer"
              >
                <Save className="w-4 h-4 text-accent" />
                <span>Guardar Cambios</span>
              </button>
            </form>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Form (Create / Edit) */}
              <form onSubmit={handleSaveProduct} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  {editingProduct ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                  <span>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                    <input
                      type="text"
                      placeholder="Ej. Burguer Bacon"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoría *</label>
                    <input
                      type="text"
                      placeholder="Ej. HAMBURGUESAS"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descripción</label>
                  <input
                    type="text"
                    placeholder="Detalle de ingredientes o especificaciones"
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Precio ($ ARS) *</label>
                    <input
                      type="number"
                      placeholder="Ej. 6500"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Imagen URL</label>
                    <input
                      type="text"
                      placeholder="Unsplash o link público"
                      value={newProductImage}
                      onChange={(e) => setNewProductImage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProductAvailable}
                      onChange={(e) => setNewProductAvailable(e.target.checked)}
                      className="rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <span>¿Hay Stock Disponible?</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={clearProductForm}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold py-2 px-3 rounded-lg cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-brand hover:bg-brand-light text-white text-[10px] font-bold py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingProduct ? 'Actualizar' : 'Agregar'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Product list */}
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">Listado de Productos</h4>
                <div className="divide-y divide-slate-100">
                  {products.map(p => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {p.category} • ${p.price.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BirromiPanel;
