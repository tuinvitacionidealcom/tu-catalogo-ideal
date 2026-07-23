import React from 'react';
import logoImg from './logo.jpeg';
import { Instagram, Phone } from 'lucide-react';

const PerlaFit = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        borderRadius: '50%'
      }} />

      {/* Header / Brand */}
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <p style={{
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontSize: '12px',
          color: '#888888',
          fontWeight: 600,
          margin: 0
        }}>
          Catálogo Digital
        </p>
      </div>

      {/* Hero Central */}
      <div style={{
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {/* Logo container */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backgroundColor: '#000000'
        }}>
          <img 
            src={logoImg} 
            alt="Perla Fit Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: 900,
          letterSpacing: '6px',
          margin: '0 0 8px 0',
          color: '#ffffff',
          textTransform: 'uppercase'
        }}>
          PERLA FIT
        </h1>

        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '6px 16px',
          marginTop: '12px'
        }}>
          <p style={{
            fontSize: '13px',
            letterSpacing: '2px',
            color: '#cccccc',
            margin: 0,
            fontWeight: 500,
            textTransform: 'uppercase'
          }}>
            Próximamente
          </p>
        </div>
      </div>

      {/* Footer / Social links */}
      <div style={{
        zIndex: 10,
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <a 
          href="https://wa.me/5491139246425" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#888888',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#888888'}
        >
          <Phone size={16} /> Contacto
        </a>
      </div>
    </div>
  );
};

export default PerlaFit;
