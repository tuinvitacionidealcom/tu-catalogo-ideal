import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_LINK } from '../../constants/config';

const Header = ({ forceDark = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '/#' },
        { name: 'Cómo Funciona', href: '/#como-funciona' },
        { name: 'Qué Incluye', href: '/#servicios' },
        { name: 'Ejemplos', href: '/#ejemplos' },
        { name: 'Contacto', href: '/#contacto' }
    ];

    const handleLinkClick = (e, href) => {
        if (href.startsWith('/#') && window.location.pathname === '/') {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            const id = href.split('#')[1];
            if (!id) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <>
            <header
                className={`fixed w-full z-[100] transition-all duration-500 ${
                    (isScrolled || forceDark)
                        ? 'top-0 bg-white/90 backdrop-blur-xl shadow-sm border-b border-web-border/50 py-3'
                        : 'top-0 bg-transparent py-5'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
                            <span className="text-white font-serif font-bold text-sm italic">C</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] transition-colors ${isScrolled || forceDark ? 'text-brand' : 'text-brand'}`}>
                                Tu Catálogo
                            </span>
                            <span className={`text-[9px] font-sans font-medium uppercase tracking-[0.35em] -mt-0.5 transition-colors ${isScrolled || forceDark ? 'text-accent' : 'text-accent'}`}>
                                Ideal
                            </span>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleLinkClick(e, link.href)}
                                className={`text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all hover:text-accent ${
                                    isScrolled || forceDark ? 'text-brand/60' : 'text-brand/60'
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        <a
                            href="/arma-tu-catalogo"
                            className="hidden sm:flex px-5 py-2.5 bg-gradient-to-r from-brand to-brand-light text-white rounded-lg text-[10px] font-sans font-bold uppercase tracking-[0.15em] hover:shadow-lg hover:shadow-brand/30 transition-all hover:-translate-y-0.5 items-center space-x-2"
                        >
                            <span>Armá tu Catálogo</span>
                        </a>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-brand/5 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-brand" />
                            ) : (
                                <Menu className="w-5 h-5 text-brand" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[99] bg-white pt-20 px-6"
                    >
                        <nav className="flex flex-col space-y-1 mt-8">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="py-4 text-sm font-sans font-bold uppercase tracking-[0.2em] text-brand/70 hover:text-accent border-b border-web-border/30 transition-colors"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="mt-8 flex flex-col space-y-3">
                            <a
                                href="/arma-tu-catalogo"
                                className="w-full py-4 bg-gradient-to-r from-brand to-brand-light text-white rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-center"
                            >
                                Armá tu Catálogo
                            </a>
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-[#25D366] text-white rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-center flex items-center justify-center space-x-2"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
