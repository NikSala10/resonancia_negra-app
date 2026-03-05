import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: "url('/assets/Pantalla de carga - Portada.png')", // pon tu imagen en public
      backgroundRepeat: 'no-repeat',   // 🔥 evita que se repita
      backgroundSize: 'contain',         // 🔥 ocupa toda la pantalla
      backgroundPosition: 'center',    // 🔥 centra la imagen
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Alumni Sans, sans-serif'
    }}>
      {/* Partículas de fondo */}
      <div style={{ position: 'absolute', top: '5rem', left: '2.5rem', width: '8px', height: '8px', backgroundColor: '#11A1AB', borderRadius: '50%', opacity: 0.1 }} />
      <div style={{ position: 'absolute', top: '10rem', right: '5rem', width: '4px', height: '4px', backgroundColor: '#B89726', borderRadius: '50%', opacity: 0.1 }} />
      <div style={{ position: 'absolute', bottom: '8rem', left: '25%', width: '6px', height: '6px', backgroundColor: '#11A1AB', borderRadius: '50%', opacity: 0.1 }} />
      <div style={{ position: 'absolute', bottom: '5rem', right: '33%', width: '8px', height: '8px', backgroundColor: '#B89726', borderRadius: '50%', opacity: 0.1 }} />

      {/* Logo/Título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}
      >
      
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            height: '4px',
            background: 'linear-gradient(to right, transparent, #B89726, transparent)',
            marginTop: '1.5rem'
          }}
        />
      </motion.div>

      {/* Contenedor barra + texto */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1 }}
  style={{
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '-12rem',
    zIndex: 10
  }}
>
  {/* Texto */}
  <p
    style={{
      color: '#B1B1B1',
      fontSize: '32px',
      fontFamily: "Mansalva, sans-serif",
      marginBottom: '-0.5rem',
    }}
  >
    Cargando recursos...
  </p>

  {/* Barra */}
  <div
    style={{
      width: '80%',
      height: '12px',
      background: 'rgba(0,0,0,0.55)',
      borderRadius: '50px',
      backdropFilter: 'blur(6px)',
      overflow: 'hidden',
      boxShadow: 'none',
      position: 'relative'
    }}
  >
    <motion.div
  initial={{ width: '0%' }}
  animate={{ width: '100%' }}
  transition={{ duration: 4.5, ease: 'easeInOut' }}
  style={{
    height: '100%',
    borderRadius: '50px',
    background: 'linear-gradient(90deg, #F5DC3F, #FFF3A0)',
    boxShadow: `
      0 0 8px rgba(245,220,63,0.8),
      0 0 20px rgba(245,220,63,0.6),
      0 0 40px rgba(245,220,63,0.4)
    `
  }}
/>
  </div>
</motion.div>

      {/* Texto adicional */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          color: '#FCFFBA',
          opacity: 0.6,
          fontSize: '19px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginTop: '0.5rem',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        Sistema Táctico Narrativo • Post-Apocalíptico
      </motion.p>
       {/* Partículas decorativas */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#F5DC3F] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
    </div>
    
  );
}