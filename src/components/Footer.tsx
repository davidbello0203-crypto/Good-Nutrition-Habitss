'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ backgroundColor: '#080808', borderTop: '1px solid rgba(40,180,74,0.15)' }}>
      <div className="container-gnh" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EXPO_OUT }} className="footer-grid" style={{ display: 'grid', gap: '48px', marginBottom: '64px' }}>
          {/* Brand */}
          <div>
            <Image src="/logo-gnh.png" alt="Good Nutrition Habits" width={140} height={56} style={{ objectFit: 'contain', height: '56px', width: 'auto', marginBottom: '16px' }} />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(240,240,240,0.45)', lineHeight: 1.75, maxWidth: '260px' }}>
              Nutrición y entrenamiento profesional para transformar tu vida con hábitos saludables duraderos.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F0F0F0', fontWeight: 600, marginBottom: '24px' }}>Contacto</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { href: 'https://wa.me/527451105266', icon: MessageCircle, label: '745 110 5266' },
                { href: 'https://www.instagram.com/good_nutrition_habits', icon: Instagram, label: '@good_nutrition_habits' },
              ].map(({ href, icon: Icon, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.50)', textDecoration: 'none', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F07820')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.50)')}>
                    <Icon size={14} color="#F07820" />
                    {label}
                  </a>
                </li>
              ))}
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.50)' }}>
                <MapPin size={14} color="#F07820" />
                Tixtla de Guerrero, México
              </li>
            </ul>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F0F0F0', fontWeight: 600, marginBottom: '24px' }}>Navegación</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[['Inicio', '#inicio'], ['Servicios', '#servicios'], ['Sobre mí', '#sobre-mi'], ['Reservar', '#contacto']].map(([label, href]) => (
                <li key={href}>
                  <a href={href} style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.50)', textDecoration: 'none', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F07820')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,240,240,0.50)')}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div style={{ borderTop: '1px solid rgba(40,180,74,0.12)', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(240,240,240,0.30)', letterSpacing: '0.05em' }}>
            © {year} Good Nutrition Habits — L.N. Bryan Yaudiel Gil Tlatempa
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(240,240,240,0.30)', letterSpacing: '0.05em' }}>
            Tixtla de Guerrero, México
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid { grid-template-columns: 1fr; }
        @media (min-width: 640px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr; } }
      `}</style>
    </footer>
  );
}
