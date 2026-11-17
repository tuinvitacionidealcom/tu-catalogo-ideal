import React, { useState, useEffect, useRef } from 'react';
import { Star, Coffee, Sparkles, CreditCard, Truck, Shield, Clock, Heart, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Star,
  Coffee,
  Sparkles,
  CreditCard,
  Truck,
  Shield,
  Clock,
  Heart,
  CheckCircle2
};

const ServiciosSeccion = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const isCooldown = useRef(false);
  const cooldownTimer = useRef(null);

  const minSwipeDistance = 50;

  const changeSlide = (nextIndex) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCooldown.current && features.length > 1) {
        const nextIndex = (currentIndex + 1) % features.length;
        changeSlide(nextIndex);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [currentIndex, features.length]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      isCooldown.current = true;
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => {
        isCooldown.current = false;
      }, 5000);

      if (isLeftSwipe) {
        const nextIndex = (currentIndex + 1) % features.length;
        changeSlide(nextIndex);
      } else if (isRightSwipe) {
        const nextIndex = (currentIndex - 1 + features.length) % features.length;
        changeSlide(nextIndex);
      }
    }
  };

  const getIcon = (iconName) => {
    const Comp = iconMap[iconName] || Sparkles;
    return <Comp className="w-6 h-6 text-brand" />;
  };

  const currentFeature = features[currentIndex];

  return (
    <section className="bg-slate-50 border-y border-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile View: Carousel */}
        <div 
          className="md:hidden relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="min-h-[120px] flex items-center justify-center">
            <div 
              className={`flex flex-col items-center text-center p-4 transition-all duration-300 ease-in-out transform ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 mb-2">
                {getIcon(currentFeature.icon)}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{currentFeature.title}</h4>
              <p className="text-xs text-slate-500 max-w-xs">{currentFeature.description}</p>
            </div>
          </div>

          {/* Dots Indicator */}
          {features.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    isCooldown.current = true;
                    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
                    cooldownTimer.current = setTimeout(() => { isCooldown.current = false; }, 5000);
                    changeSlide(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'w-4 bg-brand' : 'w-1.5 bg-slate-300'
                  }`}
                  aria-label={`Ir al beneficio ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {features.map((servicio, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-xs transition-all duration-300 border border-transparent hover:border-slate-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                {getIcon(servicio.icon)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-0.5">{servicio.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{servicio.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiciosSeccion;
