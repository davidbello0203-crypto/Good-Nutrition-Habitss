'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Dumbbell, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    icon: CalendarCheck,
    title: 'Consulta de Nutrición',
    desc: 'Evaluación nutricional completa y plan alimenticio 100% personalizado según tus objetivos y estilo de vida real.',
    tag: 'Presencial',
    details: ['Plan alimenticio personalizado', 'Seguimiento continuo', 'Basado en ciencia nutricional'],
    featured: false,
  },
  {
    icon: Sparkles,
    title: 'Nutrición + Entrenamiento',
    desc: 'La combinación más completa. Un enfoque integral que transforma tu cuerpo y salud desde adentro hacia afuera.',
    tag: 'Más popular',
    details: ['Plan nutricional + entrenamientos', 'Resultados más rápidos', 'Seguimiento 360°'],
    featured: true,
  },
  {
    icon: Dumbbell,
    title: 'Entrenamiento Presencial',
    desc: 'Sesiones de entrenamiento físico de lunes a viernes. Cupo limitado para garantizar atención individualizada.',
    tag: 'Lun – Vie',
    details: ['Horarios: 6:00 am – 6:00 pm', 'Cupo limitado', 'Asesoría técnica en cada sesión'],
    featured: false,
  },
];

export default function Services() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => setLoggedIn(!!user));
  }, []);

  return (
    <section id="servicios" style={{ backgroundColor: '#090C08', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container-gnh">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EXPO_OUT }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <p className="eyebrow" style={{ marginBottom: '20px', display: 'block' }}>Lo que ofrezco</p>
          <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: EXPO_OUT }} viewport={{ once: true }}
            style={{ display: 'block', width: '48px', height: '1px', backgroundColor: '#F07820', transformOrigin: 'center', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.01em' }} className="section-heading">
            Servicios <span style={{ color: '#28B44A' }}>especializados</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 300, color: 'rgba(240,240,240,0.55)', marginTop: '16px', maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.75 }}>
            Cada programa está diseñado para maximizar tus resultados con un enfoque profesional y completamente personalizado.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="services-grid">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EXPO_OUT }}
                style={{
                  backgroundColor: s.featured ? '#0D1A0D' : '#0F1208',
                  border: `1px solid ${s.featured ? 'rgba(40,180,74,0.4)' : '#1A2418'}`,
                  padding: '36px 28px',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                  transition: 'border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = s.featured ? 'rgba(40,180,74,0.7)' : 'rgba(40,180,74,0.4)';
                  el.style.transform = 'translateY(-6px)';
                  el.style.boxShadow = `0 24px 60px ${s.featured ? 'rgba(40,180,74,0.14)' : 'rgba(40,180,74,0.08)'}`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = s.featured ? 'rgba(40,180,74,0.4)' : '#1A2418';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {s.featured && (
                  <div style={{ position: 'absolute', top: '-1px', left: '28px', backgroundColor: '#28B44A', padding: '4px 12px' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#080808', fontWeight: 700 }}>Más popular</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: s.featured ? '14px' : 0 }}>
                  <div style={{ width: '44px', height: '44px', backgroundColor: s.featured ? 'rgba(40,180,74,0.1)' : 'rgba(240,120,32,0.08)', border: `1px solid ${s.featured ? 'rgba(40,180,74,0.25)' : 'rgba(240,120,32,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={s.featured ? '#28B44A' : '#F07820'} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: s.featured ? '#28B44A' : '#F07820', border: `1px solid ${s.featured ? 'rgba(40,180,74,0.3)' : 'rgba(240,120,32,0.3)'}`, padding: '4px 8px' }}>
                    {s.tag}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 600, color: '#F0F0F0', marginBottom: '10px', letterSpacing: '0.01em' }}>{s.title}</h3>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(240,240,240,0.55)', lineHeight: 1.75 }}>{s.desc}</p>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {s.details.map((d) => (
                    <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.5)' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: s.featured ? '#28B44A' : '#F07820', flexShrink: 0 }} />
                      {d}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: `1px solid ${s.featured ? 'rgba(40,180,74,0.15)' : '#1A2418'}` }}>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-reservar'))}
                    style={{
                      width: '100%', padding: '12px 16px', cursor: 'pointer',
                      backgroundColor: s.featured ? '#28B44A' : 'transparent',
                      border: `1px solid ${s.featured ? '#28B44A' : 'rgba(240,120,32,0.4)'}`,
                      color: s.featured ? '#080808' : '#F07820',
                      fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                      fontWeight: s.featured ? 700 : 400,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (s.featured) { e.currentTarget.style.backgroundColor = '#32D458'; e.currentTarget.style.borderColor = '#32D458'; }
                      else { e.currentTarget.style.backgroundColor = 'rgba(240,120,32,0.1)'; e.currentTarget.style.borderColor = '#F07820'; }
                    }}
                    onMouseLeave={(e) => {
                      if (s.featured) { e.currentTarget.style.backgroundColor = '#28B44A'; e.currentTarget.style.borderColor = '#28B44A'; }
                      else { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(240,120,32,0.4)'; }
                    }}
                  >
                    {loggedIn ? 'Agendar cita →' : 'Regístrate y reserva →'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .section-heading { font-size: 36px; }
        @media (min-width: 768px) { .section-heading { font-size: 48px; } }
        .services-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .services-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .services-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </section>
  );
}
