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
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Landing principal */}
                <Route path="/" element={<HomePage />} />
                
                {/* Formulario Armá tu Catálogo */}
                <Route path="/arma-tu-catalogo" element={<ArmaTuCatalogoPage />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* CTA Flotante de WhatsApp */}
            <WhatsAppCTA />
        </Router>
    );
}

export default App;

