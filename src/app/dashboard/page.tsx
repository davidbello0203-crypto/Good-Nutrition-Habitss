'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { CalendarCheck, Clock, CheckCircle, XCircle, LogOut, Plus, User, Phone, Mail, Edit2, Save, X, ChevronRight, Star } from 'lucide-react';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

type Reserva = {
  id: string;
  servicio: string;
  dia: string;
  horario: string;
  objetivo: string;
  notas: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  created_at: string;
};

type Profile = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};

const ESTADO = {
  pendiente:  { bg: 'rgba(240,120,32,0.12)',  border: 'rgba(240,120,32,0.3)',  text: '#F07820', label: 'Pendiente' },
  confirmada: { bg: 'rgba(40,180,74,0.12)',   border: 'rgba(40,180,74,0.3)',   text: '#28B44A', label: 'Confirmada' },
  cancelada:  { bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.2)', text: '#FF6B6B', label: 'Cancelada' },
};

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: '#0F1208', border: '1px solid #1A2418',
  color: '#F0F0F0', fontFamily: 'var(--font-inter), system-ui, sans-serif',
  fontSize: '14px', padding: '12px 14px', outline: 'none', borderRadius: 0,
  transition: 'border-color 0.3s ease',
};

type Tab = 'proximas' | 'historial' | 'perfil';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('proximas');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>({ nombre: '', apellido: '', email: '', telefono: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) { setProfile(prof); setProfileForm(prof); }

      const { data } = await supabase.from('reservas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setReservas(data || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const reload = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase.from('reservas').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setReservas(data || []);
  };

  const handleCancelar = async (id: string) => {
    setCancelingId(id);
    const supabase = createClient();
    await supabase.from('reservas').update({ estado: 'cancelada' }).eq('id', id);
    await reload();
    setCancelingId(null);
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSavingProfile(true);
    const supabase = createClient();
    await supabase.from('profiles').update(profileForm).eq('id', userId);
    setProfile(profileForm);
    setEditingProfile(false);
    setSavingProfile(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const proximas = reservas.filter(r => r.estado !== 'cancelada');
  const historial = reservas.filter(r => r.estado === 'cancelada');
  const nextCita = reservas.find(r => r.estado === 'confirmada') || reservas.find(r => r.estado === 'pendiente');

  if (loading) return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #1A2418', borderTopColor: '#F07820', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#080808' }}>
      {/* Navbar */}
      <header style={{ borderBottom: '1px solid #1A2418', backgroundColor: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-gnh" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/"><Image src="/logo-gnh.png" alt="GNH" width={100} height={40} style={{ objectFit: 'contain', height: '36px', width: 'auto' }} /></a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(240,120,32,0.15)', border: '1px solid rgba(240,120,32,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, color: '#F07820' }}>
              {profile?.nombre?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="dash-username" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.7)' }}>
              {profile?.nombre} {profile?.apellido}
            </span>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #1A2418', color: 'rgba(240,240,240,0.55)', padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F07820'; e.currentTarget.style.color = '#F0F0F0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A2418'; e.currentTarget.style.color = 'rgba(240,240,240,0.55)'; }}>
              <LogOut size={13} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="container-gnh" style={{ paddingTop: '40px', paddingBottom: '80px' }}>

        {/* Próxima cita destacada */}
        {nextCita && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EXPO_OUT }}
            style={{ background: 'linear-gradient(135deg, rgba(240,120,32,0.12) 0%, rgba(40,180,74,0.08) 100%)', border: '1px solid rgba(240,120,32,0.25)', padding: '24px 28px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(240,120,32,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={22} color="#F07820" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F07820', marginBottom: '4px' }}>
                  {nextCita.estado === 'confirmada' ? '✓ Próxima cita confirmada' : 'Próxima cita — pendiente de confirmación'}
                </p>
                <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: '#F0F0F0', marginBottom: '2px' }}>
                  {nextCita.servicio}
                </p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(240,240,240,0.55)' }}>
                  {nextCita.dia} · {nextCita.horario}
                </p>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: ESTADO[nextCita.estado].text, backgroundColor: ESTADO[nextCita.estado].bg, border: `1px solid ${ESTADO[nextCita.estado].border}`, padding: '6px 14px' }}>
              {ESTADO[nextCita.estado].label}
            </span>
          </motion.div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }} className="dash-stats">
          {[
            { label: 'Total', value: reservas.length, icon: CalendarCheck, color: '#F07820' },
            { label: 'Confirmadas', value: reservas.filter(r => r.estado === 'confirmada').length, icon: CheckCircle, color: '#28B44A' },
            { label: 'Pendientes', value: reservas.filter(r => r.estado === 'pendiente').length, icon: Clock, color: '#F07820' },
            { label: 'Canceladas', value: reservas.filter(r => r.estado === 'cancelada').length, icon: XCircle, color: '#FF6B6B' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.07, ease: EXPO_OUT }}
              style={{ backgroundColor: '#090C08', border: '1px solid #1A2418', padding: '18px 20px' }}>
              <Icon size={16} color={color} style={{ marginBottom: '8px' }} />
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', fontWeight: 700, color: '#F0F0F0', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)', marginTop: '4px' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs + Nueva cita */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="dash-tabs-bar" style={{ display: 'flex', gap: '4px' }}>
            {([['proximas', 'Mis citas'], ['historial', 'Canceladas'], ['perfil', 'Mi perfil']] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '9px 18px', border: `1px solid ${tab === t ? '#F07820' : '#1A2418'}`, backgroundColor: tab === t ? 'rgba(240,120,32,0.1)' : 'transparent', color: tab === t ? '#F07820' : 'rgba(240,240,240,0.45)', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-reservar'))}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', backgroundColor: '#F07820', border: 'none', color: '#F0F0F0', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FF8C35')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F07820')}>
            <Plus size={13} /> Nueva cita
          </button>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">

          {/* Citas activas */}
          {(tab === 'proximas' || tab === 'historial') && (
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {(tab === 'proximas' ? proximas : historial).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px solid #1A2418', backgroundColor: '#090C08' }}>
                  <CalendarCheck size={36} color="#1A2418" style={{ margin: '0 auto 14px' }} />
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(240,240,240,0.35)', marginBottom: '20px' }}>
                    {tab === 'proximas' ? 'No tienes citas activas' : 'No tienes citas canceladas'}
                  </p>
                  {tab === 'proximas' && (
                    <button onClick={() => window.dispatchEvent(new CustomEvent('open-reservar'))}
                      style={{ padding: '11px 26px', backgroundColor: '#F07820', border: 'none', color: '#F0F0F0', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Agendar cita
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(tab === 'proximas' ? proximas : historial).map((r, i) => {
                    const e = ESTADO[r.estado];
                    return (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05, ease: EXPO_OUT }}
                        style={{ backgroundColor: '#090C08', border: '1px solid #1A2418', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', flex: 1 }}>
                          {[['Servicio', r.servicio], ['Día', r.dia], ['Horario', r.horario], ['Objetivo', r.objetivo]].map(([label, val]) => (
                            <div key={label}>
                              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)', marginBottom: '3px' }}>{label}</div>
                              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#F0F0F0' }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: e.text, backgroundColor: e.bg, border: `1px solid ${e.border}`, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                            {e.label}
                          </span>
                          {r.estado === 'pendiente' && (
                            <button onClick={() => handleCancelar(r.id)} disabled={cancelingId === r.id}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,107,107,0.08)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                              <X size={11} /> {cancelingId === r.id ? '...' : 'Cancelar'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Perfil */}
          {tab === 'perfil' && (
            <motion.div key="perfil" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="dash-profile-card" style={{ backgroundColor: '#090C08', border: '1px solid #1A2418', padding: '32px', maxWidth: '560px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(240,120,32,0.15)', border: '1px solid rgba(240,120,32,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: '#F07820' }}>
                      {profile?.nombre?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: 700, color: '#F0F0F0' }}>{profile?.nombre} {profile?.apellido}</p>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(240,240,240,0.4)' }}>{profile?.email}</p>
                    </div>
                  </div>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #1A2418', background: 'transparent', color: 'rgba(240,240,240,0.55)', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F07820'; e.currentTarget.style.color = '#F07820'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A2418'; e.currentTarget.style.color = 'rgba(240,240,240,0.55)'; }}>
                      <Edit2 size={12} /> Editar
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingProfile(false); setProfileForm(profile!); }}
                        style={{ padding: '8px 14px', border: '1px solid #1A2418', background: 'transparent', color: 'rgba(240,240,240,0.45)', fontFamily: 'var(--font-inter)', fontSize: '11px', cursor: 'pointer' }}>
                        <X size={12} />
                      </button>
                      <button onClick={handleSaveProfile} disabled={savingProfile}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', backgroundColor: '#F07820', color: '#F0F0F0', fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        <Save size={12} /> {savingProfile ? '...' : 'Guardar'}
                      </button>
                    </div>
                  )}
                </div>

                {(() => {
                  const nameFields: { field: keyof Profile; label: string; type: string; Icon: React.ElementType }[] = [
                    { field: 'nombre', label: 'Nombre', type: 'text', Icon: User },
                    { field: 'apellido', label: 'Apellido', type: 'text', Icon: User },
                  ];
                  const contactFields: { field: keyof Profile; label: string; type: string; Icon: React.ElementType; readOnly?: boolean }[] = [
                    { field: 'email', label: 'Correo electrónico', type: 'email', Icon: Mail, readOnly: true },
                    { field: 'telefono', label: 'WhatsApp', type: 'tel', Icon: Phone },
                  ];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="dash-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {nameFields.map(({ field, label, type, Icon }) => (
                          <div key={field}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.4)', marginBottom: '8px' }}>
                              <Icon size={11} /> {label}
                            </label>
                            {editingProfile ? (
                              <input type={type} value={profileForm[field]}
                                onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = '#F07820')}
                                onBlur={(e) => (e.target.style.borderColor = '#1A2418')} />
                            ) : (
                              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#F0F0F0', padding: '12px 0', borderBottom: '1px solid #1A2418' }}>{profile?.[field] || '—'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      {contactFields.map(({ field, label, type, Icon, readOnly }) => (
                        <div key={field}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.4)', marginBottom: '8px' }}>
                            <Icon size={11} /> {label}
                          </label>
                          {editingProfile && !readOnly ? (
                            <input type={type} value={profileForm[field]}
                              onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                              style={inputStyle}
                              onFocus={(e) => (e.target.style.borderColor = '#F07820')}
                              onBlur={(e) => (e.target.style.borderColor = '#1A2418')} />
                          ) : (
                            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: readOnly ? 'rgba(240,240,240,0.4)' : '#F0F0F0', padding: '12px 0', borderBottom: '1px solid #1A2418' }}>
                              {profile?.[field] || '—'}
                              {readOnly && <span style={{ fontSize: '10px', color: 'rgba(240,240,240,0.3)', marginLeft: '8px' }}>(no editable)</span>}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .dash-username { display: none; }
          .dash-tabs-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
          .dash-tabs-bar::-webkit-scrollbar { display: none; }
          .dash-tabs-bar button { white-space: nowrap; padding: 8px 14px !important; font-size: 10px !important; }
          .dash-profile-card { padding: 20px 16px !important; max-width: 100% !important; }
          .dash-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
