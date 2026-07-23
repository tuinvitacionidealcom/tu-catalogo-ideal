import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Componentes Landing Page
import Header from './components/main-web/Header';
import Hero from './components/main-web/Hero';
import HowItWorks from './components/main-web/HowItWorks';
import Services from './components/main-web/Services';
import Gallery from './components/main-web/Gallery';
import FAQ from './components/main-web/FAQ';
import Footer from './components/main-web/Footer';
import WhatsAppCTA from './components/main-web/WhatsAppCTA';

// Páginas
import ArmaTuCatalogoPage from './pages/ArmaTuCatalogoPage';
import NotFound from './pages/NotFound';

// Catálogo Birromi
import BirromiCatalogo from './catalogos/birromi/page/BirromiCatalogo';
import BirromiPanel from './catalogos/birromi/panel/BirromiPanel';

// Catálogo Perla Fit
import PerlaFitCatalogo from './catalogos/perla-fit/page/PerlaFitCatalogo';
import PerlaFitPanel from './catalogos/perla-fit/panel/PerlaFitPanel';

// HomePage: Landing principal
const HomePage = () => {
    return (
        <div className="min-h-screen bg-web-bg">
            <Header />
            <Hero />
            <HowItWorks />
            <Services />
            <Gallery />
            <FAQ />
            <Footer />
        </div>
    );
};

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const location = useLocation();
    // Ocultamos el botón flotante de la landing page si estamos en cualquier catálogo o panel comercial
    const isCatalogRoute = location.pathname.toLowerCase().startsWith('/mr-bebidas') ||
                           location.pathname.toLowerCase().startsWith('/perla-fit');

    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Landing principal */}
                <Route path="/" element={<HomePage />} />
                
                {/* Formulario Armá tu Catálogo */}
                <Route path="/arma-tu-catalogo" element={<ArmaTuCatalogoPage />} />
                
                {/* Rutas del Catálogo M.R Bebidas */}
                <Route path="/mr-bebidas" element={<BirromiCatalogo />} />
                <Route path="/mr-bebidas/panel" element={<BirromiPanel />} />
                
                {/* Rutas del Catálogo Perla Fit */}
                <Route path="/perla-fit" element={<PerlaFitCatalogo />} />
                <Route path="/perla-fit/panel" element={<PerlaFitPanel />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* CTA Flotante de WhatsApp general (solo para la landing page de ventas) */}
            {!isCatalogRoute && <WhatsAppCTA />}
        </>
    );
}

// Envolvemos el componente principal para que useLocation() funcione correctamente
export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}


