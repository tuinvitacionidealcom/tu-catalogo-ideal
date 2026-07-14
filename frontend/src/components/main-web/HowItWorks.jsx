import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Palette, Share2, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: MessageSquare,
        title: 'Contanos sobre tu negocio',
        description: 'Completá un breve formulario con los datos de tu emprendimiento, productos o servicios, y el estilo que buscás.',
        color: 'from-brand to-brand-light'
    },
    {
        number: '02',
        icon: Palette,
        title: 'Diseñamos tu catálogo',
        description: 'Creamos tu one-page profesional con diseño premium, optimizado para celulares y listo para compartir.',
        color: 'from-accent to-accent-dark'
    },
    {
        number: '03',
        icon: Share2,
        title: 'Compartí y vendé',
        description: 'Recibí tu link personalizado y compartilo por WhatsApp, Instagram o donde quieras. ¡A generar clientes!',
        color: 'from-brand-light to-accent'
    }
];

const HowItWorks = () => {
    return (
        <section id="como-funciona" className="relative py-24 md:py-32 px-6 bg-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -ml-48 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-[100px] -mr-40 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-accent mb-4">Proceso Simple</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-brand leading-tight mb-6">
                        ¿Cómo funciona?
                    </h2>
                    <p className="text-base font-sans text-web-text-muted max-w-2xl mx-auto leading-relaxed">
                        En 3 simples pasos tenés tu catálogo digital profesional listo para compartir con tus clientes.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="relative group"
                        >
                            {/* Connector line (hidden on mobile) */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-web-border to-transparent z-0"></div>
                            )}

                            <div className="relative bg-web-bg rounded-2xl p-8 border border-web-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 z-10">
                                {/* Step number */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-4xl font-serif font-bold text-brand/10 group-hover:text-accent/20 transition-colors">{step.number}</span>
                                </div>

                                <h3 className="text-lg font-serif font-semibold text-brand mb-3">{step.title}</h3>
                                <p className="text-sm font-sans text-web-text-muted leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <a
                        href="/arma-tu-catalogo"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand to-brand-light text-white rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-brand/30 transition-all hover:-translate-y-1"
                    >
                        <span>Empezá Ahora</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
