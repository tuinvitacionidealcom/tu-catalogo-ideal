import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterCatalogo = ({ info = {} }) => {
  const {
    name = "Catálogo Digital",
    phone = "5491131307799",
    instagram = "",
    address = "Ciudad Autónoma de Buenos Aires",
    hours = "Lunes a Sábados: 9 a 20 hs",
    logoImage
  } = info;

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Columna 1: Info Marca */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {logoImage && (
                <img src={logoImage} alt={name} className="w-10 h-10 object-contain rounded-xl" />
              )}
              <h3 className="font-bold text-lg text-white">{name}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Catálogo oficial en línea. Consultá opciones, disponibilidad y realizá tu pedido directamente por WhatsApp.
            </p>
            <div className="flex items-center gap-3">
              {phone && (
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Atención y Horarios */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Atención y Horarios
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span>{hours}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          {/* Columna 3: Pedidos por WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Contacto Directo
            </h4>
            <p className="text-xs text-slate-400">
              ¿Tenés dudas o necesitás un presupuesto personalizado?
            </p>
            {phone && (
              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent('Hola! Te consulto desde tu catálogo online.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Escribinos al WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom branding */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5">
            <span>Potenciado por</span>
            <Link to="/" className="text-slate-300 font-bold hover:text-white transition-colors">
              Tu Catálogo Ideal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCatalogo;

