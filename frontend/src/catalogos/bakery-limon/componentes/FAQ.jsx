import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo realizo mi pedido?",
      answer: "Podés hacer tu pedido con anticipación o consultar disponibilidad según el stock del día a través del catálogo o por WhatsApp."
    },
    {
      question: "¿Cómo se confirma el pedido?",
      answer: "Tu pedido quedará confirmado una vez abonado el 50% del total. Tené en cuenta que una vez confirmado no se aceptan cambios ni cancelaciones."
    },
    {
      question: "¿Cuáles son las condiciones de Delivery y Envíos?",
      answer: "En Villa Bosch y alrededores el envío es sin cargo. Si tu dirección está fuera de este radio, consultanos el costo del envío antes de confirmar tu pedido."
    },
    {
      question: "¿Puedo hacer reservas de medialunas para el fin de semana?",
      answer: "¡Sí! Ya podés reservar tus medialunas para el fin de semana. Te recomendamos hacerlo con anticipación para asegurar disponibilidad."
    },
    {
      question: "¿Cuáles son los medios de pago aceptados?",
      answer: "Contamos con pago por transferencia bancaria y en efectivo."
    },
    {
      question: "¿Cuáles son los horarios de atención?",
      answer: "Lunes a Viernes de 8:30 a 19:00 hs. Sábados y Domingos de 8:00 a 19:30 hs."
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
