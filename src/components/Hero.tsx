'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 18, mass: 0.8 },
  },
};

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

function AnimatedWords({ text, gold = false }: { text: string; gold?: boolean }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: i < words.length - 1 ? '0.28em' : 0 }}>
          <motion.span variants={wordVariants} style={{ display: 'inline-block', color: gold ? '#28B44A' : '#F0F0F0' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session?.user));
  }, []);

  return (
    <section id="inicio" ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100dvh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Parallax image */}
      <motion.div style={{ position: 'absolute', inset: '-20% 0', zIndex: 0, y: imageY }}>
        <Image
          src="/hero-bg.jpg"
          alt="L.N. Bryan Yaudiel Gil Tlatempa — Nutriólogo y Entrenador"
          fill priority
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay */}
      <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Content */}
      <div className="container-gnh" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EXPO_OUT }}
          className="eyebrow"
          style={{ marginBottom: '32px' }}
        >
          Tixtla de Guerrero, México · Nutrición &amp; Entrenamiento
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={titleContainer} initial="hidden" animate="show"
          className="hero-headline"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '28px' }}
        >
          <AnimatedWords text="Good Nutrition" />
          <br />
          <AnimatedWords text="Habits." gold />
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EXPO_OUT }}
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '15px', fontWeight: 300, color: 'rgba(240,240,240,0.70)', letterSpacing: '0.04em', marginBottom: '52px', maxWidth: '460px', lineHeight: 1.75 }}
        >
          L.N. Bryan Yaudiel Gil Tlatempa — Consultas personalizadas y entrenamiento presencial
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: EXPO_OUT }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-reservar'))}
            className="hero-btn-gold"
          >
            {loggedIn ? 'Agendar cita' : 'Regístrate y reserva'}
          </button>
          <button onClick={() => document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' })} className="hero-btn-ghost">
            Ver servicios
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
      >
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '44px', background: 'linear-gradient(to bottom, rgba(40,180,74,0.55), transparent)' }}
        />
      </motion.div>

      <style>{`
        .hero-headline { font-size: 38px; color: #F0F0F0; }
        @media (min-width: 400px) { .hero-headline { font-size: 48px; } }
        @media (min-width: 640px) { .hero-headline { font-size: 68px; } }
        @media (min-width: 1024px) { .hero-headline { font-size: 92px; } }

        .hero-btn-gold {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #F0F0F0; background-color: #F07820; border: 1px solid #F07820;
          padding: 14px 32px; text-decoration: none; display: inline-block;
          transition: all 0.45s ease; cursor: pointer;
        }
        .hero-btn-gold:hover { background-color: #FF8C35; border-color: #FF8C35; }

        .hero-btn-ghost {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #F0F0F0; background: transparent; border: 1px solid rgba(240,240,240,0.4);
          padding: 14px 32px; cursor: pointer; transition: all 0.45s ease;
        }
        .hero-btn-ghost:hover { background-color: #F0F0F0; color: #080808; border-color: #F0F0F0; }
      `}</style>
    </section>
  );
}
