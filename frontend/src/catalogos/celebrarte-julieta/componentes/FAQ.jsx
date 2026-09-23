import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "¿Qué incluye el servicio de ambientación?",
      answer: "Diseñamos la decoración integral de tu evento: centros de mesa, fondos fotográficos, iluminación decorativa y detalles personalizados según la temática elegida."
    },
    {
      question: "¿Con cuánta anticipación debo reservar?",
      answer: "Recomendamos reservar con al menos 15 o 20 días de anticipación para asegurar la fecha y tener tiempo de diseñar todos los detalles personalizados."
    },
    {
      question: "¿De qué se trata la Fiesta del Té?",
      answer: "Es un servicio completo donde llevamos toda la vajilla (tazas, platos, teteras), decoración de la mesa y detalles especiales para que disfrutes de una tarde de té inolvidable."
    },
    {
      question: "¿Qué incluye el Glitter Bar?",
      answer: "Armamos un stand súper brillante con maquilladoras. Incluye glitters de diferentes tamaños, gemas, strass y maquillaje artístico para que todos los invitados se lookeen."
    },
    {
      question: "¿En qué zonas trabajan?",
      answer: "Trabajamos principalmente en Ciudad Autónoma de Buenos Aires (CABA). Por otras zonas, consultanos por WhatsApp indicando el lugar del evento."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 md:py-24 bg-web-bg-warm relative" id="faq">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-web-border to-transparent" />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 rotate-3">
            <HelpCircle className="w-6 h-6 text-brand" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-web-dark mb-4">Preguntas Frecuentes</h2>
          <p className="text-web-text-muted font-sans font-medium">Todo lo que necesitás saber sobre mis servicios</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-brand/30 shadow-md' : 'border-web-border hover:border-brand/20 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-sans font-bold pr-4 transition-colors ${
                    isOpen ? 'text-brand' : 'text-web-dark'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-brand text-white' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-web-text-muted font-sans text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
