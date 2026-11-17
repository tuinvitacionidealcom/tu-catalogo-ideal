import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = ({ faqs = [] }) => {
  if (!faqs || faqs.length === 0) return null;

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold text-brand uppercase tracking-widest block mb-1">
            Resolvemos tus dudas
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            Preguntas Frecuentes
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-2 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

