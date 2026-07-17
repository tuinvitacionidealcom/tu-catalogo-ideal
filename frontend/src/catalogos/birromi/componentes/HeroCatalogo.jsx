import React from 'react';
import { Phone, MapPin, Clock, ArrowDown, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import portadaImg from '../img/foto-portada.webp';

const HeroCatalogo = ({ info = {}, onScrollToProducts }) => {
  const {
    name = "Birromi Distribuidora",
    description = "Distribuidora oficial de cervezas artesanales Ludus. Llevamos la mejor calidad directo a tu evento o local.",
    phone = "5491123456789",
    hours = "Lunes a Sábados de 10:00 a 20:00",
    address = "Av. de Mayo 1420, Ramos Mejía"
  } = info;

  const scrollToInfo = () => {
    const infoSection = document.getElementById('informacion-contacto');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-tight tracking-tight mb-4 text-shadow-md">
          {name}
        </h1>
        
        {/* Parrafo */}
        <p className="text-sm md:text-base text-slate-200 font-sans font-medium max-w-sm md:max-w-md mb-8 leading-relaxed">
          {description}
        </p>

        {/* Dos CTA: Ver catálogo - Más info */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-md">
          <button
            onClick={onScrollToProducts}
            className="w-full sm:w-auto flex-1 bg-accent hover:bg-accent-light active:scale-95 text-brand font-sans font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ArrowDown className="w-4 h-4" />
          </button>
          
          <button
            onClick={scrollToInfo}
            className="w-full sm:w-auto flex-1 bg-white/15 hover:bg-white/20 active:scale-95 text-white font-sans font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 border border-white/25 backdrop-blur-md transition-all cursor-pointer"
          >
            <span>Más Info</span>
            <ChevronDown className="w-4 h-4" />
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

