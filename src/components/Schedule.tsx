'use client';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const slots = ['6:00 – 7:00 am', '7:00 – 8:00 am', '8:00 – 9:00 am', '9:00 – 10:00 am', '10:00 – 11:00 am', '4:00 – 5:00 pm', '5:00 – 6:00 pm'];

export default function Schedule() {
  return (
    <section id="horarios" style={{ backgroundColor: '#090C08', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container-gnh">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: EXPO_OUT }} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="eyebrow" style={{ marginBottom: '20px', display: 'block' }}>Disponibilidad</p>
          <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: EXPO_OUT }} viewport={{ once: true }}
            style={{ display: 'block', width: '48px', height: '1px', backgroundColor: '#F07820', transformOrigin: 'center', margin: '0 auto 24px' }} />
          <h2 className="section-heading" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: '#F0F0F0', lineHeight: 1.1 }}>
            Horarios de <span style={{ color: '#28B44A' }}>Entrenamiento</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 300, color: 'rgba(240,240,240,0.55)', marginTop: '16px', lineHeight: 1.75 }}>
            Sesiones presenciales de lunes a viernes. Elige el turno que se adapte a tu día.
          </p>
        </motion.div>

        {/* Desktop table */}
        <div className="schedule-desktop">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.4)', borderBottom: '1px solid #1A2418', width: '160px', fontWeight: 400 }}>Horario</th>
                {days.map((d) => (
                  <th key={d} style={{ padding: '16px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F0F0F0', borderBottom: '1px solid #1A2418', fontWeight: 600 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => (
                <motion.tr key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07, ease: EXPO_OUT }}
                  style={{ borderBottom: '1px solid rgba(42,21,21,0.6)', transition: 'background-color 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(40,180,74,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '16px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.55)', fontWeight: 300, letterSpacing: '0.03em' }}>{slot}</td>
                  {days.map((d) => (
                    <td key={d} style={{ padding: '16px', textAlign: 'center' }}>
                      <CheckCircle size={16} color="rgba(240,120,32,0.7)" style={{ display: 'inline-block' }} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="schedule-mobile">
          {slots.map((slot, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07, ease: EXPO_OUT }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0F1208', border: '1px solid #1A2418', padding: '16px 20px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#F0F0F0', fontWeight: 300 }}>{slot}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F07820' }}>Lun – Vie</span>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.40)', textAlign: 'center', marginTop: '40px', lineHeight: 1.6 }}>
          * Los cupos son limitados. Confirma tu asistencia cada <span style={{ color: '#F07820' }}>domingo</span> para la semana.
        </motion.p>
      </div>

      <style>{`
        .section-heading { font-size: 36px; }
        @media (min-width: 768px) { .section-heading { font-size: 48px; } }
        .schedule-desktop { display: none; }
        .schedule-mobile { display: block; }
        @media (min-width: 768px) { .schedule-desktop { display: block; } .schedule-mobile { display: none; } }
      `}</style>
    </section>
  );
}
