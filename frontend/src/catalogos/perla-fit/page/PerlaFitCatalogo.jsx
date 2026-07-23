import React, { useEffect } from 'react';

const PerlaFitCatalogo = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: 900,
        letterSpacing: '8px',
        margin: '0 0 16px 0',
        color: '#ffffff',
        textTransform: 'uppercase'
      }}>
        PERLA FIT
      </h1>
      <p style={{
        fontSize: '18px',
        fontWeight: 500,
        letterSpacing: '4px',
        color: '#888888',
        margin: 0,
        textTransform: 'uppercase'
      }}>
        Próximamente
      </p>
    </div>
  );
};

export default PerlaFitCatalogo;
