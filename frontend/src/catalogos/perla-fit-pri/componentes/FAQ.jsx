import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "¿De qué material son las prendas?",
      answer: "Trabajamos con telas de alta calidad, seamless (sin costuras) y con tecnología push up para mayor comodidad al entrenar."
    },
    {
      question: "¿Con cuánta anticipación debo reservar?",
      answer: "Recomendamos reservar con al menos 15 o 20 días de anticipación para asegurar la fecha y tener tiempo de diseñar todos los detalles personalizados."
    },
    {
      question: "¿Hacen envíos a todo el país?",
      answer: "Sí, realizamos envíos a todo el país a través de correo. El costo de envío se coordina por WhatsApp."
    },
    {
      question: "¿Tienen tabla de talles?",
      answer: "Sí, podés consultarnos por tu talle o ver nuestra tabla de talles en las historias destacadas de Instagram."
    },
    {
      question: "¿En qué zonas trabajan?",
      answer: "Nos encontramos en CABA, pero enviamos indumentaria a todo el país. Consultanos cualquier duda."
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
          <p className="text-web-text-muted font-sans font-medium">Todo lo que necesitás saber sobre nuestras prendas</p>
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
