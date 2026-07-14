import React from 'react';
import { motion } from 'framer-motion';
import { 
    ShoppingBag, MapPin, Instagram, MessageCircle, Image, Clock, 
    Tag, Video, Star, Smartphone, BarChart3, Palette, Check
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const features = [
    {
        icon: ShoppingBag,
        title: 'Catálogo de Productos',
        description: 'Mostrá tus productos o servicios con fotos, precios y descripción. Actualizable en cualquier momento.',
        included: true
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp Directo',
        description: 'Botón flotante de WhatsApp para que tus clientes te contacten al instante.',
        included: true
    },
    {
        icon: Smartphone,
        title: 'Diseño Mobile First',
        description: 'Optimizado para celulares. Tus clientes lo ven perfecto desde cualquier dispositivo.',
        included: true
    },
    {
        icon: MapPin,
        title: 'Ubicación con Mapa',
        description: 'Google Maps integrado para que tus clientes lleguen fácil a tu local o punto de encuentro.',
        included: false
    },
    {
        icon: Instagram,
        title: 'Redes Sociales',
        description: 'Links directos a tu Instagram, Facebook, TikTok y todas tus redes.',
        included: false
    },
    {
        icon: Image,
        title: 'Galería de Fotos',
        description: 'Showcase visual con tus mejores trabajos, productos o el ambiente de tu negocio.',
        included: false
    },
    {
        icon: Star,
        title: 'Testimonios',
        description: 'Sección con reseñas de clientes satisfechos que generan confianza.',
        included: false
    },
    {
        icon: Clock,
        title: 'Horarios de Atención',
        description: 'Tabla clara con tus días y horarios para que sepan cuándo encontrarte.',
        included: false
    },
    {
        icon: Tag,
        title: 'Promociones',
        description: 'Banner destacado con tus ofertas y descuentos activos.',
        included: false
    },
    {
        icon: Video,
        title: 'Video Presentación',
        description: 'Embed de YouTube o video propio contando tu historia.',
        included: false
    },
    {
        icon: BarChart3,
        title: 'Panel de Estadísticas',
        description: 'Medí cuántas personas ven tu catálogo con un panel privado de visitas.',
        included: false
    },
    {
        icon: Palette,
        title: 'Diseño Personalizado',
        description: 'Colores, tipografía y estilo que representen la identidad de tu marca.',
        included: true
    }
];

const Services = () => {
    return (
        <section id="servicios" className="relative py-24 md:py-32 px-6 bg-web-bg overflow-hidden">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-[200px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-accent mb-4">Funcionalidades</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-brand leading-tight mb-6">
                        Todo lo que tu catálogo incluye
                    </h2>
                    <p className="text-base font-sans text-web-text-muted max-w-2xl mx-auto leading-relaxed">
                        Cada catálogo viene con funcionalidades esenciales incluidas y extras opcionales para potenciar tu negocio.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white rounded-2xl p-6 border border-web-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                                    feature.included 
                                        ? 'bg-gradient-to-br from-accent to-accent-dark shadow-lg shadow-accent/20' 
                                        : 'bg-brand/5 group-hover:bg-accent/10'
                                }`}>
                                    <feature.icon className={`w-5 h-5 ${feature.included ? 'text-white' : 'text-brand/60 group-hover:text-accent'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1.5">
                                        <h3 className="text-sm font-sans font-bold text-brand">{feature.title}</h3>
                                        {feature.included && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-accent/10 text-[7px] font-sans font-bold uppercase tracking-wider text-accent-dark">
                                                <Check className="w-2.5 h-2.5 mr-0.5" /> Incluido
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-sans text-web-text-muted leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-accent/5 border border-accent/20">
                        <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                        <span className="text-xs font-sans font-medium text-brand">
                            ¿Querés saber más? <a href="/arma-tu-catalogo" className="font-bold text-accent hover:underline">Armá tu catálogo →</a>
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
