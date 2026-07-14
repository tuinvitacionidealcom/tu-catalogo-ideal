import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-web-bg flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* 404 number */}
                <div className="relative mb-8">
                    <span className="text-[120px] sm:text-[180px] font-serif font-bold text-brand/5 leading-none select-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-xl shadow-accent/30 animate-float">
                            <span className="text-3xl">🔍</span>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-medium text-brand mb-4">
                    Página no encontrada
                </h1>
                <p className="text-sm font-sans text-web-text-muted mb-10 leading-relaxed">
                    El catálogo que buscás no existe o fue removido. Verificá el link e intentá de nuevo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href="/"
                        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand to-brand-light text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Ir al Inicio</span>
                    </a>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-6 py-3.5 bg-white text-brand border border-web-border rounded-xl text-[10px] font-sans font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Volver Atrás</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
