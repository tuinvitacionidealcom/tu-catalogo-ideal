import React from 'react';
import { Phone, MapPin, Clock, Star, MessageSquare } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const FooterCatalogo = ({ info = {}, topProducts = [] }) => {
  const {
    name = "Birromi Distribuidora",
    description = "Distribuidora oficial de cervezas artesanales Ludus.",
    address = "Av. de Mayo 1420, Ramos Mejía",
    phone = "5491123456789",
    instagram = "birromi.ludus",
    hours = "Lunes a Sábados de 10:00 a 20:00",
    logo
  } = info;

  // Tomamos los top 5 productos más comprados o los primeros 5 por defecto si no se especifican
  const topFive = topProducts.slice(0, 5);

  return (
    <footer className="bg-brand text-white border-t border-white/10 mt-12 rounded-t-[2.5rem]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Col 1: Branding de Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-serif font-black text-brand text-lg shadow-lg overflow-hidden shrink-0">
                {logo ? (
                  <img src={logo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  "B!"
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg uppercase tracking-wide text-white leading-none">
                  {name}
                </span>
                <span className="text-xs text-accent font-sans font-bold uppercase tracking-wider leading-none mt-1">
                  Distribuidora Ludus
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-medium font-sans leading-relaxed max-w-sm">
              {description}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500 hover:bg-green-600 transition-all text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                title="WhatsApp Directo"
              >
                <FaWhatsapp className="text-lg" />
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-pink-600 hover:bg-pink-700 transition-all text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                title="Instagram"
              >
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Col 2: Contacto y Horarios */}
          <div className="space-y-4">
            <h4 className="font-serif font-black text-base text-accent uppercase tracking-wider">
              Contacto y Servicios
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>{hours}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+{phone}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Top 5 de los productos más vendidos/comprados */}
          <div className="space-y-4">
            <h4 className="font-serif font-black text-base text-accent uppercase tracking-wider">
              Top 5 Recomendados
            </h4>
            {topFive.length === 0 ? (
              <p className="text-xs text-slate-400">Cargando productos...</p>
            ) : (
              <ul className="space-y-3">
                {topFive.map((product, index) => (
                  <li key={product.id || index} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-accent/20 border border-accent/35 flex items-center justify-center text-[10px] font-black text-accent shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-accent-light font-extrabold">
                        ${product.price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desarrollado con</span>
            <span className="text-red-500 text-xs">❤️</span>
            <span>por Tu Catálogo Ideal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCatalogo;
