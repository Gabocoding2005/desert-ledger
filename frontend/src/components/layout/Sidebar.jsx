import { useState } from 'react'

const navItems = [
  { id: 'dashboard',    label: 'Inicio' },
  { id: 'transactions', label: 'Movimientos' },
  { id: 'budgets',      label: 'Presupuestos' },
  { id: 'habits',       label: 'Hábitos' },
  { id: 'reports',      label: 'Reportes' },
  { id: 'recipes',      label: 'Recetario' },
  { id: 'settings',     label: 'Ajustes' },
]

function SunMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="6" fill="var(--terracotta)" />
      <path d="M20 14 A6 6 0 0 1 26 20" stroke="var(--ink)" strokeWidth="1.2" />
      <path d="M8 28 A12 12 0 0 1 32 28" stroke="var(--ink)" strokeWidth="1.4" />
      <path d="M3 32 A17 17 0 0 1 37 32" stroke="var(--ochre-deep)" strokeWidth="1.4" />
      <line x1="0" y1="36" x2="40" y2="36" stroke="var(--ink)" strokeWidth="1.2" />
    </svg>
  )
}

export default function Sidebar({ currentPage, onNavigate, pendingCount = 0 }) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        background: 'var(--paper-deep)',
        borderRight: '1px solid var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand */}
      <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid var(--ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <SunMark size={34} />
          <div>
            <div className="t-display" style={{ fontSize: 19, lineHeight: 1, letterSpacing: '-0.01em' }}>
              Desert
            </div>
            <div className="t-italic" style={{ fontSize: 19, lineHeight: 1, color: 'var(--terracotta)' }}>
              Ledger
            </div>
          </div>
        </div>
        <div className="t-eyebrow" style={{ fontSize: 9.5, letterSpacing: '0.22em' }}>
          Almanaque · Vol. IV
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '18px 0', overflowY: 'auto' }}>
        <div className="t-eyebrow" style={{ padding: '0 22px 10px' }}>Secciones</div>
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item, i) => {
            const active = currentPage === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 22px',
                    textAlign: 'left',
                    background: active ? 'var(--paper)' : 'transparent',
                    borderLeft: active ? '3px solid var(--terracotta)' : '3px solid transparent',
                    color: active ? 'var(--ink)' : 'var(--ink-soft)',
                    transition: 'background 140ms',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'color-mix(in srgb, var(--paper) 60%, transparent)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span
                    className="t-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.05em',
                      color: active ? 'var(--terracotta)' : 'var(--ink-mute)',
                      width: 24,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="t-display"
                    style={{
                      fontSize: 17,
                      flex: 1,
                      letterSpacing: '-0.005em',
                      fontStyle: active ? 'italic' : 'normal',
                    }}
                  >
                    {item.label}
                  </span>
                  {item.id === 'habits' && pendingCount > 0 && (
                    <span
                      className="t-mono"
                      style={{
                        background: 'var(--terracotta)',
                        color: 'var(--bone)',
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 999,
                        lineHeight: 1.2,
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="t-mono"
        style={{
          padding: '16px 22px',
          borderTop: '1px solid var(--ink)',
          fontSize: 10,
          color: 'var(--ink-mute)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Est. MMXXVI</span>
        <span>v 1.0</span>
      </div>
    </aside>
  )
}
