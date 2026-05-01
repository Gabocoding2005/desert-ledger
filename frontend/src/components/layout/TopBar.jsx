import { useState, useRef, useEffect } from 'react'

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

const PAGE_INFO = {
  dashboard:    { label: 'Inicio',        eyebrow: 'Desert Ledger' },
  transactions: { label: 'Movimientos',   eyebrow: 'Bitácora financiera' },
  budgets:      { label: 'Presupuestos',  eyebrow: 'Control de gastos' },
  habits:       { label: 'Hábitos',       eyebrow: 'Rutinas diarias' },
  reports:      { label: 'Reportes',      eyebrow: 'Análisis mensual' },
  recipes:      { label: 'Recetario',     eyebrow: 'Archivo de cocina' },
  settings:     { label: 'Ajustes',       eyebrow: 'Configuración' },
}

export default function TopBar({ currentPage, pendingHabits = [], onNavigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const now        = new Date()
  const monthLabel = MONTHS_ES[now.getMonth()]
  const year       = now.getFullYear()
  const dayLabel   = `${DAYS_ES[now.getDay()]} ${now.getDate()}`
  const info       = PAGE_INFO[currentPage] || PAGE_INFO.dashboard

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      style={{
        height: 'var(--topbar-h)',
        flexShrink: 0,
        background: 'var(--paper)',
        borderBottom: '1px solid var(--ink)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* Left — page title */}
      <div>
        <div className="t-eyebrow" style={{ marginBottom: 4 }}>{info.eyebrow}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <h1 className="t-display" style={{ fontSize: 38, lineHeight: 1, whiteSpace: 'nowrap' }}>
            {info.label}
          </h1>
          <span className="t-italic" style={{ fontSize: 24, color: 'var(--terracotta)' }}>—</span>
          <span className="t-italic" style={{ fontSize: 22, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
            {dayLabel}
          </span>
        </div>
      </div>

      {/* Right — month + bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ textAlign: 'right' }}>
          <div className="t-eyebrow" style={{ fontSize: 9.5, marginBottom: 4 }}>Edición</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="t-display" style={{ fontSize: 20, color: 'var(--terracotta)' }}>{monthLabel}</span>
            <span className="t-mono" style={{ fontSize: 18, color: 'var(--ink-soft)' }}>{year}</span>
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: 'var(--ink)', opacity: 0.3 }} />

        {/* Bell */}
        <div style={{ position: 'relative' }} ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Avisos"
            style={{
              width: 38, height: 38,
              border: '1px solid var(--ink)',
              borderRadius: 999,
              background: 'var(--bone)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 12 H12.5 L11 10 V6.5 A3 3 0 0 0 5 6.5 V10 Z" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M6.5 13.5 A1.5 1.5 0 0 0 9.5 13.5" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {pendingHabits.length > 0 && (
              <span
                className="t-mono"
                style={{
                  position: 'absolute',
                  top: -4, right: -4,
                  background: 'var(--terracotta)',
                  color: 'var(--bone)',
                  fontSize: 9.5,
                  padding: '1px 5px',
                  borderRadius: 999,
                  border: '1px solid var(--ink)',
                  lineHeight: 1.2,
                }}
              >
                {pendingHabits.length}
              </span>
            )}
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: 46, right: 0,
                width: 280,
                background: 'var(--bone)',
                border: '1px solid var(--ink)',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--ink)' }}>
                <div className="t-eyebrow">Pendientes hoy</div>
              </div>
              {pendingHabits.length === 0 ? (
                <div style={{ padding: 16 }} className="t-italic">
                  Todo en orden por hoy.
                </div>
              ) : (
                <>
                  <ul style={{ padding: '6px 0' }}>
                    {pendingHabits.map(h => (
                      <li key={h.id} style={{ display: 'flex', gap: 10, padding: '7px 14px', alignItems: 'center' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 999, background: h.color || 'var(--terracotta)', flexShrink: 0 }} />
                        <span style={{ fontSize: 13.5 }}>{h.name}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ padding: 12, borderTop: '1px solid var(--ink)' }}>
                    <button
                      onClick={() => { setOpen(false); onNavigate && onNavigate('habits') }}
                      style={{
                        width: '100%',
                        background: 'var(--ink)',
                        color: 'var(--bone)',
                        padding: '8px 12px',
                        fontSize: 11.5,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        borderRadius: 999,
                        fontFamily: 'var(--f-grot)',
                      }}
                    >
                      Ir a hábitos →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
