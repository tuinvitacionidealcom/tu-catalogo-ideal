import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Dumbbell, Scissors, Wine, ShoppingBag, Camera, Wrench } from 'lucide-react';

const examples = [
    {
        slug: 'perla-fit',
        name: 'Perla Fit',
        category: 'Fitness & Salud',
        description: 'Entrenamiento personalizado y planes nutricionales.',
        icon: Dumbbell,
        gradient: 'from-cyan-500 to-blue-600',
        products: ['Plan Mensual', 'Clase Suelta', 'Nutrición'],
        accent: '#06B6D4'
    },
    {
        slug: 'barberia-los-santos',
        name: 'Barbería Los Santos',
        category: 'Belleza & Cuidado',
        description: 'Cortes clásicos y modernos, barba y tratamientos capilares.',
        icon: Scissors,
        gradient: 'from-amber-600 to-orange-700',
        products: ['Corte Clásico', 'Barba', 'Combo'],
        accent: '#D97706'
    },
    {
        slug: 'santos-barriles',
        name: 'Santos Barriles',
        category: 'Gastronomía',
        description: 'Cerveza artesanal y barriles para eventos.',
        icon: Wine,
        gradient: 'from-emerald-600 to-green-700',
        products: ['Barril 20L', 'Barril 50L', 'Degustación'],
        accent: '#059669'
    },
    {
        slug: 'moda-bella',
        name: 'Moda Bella',
        category: 'Indumentaria',
        description: 'Ropa de mujer con estilo y tendencia.',
        icon: ShoppingBag,
        gradient: 'from-pink-500 to-rose-600',
        products: ['Vestidos', 'Remeras', 'Accesorios'],
        accent: '#EC4899'
    },
    {
        slug: 'foto-estudio',
        name: 'Foto Estudio Pro',
        category: 'Fotografía',
        description: 'Sesiones fotográficas profesionales para eventos y productos.',
        icon: Camera,
        gradient: 'from-violet-500 to-purple-700',
        products: ['Sesión Básica', 'Pack Evento', 'Producto'],
        accent: '#8B5CF6'
    },
    {
        slug: 'service-tech',
        name: 'Service Tech',
        category: 'Servicios',
        description: 'Reparación de celulares, notebooks y tablets.',
        icon: Wrench,
        gradient: 'from-slate-600 to-slate-800',
        products: ['Diagnóstico', 'Reparación', 'Mantenimiento'],
        accent: '#475569'
    }
];

const Gallery = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <section id="ejemplos" className="relative py-24 md:py-32 px-6 bg-white overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-accent mb-4">Inspirate</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-brand leading-tight mb-6">
                        Ejemplos de catálogos
                    </h2>
                    <p className="text-base font-sans text-web-text-muted max-w-2xl mx-auto leading-relaxed">
                        Mirá cómo quedaría tu catálogo profesional. Cada diseño se adapta a tu rubro y marca.
                    </p>
                </motion.div>

                {/* Examples Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examples.map((example, i) => (
                        <motion.div
                            key={example.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative bg-web-bg rounded-2xl overflow-hidden border border-web-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Card header gradient */}
                            <div className={`h-32 bg-gradient-to-br ${example.gradient} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10"></div>
                                {/* Pattern dots */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                
                                <div className="absolute bottom-4 left-5 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <example.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-sans font-extrabold text-white">{example.name}</p>
                                        <p className="text-[9px] font-sans text-white/70 uppercase tracking-wider">{example.category}</p>
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <AnimatePresence>
                                    {hoveredIndex === i && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                                        >
                                            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg">
                                                <ExternalLink className="w-3.5 h-3.5 text-brand" />
                                                <span className="text-[10px] font-sans font-bold text-brand uppercase tracking-wider">Ver Demo</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Card body */}
                            <div className="p-5">
                                <p className="text-xs font-sans text-web-text-muted mb-4 leading-relaxed">{example.description}</p>
                                
                                {/* Mini products */}
                                <div className="flex flex-wrap gap-1.5">
                                    {example.products.map((product) => (
                                        <span
                                            key={product}
                                            className="px-2.5 py-1 rounded-md text-[8px] font-sans font-bold uppercase tracking-wider border"
                                            style={{ 
                                                color: example.accent, 
                                                borderColor: `${example.accent}30`,
                                                backgroundColor: `${example.accent}08`
                                            }}
                                        >
                                            {product}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom bar */}
                            <div className="px-5 pb-4">
                                <div className="flex items-center justify-between pt-3 border-t border-web-border/30">
                                    <span className="text-[9px] font-sans text-web-text-muted">tucatalogoideal.com/{example.slug}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-web-text-muted group-hover:text-accent transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
