import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cuáles son las zonas de entrega y los tiempos de envío?",
      answer: "Realizamos envíos propios en las zonas de San Martín y Tres de Febrero. Al realizar tu pedido por WhatsApp coordinamos el día y horario que mejor te convenga, habitualmente dentro de las 24 a 48 hs hábiles."
    },
    {
      question: "¿Hay un mínimo de compra para los envíos?",
      answer: "No tenemos un mínimo estricto, pero te recomendamos comprar por packs de 3 o 6 unidades (clásicas o IPAs) para aprovechar las promociones especiales y optimizar el costo de entrega."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos efectivo al recibir el pedido, transferencias bancarias directas, Mercado Pago (dinero en cuenta o QR) y tarjetas de débito/crédito."
    },
    {
      question: "¿Cómo funciona el alquiler de choperas para eventos?",
      answer: "Ofrecemos alquiler de choperas con barriles listos para conectar y equipamiento profesional de frío. La instalación y el retiro en el lugar del evento están incluidos. Te recomendamos reservar con al menos una semana de anticipación vía WhatsApp."
    },
    {
      question: "¿Tienen precios especiales para bares, comercios o compras mayoristas?",
      answer: "Sí, somos distribuidores oficiales de cervezas artesanales Ludus. Ofrecemos listas de precios especiales y distribución directa para comercios, revendedores y compras de gran volumen. Escribinos para que te enviemos la cotización mayorista."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white px-6 py-8 border-t border-slate-100">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-accent shrink-0" />
          <h4 className="font-serif font-black text-lg text-brand uppercase tracking-wider">
            Preguntas Frecuentes
          </h4>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-accent bg-web-bg-warm/30 shadow-xs' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="font-sans font-bold text-xs sm:text-sm text-brand leading-snug">
                    {faq.question}
                  </span>
                  <span className={`p-1 rounded-full bg-slate-100 text-brand shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-accent/20 text-accent-dark' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-slate-100/50' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 py-4 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed bg-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
