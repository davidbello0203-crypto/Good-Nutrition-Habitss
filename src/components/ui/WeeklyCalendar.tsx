'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

// ─── Días ──────────────────────────────────────────────────────────────────
export const DIAS_SEMANA       = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const DIAS_FINDE        = ['Sábado', 'Domingo'];
export const DIAS              = [...DIAS_SEMANA, ...DIAS_FINDE];

const DIAS_SEMANA_SHORT        = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const DIAS_FINDE_SHORT         = ['Sáb', 'Dom'];

// ─── Horarios por tipo ─────────────────────────────────────────────────────
// Nutrición: entre semana 7-9pm, fin de semana 8am-6pm
export const HORARIOS_NUTRI_SEMANA = ['7:00 – 8:00 pm', '8:00 – 9:00 pm'];
export const HORARIOS_NUTRI_FINDE  = [
  '8:00 – 9:00 am', '9:00 – 10:00 am', '10:00 – 11:00 am',
  '11:00 am – 12:00 pm', '12:00 – 1:00 pm', '1:00 – 2:00 pm',
  '2:00 – 3:00 pm', '3:00 – 4:00 pm', '4:00 – 5:00 pm', '5:00 – 6:00 pm',
];

// Entrenamiento: lunes-viernes 6am-6pm
export const HORARIOS_ENTRENA = [
  '6:00 – 7:00 am', '7:00 – 8:00 am', '8:00 – 9:00 am', '9:00 – 10:00 am',
  '10:00 – 11:00 am', '11:00 am – 12:00 pm', '12:00 – 1:00 pm', '1:00 – 2:00 pm',
  '2:00 – 3:00 pm', '3:00 – 4:00 pm', '4:00 – 5:00 pm', '5:00 – 6:00 pm',
];

// Todos los horarios únicos (para forms en admin, etc.)
export const HORARIOS = [...HORARIOS_ENTRENA, ...HORARIOS_NUTRI_SEMANA];
// Backward-compat alias
export const HORARIOS_SHORT = HORARIOS.map(h => h.replace(' – ', '-').replace(':00 ', '').replace(' am','am').replace(' pm','pm'));

// ─── Types ─────────────────────────────────────────────────────────────────
export type CalSlot = {
  dia: string;
  horario: string;
  tipo: 'nutricion' | 'entrenamiento';
  estado: string;
  clientName?: string;
  isMine?: boolean;
};

export type WeeklyCalendarProps = {
  slots: CalSlot[];
  onSelectSlot?: (dia: string, horario: string) => void;
  selectedDia?: string;
  selectedHorario?: string;
  tipoFilter?: 'todas' | 'nutricion' | 'entrenamiento';
  showNames?: boolean;
  mode: 'view' | 'select';
};

// ─── CalGrid interno ────────────────────────────────────────────────────────
type CalGridProps = {
  dias: string[];
  diasShort: string[];
  horarios: string[];
  slots: CalSlot[];
  onSelectSlot?: (dia: string, horario: string) => void;
  selectedDia?: string;
  selectedHorario?: string;
  showNames: boolean;
  mode: 'view' | 'select';
  accentColor: string;
};

function CalGrid({
  dias, diasShort, horarios, slots,
  onSelectSlot, selectedDia, selectedHorario,
  showNames, mode, accentColor,
}: CalGridProps) {
  const slotMap = useMemo(() => {
    const map = new Map<string, CalSlot[]>();
    for (const s of slots) {
      const key = `${s.dia}|${s.horario}`;
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    }
    return map;
  }, [slots]);

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const, paddingBottom: '2px' }}>
      <table style={{
        width: '100%',
        minWidth: `${dias.length * 72 + 90}px`,
        borderCollapse: 'separate',
        borderSpacing: '2px',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}>
        <thead>
          <tr>
            <th style={{
              width: '88px', minWidth: '88px', padding: '8px 8px',
              fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(240,240,240,0.22)', textAlign: 'left',
              borderBottom: '1px solid #1A2418',
            }}>Hora</th>
            {dias.map((dia, i) => (
              <th key={dia} style={{
                padding: '8px 4px',
                fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                fontWeight: 600, color: 'rgba(240,240,240,0.5)', textAlign: 'center',
                borderBottom: '1px solid #1A2418',
              }}>
                <span className="cal-dia-full">{dia}</span>
                <span className="cal-dia-short">{diasShort[i]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario}>
              <td style={{
                padding: '5px 8px',
                fontWeight: 500, fontSize: '11px',
                color: 'rgba(240,240,240,0.38)', textAlign: 'left',
                verticalAlign: 'middle', whiteSpace: 'nowrap',
              }}>
                {horario}
              </td>
              {dias.map((dia) => {
                const cellSlots = slotMap.get(`${dia}|${horario}`) || [];
                const taken     = cellSlots.length > 0;
                const hasMine   = cellSlots.some(s => s.isMine);
                const selected  = selectedDia === dia && selectedHorario === horario;
                const hasN      = cellSlots.some(s => s.tipo === 'nutricion');
                const hasE      = cellSlots.some(s => s.tipo === 'entrenamiento');

                const clickable    = (mode === 'select' && !taken) || (mode === 'view' && taken && !!onSelectSlot);
                const notClickable = mode === 'select' && taken;

                let bg: string = '#0F1208';
                let border      = '1px solid #1E2A1C';
                let opacity     = 1;
                let cursor      = 'default';

                if (selected) {
                  bg = 'rgba(40,180,74,0.15)'; border = '2px solid #28B44A';
                } else if (hasMine) {
                  bg = 'rgba(240,120,32,0.2)'; border = '2px solid #F07820';
                } else if (hasN && hasE) {
                  bg = 'linear-gradient(135deg, rgba(240,120,32,0.12) 50%, rgba(40,180,74,0.1) 50%)';
                  border = '1px solid rgba(240,120,32,0.35)';
                } else if (hasN) {
                  bg = 'rgba(240,120,32,0.12)'; border = '1px solid rgba(240,120,32,0.4)';
                } else if (hasE) {
                  bg = 'rgba(40,180,74,0.1)'; border = '1px solid rgba(40,180,74,0.35)';
                }

                if (clickable)    cursor = 'pointer';
                if (notClickable) { opacity = 0.5; cursor = 'not-allowed'; }

                const isGradient = bg.startsWith('linear');

                return (
                  <td key={dia} style={{ padding: 0 }}>
                    <div
                      onClick={() => { if (onSelectSlot && clickable) onSelectSlot(dia, horario); }}
                      style={{
                        ...(isGradient ? { background: bg } : { backgroundColor: bg }),
                        border, opacity, cursor,
                        padding: '5px 3px', minHeight: '34px',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '2px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (mode === 'select' && clickable) {
                          e.currentTarget.style.borderColor = accentColor;
                          e.currentTarget.style.backgroundColor = `${accentColor}14`;
                        }
                        if (mode === 'view' && clickable) {
                          e.currentTarget.style.transform = 'scale(1.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (mode === 'select' && clickable) {
                          e.currentTarget.style.borderColor = '#1E2A1C';
                          e.currentTarget.style.backgroundColor = '#0F1208';
                        }
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {taken ? (
                        <>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {hasN && <span style={{ fontSize: '10px', fontWeight: 700, color: '#F07820' }}>N</span>}
                            {hasE && <span style={{ fontSize: '10px', fontWeight: 700, color: '#28B44A' }}>E</span>}
                          </div>
                          {hasMine && (
                            <span style={{ fontSize: '7px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F07820', fontWeight: 600 }}>
                              Mi cita
                            </span>
                          )}
                          {showNames && cellSlots.map((s, si) =>
                            s.clientName ? (
                              <span key={si} style={{ fontSize: '8px', color: 'rgba(240,240,240,0.5)', lineHeight: 1 }}>
                                {s.clientName.charAt(0).toUpperCase()}
                              </span>
                            ) : null
                          )}
                        </>
                      ) : mode === 'select' ? (
                        <span style={{ fontSize: '9px', color: 'rgba(240,240,240,0.15)' }}>—</span>
                      ) : null}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Subheader de sección ───────────────────────────────────────────────────
function SubLabel({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: '10px 0 6px' }}>
      <div style={{ width: '3px', height: '12px', backgroundColor: color, flexShrink: 0 }} />
      <span style={{
        fontFamily: 'var(--font-inter)', fontSize: '9px',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(240,240,240,0.4)', fontWeight: 600,
      }}>{text}</span>
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────
export default function WeeklyCalendar({
  slots,
  onSelectSlot,
  selectedDia,
  selectedHorario,
  tipoFilter = 'todas',
  showNames = false,
  mode,
}: WeeklyCalendarProps) {

  const nutSlots   = useMemo(() => slots.filter(s => s.tipo === 'nutricion'),   [slots]);
  const entreSlots = useMemo(() => slots.filter(s => s.tipo === 'entrenamiento'), [slots]);

  const showNutri  = tipoFilter === 'nutricion' || tipoFilter === 'todas';
  const showEntre  = tipoFilter === 'entrenamiento' || tipoFilter === 'todas';
  const showBoth   = tipoFilter === 'todas';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EXPO_OUT }}
    >
      {/* ── Nutrición ── */}
      {showNutri && (
        <div>
          {showBoth && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <div style={{ width: '3px', height: '15px', backgroundColor: '#F07820' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F07820', fontWeight: 600, opacity: 0.8 }}>
                Nutrición
              </span>
            </div>
          )}

          {/* Entre semana: Lun-Vie · 7-9pm */}
          <SubLabel text="Entre semana · 7 – 9 pm" color="#F07820" />
          <CalGrid
            dias={DIAS_SEMANA} diasShort={DIAS_SEMANA_SHORT}
            horarios={HORARIOS_NUTRI_SEMANA}
            slots={nutSlots}
            onSelectSlot={onSelectSlot}
            selectedDia={selectedDia} selectedHorario={selectedHorario}
            showNames={showNames} mode={mode} accentColor="#F07820"
          />

          {/* Fin de semana: Sáb-Dom · 8am-6pm */}
          <SubLabel text="Fin de semana · 8 am – 6 pm" color="#F07820" />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <CalGrid
              dias={DIAS_FINDE} diasShort={DIAS_FINDE_SHORT}
              horarios={HORARIOS_NUTRI_FINDE}
              slots={nutSlots}
              onSelectSlot={onSelectSlot}
              selectedDia={selectedDia} selectedHorario={selectedHorario}
              showNames={showNames} mode={mode} accentColor="#F07820"
            />
          </div>
        </div>
      )}

      {/* ── Entrenamiento ── */}
      {showEntre && (
        <div style={showBoth ? { borderTop: '1px solid #1A2418', marginTop: '20px', paddingTop: '8px' } : {}}>
          {showBoth && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <div style={{ width: '3px', height: '15px', backgroundColor: '#28B44A' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#28B44A', fontWeight: 600, opacity: 0.8 }}>
                Entrenamiento
              </span>
            </div>
          )}
          <SubLabel text="Lunes a Viernes · 6 am – 6 pm" color="#28B44A" />
          <CalGrid
            dias={DIAS_SEMANA} diasShort={DIAS_SEMANA_SHORT}
            horarios={HORARIOS_ENTRENA}
            slots={entreSlots}
            onSelectSlot={onSelectSlot}
            selectedDia={selectedDia} selectedHorario={selectedHorario}
            showNames={showNames} mode={mode} accentColor="#28B44A"
          />
        </div>
      )}

      {/* ── Leyenda ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '16px',
        padding: '12px 14px', backgroundColor: '#090C08', border: '1px solid #1A2418',
      }}>
        {[
          { color: '#0F1208',               borderColor: '#1E2A1C',                    label: 'Disponible' },
          { color: 'rgba(240,120,32,0.12)', borderColor: 'rgba(240,120,32,0.4)',       label: 'Nutrición (N)',     textColor: '#F07820' },
          { color: 'rgba(40,180,74,0.1)',   borderColor: 'rgba(40,180,74,0.35)',        label: 'Entrenamiento (E)', textColor: '#28B44A' },
          { color: 'rgba(240,120,32,0.2)',  borderColor: '#F07820',                    label: 'Mi cita',           textColor: '#F07820' },
          { color: 'rgba(40,180,74,0.15)', borderColor: '#28B44A',                    label: 'Seleccionado',      textColor: '#28B44A' },
        ].map(({ color, borderColor, label, textColor }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: color, border: `1.5px solid ${borderColor}`, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.06em', color: textColor || 'rgba(240,240,240,0.4)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .cal-dia-short { display: none; }
        @media (max-width: 580px) {
          .cal-dia-full  { display: none !important; }
          .cal-dia-short { display: inline !important; }
        }
      `}</style>
    </motion.div>
  );
}
