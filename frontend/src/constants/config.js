// WhatsApp de Tu Catálogo Ideal
export const WHATSAPP_NUMBER = '5491164000000'; // CAMBIAR por tu número real
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Me interesa crear mi catálogo digital profesional 🚀')}`;

// API Backend
export const API_URL = import.meta.env.DEV ? '/backend' : '/backend';

// Redes sociales
export const SOCIAL = {
    instagram: 'https://www.instagram.com/tucatalogoideal',
    whatsapp: WHATSAPP_LINK
};
