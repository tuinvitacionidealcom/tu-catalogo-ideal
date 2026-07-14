import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Smartphone, Globe, Zap } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_LINK } from '../../constants/config';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-6">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-web-bg via-white to-accent/5 z-0"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Floating shapes */}
            <div className="absolute top-32 left-[15%] w-3 h-3 bg-accent/30 rounded-full animate-float hidden lg:block"></div>
            <div className="absolute top-48 right-[20%] w-2 h-2 bg-brand/20 rounded-full animate-float-slow hidden lg:block"></div>
            <div className="absolute bottom-32 left-[25%] w-4 h-4 bg-accent/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left: Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-accent-dark">Tu negocio, digital</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-serif text-brand tracking-tight leading-[1.1] mb-6 font-medium">
                        Tu catálogo digital{' '}
                        <span className="text-gradient italic font-light">
                            profesional
                        </span>
                        <br />
                        en minutos
                    </h1>

                    <p className="text-base md:text-lg font-sans font-medium text-web-text-muted leading-relaxed mb-10 max-w-xl">
                        Mostrá tus productos y servicios con un diseño premium. Compartilo por WhatsApp, redes sociales y convertí visitantes en clientes.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
                        <a
                            href="/arma-tu-catalogo"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand to-brand-light text-white rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-brand/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5"
                        >
                            <span>Armá tu Catálogo</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>

                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-brand rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] border border-web-border hover:border-accent/30 hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center space-x-2.5"
                        >
                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                            <span>Consultanos</span>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-8">
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-2xl font-serif font-bold text-brand">100%</span>
                            <span className="text-[9px] font-sans uppercase tracking-widest text-web-text-muted">Personalizable</span>
                        </div>
                        <div className="w-px h-10 bg-web-border"></div>
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-2xl font-serif font-bold text-brand">24hs</span>
                            <span className="text-[9px] font-sans uppercase tracking-widest text-web-text-muted">Entrega</span>
                        </div>
                        <div className="w-px h-10 bg-web-border"></div>
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-2xl font-serif font-bold text-accent">∞</span>
                            <span className="text-[9px] font-sans uppercase tracking-widest text-web-text-muted">Visitas</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Mockup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex items-center justify-center"
                >
                    {/* Glow behind card */}
                    <div className="absolute w-80 h-80 bg-accent/15 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    {/* Phone mockup */}
                    <div className="relative w-[280px] sm:w-[300px] animate-float">
                        {/* Phone frame */}
                        <div className="bg-brand rounded-[2.5rem] p-3 shadow-2xl shadow-brand/30">
                            <div className="bg-white rounded-[2rem] overflow-hidden">
                                {/* Status bar */}
                                <div className="bg-brand px-6 py-3 flex items-center justify-between">
                                    <span className="text-[9px] text-white/70 font-sans font-medium">tucatalogoideal.com</span>
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 rounded-full bg-white/50"></div>
                                        <div className="w-1 h-1 rounded-full bg-white/50"></div>
                                        <div className="w-1 h-1 rounded-full bg-white/50"></div>
                                    </div>
                                </div>
                                
                                {/* Content preview */}
                                <div className="p-5 space-y-4">
                                    {/* Logo area */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-sans font-extrabold text-brand">Perla Fit</p>
                                            <p className="text-[8px] font-sans text-web-text-muted">Entrenamiento personalizado</p>
                                        </div>
                                    </div>

                                    {/* Mini gallery */}
                                    <div className="grid grid-cols-3 gap-1.5">
                                        <div className="aspect-square rounded-lg bg-gradient-to-br from-accent/20 to-accent/10"></div>
                                        <div className="aspect-square rounded-lg bg-gradient-to-br from-brand/10 to-brand/5"></div>
                                        <div className="aspect-square rounded-lg bg-gradient-to-br from-accent/15 to-accent/5"></div>
                                    </div>

                                    {/* Products preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between py-2 border-b border-web-border/50">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10"></div>
                                                <div>
                                                    <p className="text-[9px] font-sans font-bold text-brand">Plan Mensual</p>
                                                    <p className="text-[7px] font-sans text-web-text-muted">4 clases/semana</p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-sans font-bold text-accent">$25.000</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-web-border/50">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-lg bg-brand/10"></div>
                                                <div>
                                                    <p className="text-[9px] font-sans font-bold text-brand">Clase Suelta</p>
                                                    <p className="text-[7px] font-sans text-web-text-muted">1 sesión</p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-sans font-bold text-accent">$8.000</span>
                                        </div>
                                    </div>

                                    {/* WhatsApp CTA */}
                                    <div className="bg-[#25D366] rounded-xl py-2.5 flex items-center justify-center space-x-2">
                                        <FaWhatsapp className="w-3.5 h-3.5 text-white" />
                                        <span className="text-[9px] font-sans font-bold text-white uppercase tracking-wider">Contactar</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -left-8 top-1/4 glass px-3 py-2 rounded-xl shadow-lg"
                        >
                            <div className="flex items-center space-x-2">
                                <Globe className="w-3.5 h-3.5 text-accent" />
                                <span className="text-[8px] font-sans font-bold text-brand uppercase tracking-wider">Online 24/7</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-6 top-2/3 glass px-3 py-2 rounded-xl shadow-lg"
                        >
                            <div className="flex items-center space-x-2">
                                <Smartphone className="w-3.5 h-3.5 text-accent" />
                                <span className="text-[8px] font-sans font-bold text-brand uppercase tracking-wider">Mobile First</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
