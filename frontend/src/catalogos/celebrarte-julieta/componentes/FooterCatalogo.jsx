import React from 'react';
import { Phone, MapPin, Clock, Award } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { BUSINESS_NAME, DEFAULT_HOURS, DEFAULT_ADDRESS } from '../config';

const FooterCatalogo = ({ info = {}, topProducts = [] }) => {
  const {
    name = BUSINESS_NAME,
    description = "Ambientaciones, Fiesta del Té y Glitter Bar para hacer de tu evento un momento inolvidable.",
    address = DEFAULT_ADDRESS,
    phone = "5491131307799",
    instagram = "",
    hours = DEFAULT_HOURS,
    logo
  } = info;

  // Tomamos los top 5 recomendados
  const topFive = topProducts.slice(0, 5);

  return (
    <footer className="bg-brand-dark text-white border-t border-white/5 w-full mt-0 pt-10 pb-6 relative overflow-hidden">
      {/* Subtle light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/5">
          
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-serif font-black text-white text-sm shadow-md overflow-hidden shrink-0">
                {logo ? (
                  <img src={logo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name ? name.charAt(0).toUpperCase() : BUSINESS_NAME.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-base uppercase tracking-wide text-white leading-none">
                  {name}
                </span>
                <span className="text-[9px] text-white font-sans font-bold uppercase tracking-wider leading-none mt-1">
                  Eventos Inolvidables
                </span>
              </div>
            </div>
            <p className="text-xs text-white/80 font-sans leading-relaxed max-w-sm">
              {description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-green-500 hover:text-white transition-all text-white/90 flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
                title="WhatsApp"
              >
                <FaWhatsapp className="text-sm" />
              </a>
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white transition-all text-white/90 flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
                  title="Instagram"
                >
                  <FaInstagram className="text-sm" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Info (3 Cols) */}
          <div className="md:col-span-3 space-y-3.5">
            <h5 className="text-[10px] font-sans font-bold text-white uppercase tracking-widest">
              Contacto y Local
            </h5>
            <ul className="space-y-3 text-xs text-white/80 font-sans font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-white shrink-0" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>

          {/* Top 5 list (4 Cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <h5 className="text-[10px] font-sans font-bold text-white uppercase tracking-widest">
              Servicios Destacados
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5">
              {topFive.map((product, index) => (
                <div key={product.id || index} className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-white/60 bg-accent/5 px-2 py-1 rounded-md border border-accent/10">
                    #{index + 1}
                  </span>
                  <span className="text-xs text-white/90 truncate font-semibold">
                    {product.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-white/70 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <a 
              href="https://www.tucatalogoideal.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-all cursor-pointer font-sans"
            >
              www.tucatalogoideal.com
            </a>
            <div className="w-[1px] h-3.5 bg-white/10" />
            <a
              href="https://wa.me/5491164623427?text=Hola!%20Quiero%20diseñar%20mi%20catálogo%20ideal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-400 text-white/90 transition-all cursor-pointer"
              title="Contacto WhatsApp"
            >
              <FaWhatsapp className="text-sm" />
              <span>1164623427</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterCatalogo;

