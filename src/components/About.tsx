'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [shouldStart, setShouldStart] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setShouldStart(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldStart) return;
    const animate = (ts: number) => {
      if (startTimeRef.current === null) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) { rafRef.current = requestAnimationFrame(animate); } else { setCount(target); }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [shouldStart, target, duration]);

  return { count, containerRef };
}

function StatItem({ value, label, index }: { value: string; label: string; index: number }) {
  const numMatch = value.match(/^([+\-]?)(\d+)([^\d]*)$/);
  const isNumeric = numMatch !== null;
  const numericTarget = isNumeric ? parseInt(numMatch![2], 10) : 0;
  const prefix = isNumeric ? numMatch![1] : '';
  const suffix = isNumeric ? numMatch![3] : '';
  const { count, containerRef } = useCountUp(numericTarget, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 + index * 0.1, ease: EXPO_OUT }}
      viewport={{ once: true }}
    >
      <span ref={containerRef} style={{ display: 'block', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#F07820', lineHeight: 1.1, marginBottom: '4px' }}>
        {isNumeric ? `${prefix}${count}${suffix}` : value}
      </span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.45)', fontWeight: 400 }}>
        {label}
      </span>
    </motion.div>
  );
}

const STATS = [
  { value: '+100', label: 'Clientes atendidos' },
  { value: '5', label: 'Días por semana' },
  { value: '12', label: 'Horas disponibles' },
];

export default function About() {
  return (
    <section id="sobre-mi" style={{ backgroundColor: '#080808', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container-gnh about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '64px', alignItems: 'center' }}>

        {/* Text column */}
        <div style={{ order: 1 }} className="about-text">
          <motion.p {...{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } }}
            transition={{ duration: 0.8, ease: EXPO_OUT }} className="eyebrow" style={{ marginBottom: '20px', display: 'block' }}>
            Sobre mí
          </motion.p>

          <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: EXPO_OUT }} viewport={{ once: true }}
            style={{ display: 'block', width: '48px', height: '1px', backgroundColor: '#F07820', transformOrigin: 'left center', marginBottom: '24px' }} />

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.15 }}
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '28px' }}
            className="about-heading">
            L.N. Bryan Yaudiel
            <br />
            <span style={{ color: '#28B44A' }}>Gil Tlatempa</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: EXPO_OUT }}
            style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 300, color: 'rgba(240,240,240,0.60)', lineHeight: 1.85, marginBottom: '16px', maxWidth: '520px' }}>
            Licenciado en Nutrición comprometido con tu transformación. Mi misión es ayudarte a desarrollar hábitos alimenticios saludables que se adapten a tu estilo de vida real.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.32, ease: EXPO_OUT }}
            style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 300, color: 'rgba(240,240,240,0.60)', lineHeight: 1.85, marginBottom: '48px', maxWidth: '520px' }}>
            Combino ciencia nutricional con entrenamiento físico presencial en <span style={{ color: '#28B44A' }}>Tixtla de Guerrero</span> — de lunes a viernes, desde las 6am hasta las 6pm.
          </motion.p>

          {/* Stats con count-up */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EXPO_OUT }} viewport={{ once: true, margin: '-60px' }}
            className="about-stats"
            style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', paddingTop: '32px', borderTop: '1px solid rgba(40,180,74,0.15)' }}>
            {STATS.map((s, i) => <StatItem key={s.label} value={s.value} label={s.label} index={i} />)}
          </motion.div>
        </div>

        {/* Image column */}
        <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EXPO_OUT }} viewport={{ once: true, margin: '-60px' }}
          style={{ position: 'relative', order: 2 }} className="about-image">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
            <Image
              src="/bryan.jpg"
              alt="L.N. Bryan Yaudiel Gil Tlatempa — Nutriólogo y Entrenador"
              fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          {/* Badge */}
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', backgroundColor: '#F07820', padding: '20px 24px' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.7)', marginBottom: '4px' }}>Tixtla, Guerrero</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '15px', color: '#080808', fontWeight: 700, lineHeight: 1.3 }}>Nutriólogo<br />Certificado</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        .about-heading { font-size: 32px; }
        @media (min-width: 480px) { .about-heading { font-size: 36px; } }
        @media (min-width: 768px) { .about-heading { font-size: 48px; } }
        @media (min-width: 1024px) {
          div.about-grid { grid-template-columns: 3fr 2fr !important; }
          .about-text { order: 1 !important; }
          .about-image { order: 2 !important; }
        }
        @media (max-width: 480px) {
          .about-stats { gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
