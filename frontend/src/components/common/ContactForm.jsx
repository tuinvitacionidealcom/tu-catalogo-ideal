import React, { useState } from 'react';
import { Send, User, Phone, MessageSquare, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useDialog } from '../ui/Dialog';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';

const formatWhatsAppNumber = (rawPhone) => {
  if (!rawPhone) return '';
  // Remover todo lo que no sea dígito
  let cleaned = rawPhone.replace(/\D/g, '');
  // Quitar ceros a la izquierda
  if (cleaned.startsWith('00')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
  
  if (!cleaned.startsWith('54')) {
    // Caso típico de Argentina: 11 15 1234 5678 (12 dígitos) -> sacamos el 15
    if (cleaned.length === 12 && cleaned.substring(2, 4) === '15') {
      cleaned = cleaned.slice(0, 2) + cleaned.slice(4);
    }
    if (cleaned.length === 10) {
      cleaned = '549' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('9')) {
      cleaned = '54' + cleaned;
    } else if (cleaned.length > 10) {
      if (cleaned.length === 12 && cleaned.substring(2, 4) === '15') {
        cleaned = cleaned.slice(0, 2) + cleaned.slice(4);
      } else if (cleaned.length === 13 && cleaned.substring(3, 5) === '15') {
        cleaned = cleaned.slice(0, 3) + cleaned.slice(5);
      } else if (cleaned.length === 14 && cleaned.substring(4, 6) === '15') {
        cleaned = cleaned.slice(0, 4) + cleaned.slice(6);
      }
      if (cleaned.length === 10) {
        cleaned = '549' + cleaned;
      }
    }
  } else {
    // Si ya empieza con 54, nos aseguramos de que tenga el 9 de celular y no tenga el 15
    if (cleaned.length === 12) {
      cleaned = '549' + cleaned.slice(2);
    }
    if (cleaned.length === 15 && cleaned.substring(3, 5) === '9' && cleaned.substring(5, 7) === '15') {
      cleaned = cleaned.slice(0, 5) + cleaned.slice(7);
    }
    if (cleaned.length === 14 && cleaned.substring(2, 5) === '915') {
      cleaned = cleaned.slice(0, 3) + cleaned.slice(5);
    }
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('9')) {
    cleaned = '54' + cleaned;
  }
  if (cleaned.length === 8) {
    cleaned = '54911' + cleaned; // Fallback para números locales de BsAs
  }
  return cleaned;
};

const ContactForm = ({ catalogId = 1, catalogName = 'Nuestros Servicios', imageUrl }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Consulta General');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dialog = useDialog();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      await dialog.error('Por favor completa tu nombre y el mensaje.');
      return;
    }

    setLoading(true);
    try {
      const formattedMessage = `[${type}] ${message}`;
      const cleanedPhone = formatWhatsAppNumber(phone.trim());
      const res = await fetch(`${API_BASE}/?request=contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog_id: catalogId,
          name: name.trim(),
          phone: cleanedPhone,
          message: formattedMessage,
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        await dialog.success('¡Consulta enviada con éxito! Nos pondremos en contacto a la brevedad.');
        setName('');
        setPhone('');
        setType('Consulta General');
        setMessage('');
      } else {
        throw new Error(data.error || 'Error al enviar la consulta');
      }
    } catch (err) {
      await dialog.error(err.message || 'No se pudo enviar la consulta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '650px',
      margin: '40px auto',
      background: '#ffffff',
      borderRadius: '28px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      border: '1px solid #f1f5f9',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Imagen decorativa superior */}
      {imageUrl && (
        <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={imageUrl}
            alt="Contacto"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
          }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>¿Tenés alguna duda o consulta?</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>Escribinos y te responderemos a la brevedad</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div style={{ padding: '32px 28px' }}>
        {!imageUrl && (
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Hacé tu Consulta</h3>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#64748b' }}>Envianos un mensaje directo al panel</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Nombre completo */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Nombre Completo *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '14px', outline: 'none', background: '#f8fafc',
                  color: '#0f172a', transition: 'all 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              WhatsApp / Teléfono
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ej: 11 1234 5678"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '14px', outline: 'none', background: '#f8fafc',
                  color: '#0f172a', transition: 'all 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          </div>

          {/* Tipo de Consulta */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tipo de Consulta
            </label>
            <div style={{ position: 'relative' }}>
              <HelpCircle size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '14px', outline: 'none', background: '#f8fafc',
                  color: '#0f172a', transition: 'all 0.2s', cursor: 'pointer'
                }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              >
                <option value="Consulta General">Consulta General</option>
                <option value="Presupuesto">Solicitar Presupuesto</option>
                <option value="Envío / Stock">Envíos y Stock</option>
                <option value="Otro">Otro Asunto</option>
              </select>
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mensaje / Detalle *
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribí aquí tu mensaje..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '14px', outline: 'none', background: '#f8fafc',
                  color: '#0f172a', transition: 'all 0.2s', resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
          </div>

          {/* CTA Enviar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '6px',
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Enviando...</>
            ) : (
              <><Send size={16} /> Enviar Consulta</>
            )}
          </button>
        </form>
      </div>
      <dialog.DialogUI />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ContactForm;
