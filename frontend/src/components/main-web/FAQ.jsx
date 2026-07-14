import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        question: '¿Qué es un catálogo digital?',
        answer: 'Es una página web one-page diseñada exclusivamente para tu negocio, donde mostrás tus productos o servicios de forma profesional. Tus clientes acceden desde un link y ven todo tu catálogo desde el celular.'
    },
    {
        question: '¿Cuánto tiempo tardan en entregarlo?',
        answer: 'Una vez que recibimos toda la información y material (fotos, textos, precios), tu catálogo está listo en 24 a 48 horas hábiles.'
    },
    {
        question: '¿Puedo actualizar los productos después?',
        answer: '¡Sí! Podés solicitar actualizaciones de productos, precios y fotos cuando lo necesites. También tenés acceso a un panel privado para gestionar tu catálogo.'
    },
    {
        question: '¿Necesito un dominio propio?',
        answer: 'No es necesario. Tu catálogo se aloja en tucatalogoideal.com/tu-negocio. Si querés usar tu propio dominio, también lo configuramos sin problema.'
    },
    {
        question: '¿Funciona en celulares?',
        answer: 'Absolutamente. Todos los catálogos están diseñados Mobile First, optimizados para verse perfecto en celulares, tablets y computadoras.'
    },
    {
        question: '¿Cómo lo comparto con mis clientes?',
        answer: 'Recibís un link único (ej: tucatalogoideal.com/tu-negocio) que podés compartir por WhatsApp, Instagram, Facebook, tarjetas de presentación, o donde quieras.'
    },
    {
        question: '¿Tiene botón de WhatsApp?',
        answer: 'Sí, todos los catálogos incluyen un botón flotante de WhatsApp para que tus clientes te contacten directamente con un solo toque.'
    },
    {
        question: '¿Cuánto cuesta?',
        answer: 'Los precios varían según las secciones y funcionalidades que elijas. Completá el formulario "Armá tu Catálogo" y te enviamos un presupuesto detallado por WhatsApp sin compromiso.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="relative py-24 md:py-32 px-6 bg-web-bg overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-accent mb-4">FAQ</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-brand leading-tight mb-6">
                        Preguntas frecuentes
                    </h2>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqData.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                                    openIndex === i 
                                        ? 'bg-white shadow-lg shadow-accent/5 border border-accent/20' 
                                        : 'bg-white border border-web-border/50 hover:border-accent/20 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-sans font-bold pr-4 transition-colors ${
                                        openIndex === i ? 'text-brand' : 'text-brand/80'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === i ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-colors ${
                                            openIndex === i ? 'text-accent' : 'text-web-text-muted'
                                        }`} />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-sm font-sans text-web-text-muted leading-relaxed mt-3 pt-3 border-t border-web-border/30">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
