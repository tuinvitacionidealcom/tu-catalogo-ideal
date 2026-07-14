import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { Mail, ArrowUpRight } from 'lucide-react';
import { WHATSAPP_LINK, SOCIAL } from '../../constants/config';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Cómo Funciona', href: '/#como-funciona' },
        { name: 'Qué Incluye', href: '/#servicios' },
        { name: 'Ejemplos', href: '/#ejemplos' },
        { name: 'Armá tu Catálogo', href: '/arma-tu-catalogo' },
    ];

    return (
        <footer id="contacto" className="relative bg-brand text-white overflow-hidden">
            {/* Gradient top border */}
            <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            {/* Main footer */}
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg">
                                <span className="text-white font-serif font-bold text-lg italic">C</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-sans font-extrabold uppercase tracking-[0.2em] text-white">
                                    Tu Catálogo
                                </span>
                                <span className="text-[9px] font-sans font-medium uppercase tracking-[0.35em] -mt-0.5 text-accent-light">
                                    Ideal
                                </span>
                            </div>
                        </div>
                        <p className="text-sm font-sans text-white/50 leading-relaxed max-w-sm mb-8">
                            Catálogos digitales profesionales para emprendedores que quieren destacar. Tu negocio merece una presencia digital premium.
                        </p>

                        {/* Social */}
                        <div className="flex items-center space-x-3">
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 group"
                            >
                                <FaWhatsapp className="w-4 h-4 text-white/50 group-hover:text-white" />
                            </a>
                            <a
                                href={SOCIAL.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 group"
                            >
                                <FaInstagram className="w-4 h-4 text-white/50 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white/30 mb-6">Navegación</h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm font-sans text-white/50 hover:text-accent transition-colors flex items-center group"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white/30 mb-6">Contacto</h4>
                        <div className="space-y-4">
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                                    <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                                </div>
                                <span className="text-sm font-sans text-white/50 group-hover:text-white transition-colors">WhatsApp Directo</span>
                            </a>
                            <a
                                href={SOCIAL.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <FaInstagram className="w-3.5 h-3.5 text-purple-400" />
                                </div>
                                <span className="text-sm font-sans text-white/50 group-hover:text-white transition-colors">@tucatalogoideal</span>
                            </a>
                        </div>

                        {/* CTA */}
                        <a
                            href="/arma-tu-catalogo"
                            className="mt-8 w-full py-3.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-center flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-accent/30 transition-all"
                        >
                            <span>Armá tu Catálogo</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                    <p className="text-[10px] font-sans text-white/30">
                        © {currentYear} Tu Catálogo Ideal. Todos los derechos reservados.
                    </p>
                    <p className="text-[10px] font-sans text-white/20">
                        Diseñado con 💙 en Argentina
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
