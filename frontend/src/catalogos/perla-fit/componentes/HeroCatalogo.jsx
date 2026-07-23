import React from 'react';
import { Phone, MapPin, Clock, ArrowDown, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import portadaImg from '../img/foto-portada.webp';
import { BUSINESS_NAME, DEFAULT_HOURS, DEFAULT_ADDRESS } from '../config';

const HeroCatalogo = ({ info = {}, onScrollToProducts }) => {
  const {
    name = BUSINESS_NAME,
    description = "Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.",
    phone = "5491123456789",
    hours = DEFAULT_HOURS,
    address = DEFAULT_ADDRESS
  } = info;



  return (
    <div className="relative w-full h-[100vh] lg:h-[80vh] flex flex-col justify-between overflow-hidden">
      {/* Background Portada Full Image */}
      <img
        src={portadaImg}
        alt="Portada Birromi"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Black gradient overlay for premium legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/30 z-5" />


      {/* Hero Content - Center / Bottom aligned */}
      <div className="relative z-20 px-6 pb-16 max-w-xl mx-auto text-center flex flex-col items-center justify-center flex-1">
        {/* H1 */}
        <h1 className="text-6xl md:text-8xl font-serif font-black text-white leading-tight tracking-tight mb-2 text-shadow-md">
          {name}
        </h1>
        <span className="text-sm md:text-base font-sans font-black text-accent uppercase tracking-widest mb-6 block">
          Cervezas Artesanales
        </span>
        
        {/* Parrafo */}
        <p className="text-sm md:text-base text-slate-200 font-sans font-medium max-w-sm md:max-w-md mb-8 leading-relaxed">
          {description}
        </p>

        {/* CTA: Ver catálogo */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-md justify-center">
          <button
            onClick={onScrollToProducts}
            className="w-full sm:w-auto px-8 bg-accent hover:bg-accent-light active:scale-95 text-brand font-sans font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Micro scroll indicator */}
      <div className="relative z-20 pb-4 flex justify-center w-full animate-bounce">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Desliza para ver más
        </span>
      </div>
    </div>
  );
};

export default HeroCatalogo;

