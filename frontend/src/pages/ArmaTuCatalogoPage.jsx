import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Store, Phone, FileText, ChevronLeft, ArrowRight,
    Image as ImageIcon, MapPin, Instagram, Star, Clock, Tag, 
    Video, BarChart3, MessageCircle, Music, Palette, ShoppingBag,
    Check, Sparkles, Send
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Header from '../components/main-web/Header';
import Footer from '../components/main-web/Footer';

const extras = [
    {
        id: 'galeria',
        name: 'Galería de Fotos',
        description: 'Showcase visual con tus mejores trabajos, productos o el ambiente de tu negocio.',
        icon: ImageIcon
    },
    {
        id: 'ubicacion',
        name: 'Ubicación con Google Maps',
        description: 'Mapa interactivo para que tus clientes te encuentren fácil.',
        icon: MapPin
    },
    {
        id: 'redes',
        name: 'Redes Sociales',
        description: 'Links directos a Instagram, Facebook, TikTok y todas tus redes.',
        icon: Instagram
    },
    {
        id: 'testimonios',
        name: 'Testimonios de Clientes',
        description: 'Sección con reseñas y valoraciones que generan confianza.',
        icon: Star
    },
    {
        id: 'horarios',
        name: 'Horarios de Atención',
        description: 'Tabla con días y horarios para que sepan cuándo encontrarte.',
        icon: Clock
    },
    {
        id: 'promos',
        name: 'Promociones Activas',
        description: 'Banner destacado con tus ofertas y descuentos.',
        icon: Tag
    },
    {
        id: 'video',
        name: 'Video Presentación',
        description: 'Embed de YouTube o video propio contando tu historia.',
        icon: Video
    },
    {
        id: 'estadisticas',
        name: 'Panel de Estadísticas',
        description: 'Medí cuántas personas visitan tu catálogo desde un panel privado.',
        icon: BarChart3
    },
    {
        id: 'formulario',
        name: 'Formulario de Contacto',
        description: 'Formulario con nombre, email y mensaje para recibir consultas.',
        icon: MessageCircle
    },
    {
        id: 'musica',
        name: 'Música de Fondo',
        description: 'Una canción representativa de tu marca sonando al abrir el catálogo.',
        icon: Music
    }
];

const ArmaTuCatalogoPage = () => {
    const [contactName, setContactName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [selectedExtras, setSelectedExtras] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleExtra = (id) => {
        setSelectedExtras(prev => 
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const handleWhatsApp = () => {
        const extrasText = selectedExtras.length > 0 
            ? selectedExtras.map(id => extras.find(e => e.id === id)?.name).join(', ')
            : 'Ninguno seleccionado';

        const message = `🚀 *NUEVO CATÁLOGO DIGITAL*\n\n` +
            `👤 *Contacto:* ${contactName || 'No especificado'}\n` +
            `🏪 *Negocio:* ${businessName || 'No especificado'}\n` +
            `📋 *Rubro:* ${businessType || 'No especificado'}\n` +
            `📱 *Teléfono:* ${phone || 'No especificado'}\n` +
            `📝 *Descripción:* ${description || 'No especificado'}\n\n` +
            `✨ *Extras seleccionados:*\n${extrasText}\n\n` +
            `Enviado desde tucatalogoideal.com`;

        const whatsappUrl = `https://wa.me/5491164000000?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const isFormValid = contactName.trim() && businessName.trim();

    return (
        <div className="min-h-screen bg-web-bg">
            <Header forceDark />

            <main className="pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <a href="/" className="inline-flex items-center space-x-2 text-xs font-sans text-web-text-muted hover:text-accent transition-colors mb-6">
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Volver al inicio</span>
                        </a>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-brand mb-4">
                            Armá tu <span className="text-gradient italic">catálogo</span>
                        </h1>
                        <p className="text-sm sm:text-base font-sans text-web-text-muted max-w-lg mx-auto leading-relaxed">
                            Seleccioná las secciones que más te gusten y recibí un presupuesto detallado por WhatsApp.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Form & Extras */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* STEP 1: Business Data */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">1</div>
                                    <h3 className="text-sm font-bold text-brand uppercase tracking-[0.3em]">Datos de tu negocio</h3>
                                </div>
                                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-web-border/50 shadow-sm space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 pl-2">Tu Nombre</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand/20" />
                                                <input
                                                    type="text"
                                                    value={contactName}
                                                    onChange={(e) => setContactName(e.target.value)}
                                                    placeholder="Ej: María López"
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-web-bg border border-web-border/50 text-sm font-sans text-brand placeholder:text-brand/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 pl-2">Nombre del Negocio</label>
                                            <div className="relative">
                                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand/20" />
                                                <input
                                                    type="text"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                    placeholder="Ej: Perla Fit"
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-web-bg border border-web-border/50 text-sm font-sans text-brand placeholder:text-brand/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 pl-2">Rubro / Industria</label>
                                            <div className="relative">
                                                <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand/20" />
                                                <input
                                                    type="text"
                                                    value={businessType}
                                                    onChange={(e) => setBusinessType(e.target.value)}
                                                    placeholder="Ej: Fitness, Barbería, Gastronomía..."
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-web-bg border border-web-border/50 text-sm font-sans text-brand placeholder:text-brand/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 pl-2">Teléfono (opcional)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand/20" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="Ej: 11 6400 0000"
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-web-bg border border-web-border/50 text-sm font-sans text-brand placeholder:text-brand/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 pl-2">Contanos sobre tu negocio (opcional)</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-4 w-4 h-4 text-brand/20" />
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="¿Qué vendés o qué servicios ofrecés? ¿Tenés un estilo o paleta de colores en mente?"
                                                rows={3}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-web-bg border border-web-border/50 text-sm font-sans text-brand placeholder:text-brand/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* STEP 2: Extras */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</div>
                                    <h3 className="text-sm font-bold text-brand uppercase tracking-[0.3em]">Secciones Extras</h3>
                                </div>
                                <p className="text-xs font-sans text-web-text-muted mb-4 pl-12">
                                    Seleccioná las secciones que querés incluir en tu catálogo. Todas son opcionales.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {extras.map((extra) => {
                                        const isSelected = selectedExtras.includes(extra.id);
                                        return (
                                            <motion.button
                                                key={extra.id}
                                                onClick={() => toggleExtra(extra.id)}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                                                    isSelected
                                                        ? 'bg-accent/5 border-accent/30 shadow-md shadow-accent/10'
                                                        : 'bg-white border-web-border/50 hover:border-accent/20 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                                        isSelected 
                                                            ? 'bg-gradient-to-br from-accent to-accent-dark shadow-sm' 
                                                            : 'bg-web-bg'
                                                    }`}>
                                                        <extra.icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand/30'}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-sans font-bold ${isSelected ? 'text-brand' : 'text-brand/70'}`}>
                                                            {extra.name}
                                                        </p>
                                                        <p className="text-[10px] font-sans text-web-text-muted mt-0.5 leading-relaxed">
                                                            {extra.description}
                                                        </p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                                                        isSelected 
                                                            ? 'bg-accent text-white' 
                                                            : 'border border-web-border'
                                                    }`}>
                                                        {isSelected && <Check className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        </div>

                        {/* Right: Sticky Summary */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-28">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-2xl border border-web-border/50 shadow-sm overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-brand to-brand-light p-6">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Sparkles className="w-5 h-5 text-accent-light" />
                                            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-[0.15em]">Tu Catálogo</h3>
                                        </div>
                                        <p className="text-[10px] font-sans text-white/50">Resumen de lo seleccionado</p>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-5">
                                        {/* Business name preview */}
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand/30">Negocio</span>
                                            <p className="text-sm font-sans font-bold text-brand">
                                                {businessName || <span className="text-brand/20 italic font-normal">Sin nombre aún</span>}
                                            </p>
                                        </div>

                                        {/* Included features */}
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand/30">Incluido</span>
                                            <div className="space-y-1">
                                                {['Catálogo de Productos', 'WhatsApp Directo', 'Diseño Personalizado', 'Mobile First'].map((item) => (
                                                    <div key={item} className="flex items-center space-x-2">
                                                        <Check className="w-3 h-3 text-accent" />
                                                        <span className="text-[11px] font-sans text-brand/60">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selected extras */}
                                        {selectedExtras.length > 0 && (
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand/30">
                                                    Extras ({selectedExtras.length})
                                                </span>
                                                <div className="space-y-1">
                                                    {selectedExtras.map(id => {
                                                        const extra = extras.find(e => e.id === id);
                                                        return (
                                                            <motion.div
                                                                key={id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                                                <span className="text-[11px] font-sans text-brand/60">{extra?.name}</span>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="border-t border-web-border/30 pt-4">
                                            <p className="text-[10px] font-sans text-web-text-muted text-center mb-4">
                                                Consultá el precio por WhatsApp
                                            </p>
                                        </div>

                                        {/* WhatsApp CTA */}
                                        <button
                                            onClick={handleWhatsApp}
                                            disabled={!isFormValid}
                                            className={`w-full py-4 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.15em] flex items-center justify-center space-x-2.5 transition-all ${
                                                isFormValid
                                                    ? 'bg-[#25D366] text-white hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5 active:scale-95'
                                                    : 'bg-web-bg text-brand/20 cursor-not-allowed'
                                            }`}
                                        >
                                            <span>Enviar por WhatsApp</span>
                                            <FaWhatsapp className="w-4 h-4" />
                                        </button>

                                        {!isFormValid && (
                                            <p className="text-[9px] font-sans text-web-text-muted text-center">
                                                Completá tu nombre y nombre del negocio para continuar
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ArmaTuCatalogoPage;
