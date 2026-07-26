import React, { useState, useEffect, useRef } from 'react';
import { Truck, Clock, CreditCard, ShoppingBag } from 'lucide-react';

const ServiciosSeccion = () => {
  const servicios = [
    {
      icon: <Clock className="w-6 h-6 text-accent" />,
      title: "Pedidos & Stock",
      description: "Hacé tu pedido con anticipación o consultá disponibilidad según el stock del día."
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-accent" />,
      title: "Seña del 50%",
      description: "Tu pedido quedará confirmado una vez abonado el 50% del total."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-accent" />,
      title: "Medios de pago",
      description: "Contamos con pago por transferencia bancaria y en efectivo."
    },
    {
      icon: <Truck className="w-6 h-6 text-accent" />,
      title: "Delivery Villa Bosch",
      description: "En Villa Bosch y alrededores, el envío es sin cargo. Consultá el costo para otras zonas."
    }
  ];

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
      if (!isCooldown.current) {
        const nextIndex = (currentIndex + 1) % servicios.length;
        changeSlide(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, servicios.length]);

  const triggerCooldown = () => {
    isCooldown.current = true;
    clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      isCooldown.current = false;
    }, 5000);
  };

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

    if (isLeftSwipe) {
      const nextIndex = (currentIndex + 1) % servicios.length;
      changeSlide(nextIndex);
      triggerCooldown();
    } else if (isRightSwipe) {
      const nextIndex = (currentIndex - 1 + servicios.length) % servicios.length;
      changeSlide(nextIndex);
      triggerCooldown();
    }
  };

  return (
    <div className="bg-brand text-white border-y border-white/5 py-8 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div 
        className="max-w-md mx-auto relative touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-28 flex flex-col justify-center items-center">
          <div className={`flex items-center justify-center gap-4 transition-all duration-300 ease-out transform ${
            isAnimating 
              ? 'opacity-0 scale-95 -translate-x-4' 
              : 'opacity-100 scale-100 translate-x-0'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-accent flex items-center justify-center shadow-lg shrink-0">
              {servicios[currentIndex].icon}
            </div>
            <div className="text-left min-w-0">
              <h5 className="font-sans font-black text-sm text-accent uppercase tracking-widest leading-none">
                {servicios[currentIndex].title}
              </h5>
              <p className="font-sans text-xs text-slate-200 font-bold leading-normal mt-1.5 max-w-[265px]">
                {servicios[currentIndex].description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {servicios.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== currentIndex) {
                  changeSlide(idx);
                  triggerCooldown();
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                idx === currentIndex ? 'w-5 bg-accent' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiciosSeccion;
