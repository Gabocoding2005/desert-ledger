import { formatDateShort } from '../utils/dates'

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const fmt = (n) => {
  const sign = n < 0 ? '−' : ''
  const abs = Math.abs(n)
  return sign + '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── BalancePanel ──────────────────────────────────────────────
function BalancePanel({ balance, income, expenses }) {
  const pctSaved = income > 0 ? Math.round((balance / income) * 100) : 0
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - now.getDate()
  const monthLabel = `${MONTHS_ES[now.getMonth()].toUpperCase()} · ${now.getFullYear()}`

  return (
    <div style={{ background: 'var(--bone)', border: '1px solid var(--ink)', overflow: 'hidden' }}>
      {/* top stripe */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--ink)',
        background: 'var(--paper-deep)',
      }}>
        <span className="t-eyebrow">Estado del mes</span>
        <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>{monthLabel}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', minHeight: 200 }}>
        {/* Balance */}
        <div style={{ padding: '28px 32px', borderRight: '1px solid var(--ink)' }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>Balance del mes</div>
          <div className="t-display" style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 0.95,
            wordBreak: 'break-word',
          }}>
            {fmt(balance)}
          </div>
          <div className="t-italic" style={{ fontSize: 16, color: 'var(--terracotta)', marginTop: 6 }}>
            {balance >= 0 ? 'al haber' : 'en rojo'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
              background: 'var(--ochre)', color: 'var(--ink)',
              border: '1px solid var(--ink)', borderRadius: 999,
              fontSize: 11.5, fontWeight: 500, fontFamily: 'var(--f-mono)',
              whiteSpace: 'nowrap',
            }}>
              {pctSaved}% ahorrado
            </span>
            {daysLeft > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
                background: 'transparent', color: 'var(--ink-soft)',
                border: '1px solid color-mix(in srgb, var(--ink) 25%, transparent)',
                borderRadius: 999, fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                Cierra en {daysLeft} días
              </span>
            )}
          </div>
        </div>

        {/* Income / Expenses */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
          <FinRow label="Ingresos" sub="lo que entra" value={income} color="var(--olive)" mark="+" />
          <div style={{ height: 1, background: 'color-mix(in srgb, var(--ink) 20%, transparent)' }} />
          <FinRow label="Egresos" sub="lo que sale" value={expenses} color="var(--terracotta)" mark="−" />
        </div>
      </div>

      {/* Arc divider */}
      <div style={{ borderTop: '1px solid var(--ink)' }}>
        <svg viewBox="0 0 400 40" width="100%" height={28} preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 38 Q200 -12 400 38" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <path d="M0 38 Q200 6 400 38" stroke="var(--terracotta)" strokeWidth="1.2" fill="none" />
          <path d="M0 38 Q200 22 400 38" stroke="var(--ochre)" strokeWidth="1.2" fill="none" />
        </svg>
      </div>
    </div>
  )
}

function FinRow({ label, sub, value, color, mark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div>
        <div className="t-eyebrow">{label}</div>
        <div className="t-italic" style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{sub}</div>
      </div>
      <div className="t-display t-mono" style={{
        fontSize: 'clamp(20px, 2.8vw, 28px)',
        color,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}>
        {mark}{fmt(value).replace('−', '').replace('+', '')}
      </div>
    </div>
  )
}

// ── SpendingByCategory ────────────────────────────────────────
function SpendingByCategory({ data }) {
  if (!data?.length) return (
    <div style={{ background: 'var(--bone)', border: '1px solid var(--ink)', padding: 24 }}>
      <SectionHead eyebrow="Capítulo I" title={<>Por <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>categoría</em></>} />
      <p className="t-italic" style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Sin movimientos este mes.</p>
    </div>
  )

  const max = Math.max(...data.map(d => d.total), 1)
  const palette = ['var(--terracotta)','var(--ochre)','var(--burgundy)','var(--olive)','var(--teal)']

  return (
    <div style={{ background: 'var(--bone)', border: '1px solid var(--ink)', padding: 24 }}>
      <SectionHead
        eyebrow="Capítulo I"
        title={<>Por <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>categoría</em></>}
        right={
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
            background: 'transparent', color: 'var(--ink-soft)',
            border: '1px solid color-mix(in srgb, var(--ink) 25%, transparent)',
            borderRadius: 999, fontSize: 11.5, fontWeight: 500, fontFamily: 'var(--f-mono)',
          }}>
            {data.length} rubros
          </span>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((c, i) => {
          const pct = (c.total / max) * 100
          return (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)', width: 22 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-display" style={{ fontSize: 16 }}>{c.name}</span>
                </div>
                <span className="t-mono" style={{ fontSize: 13.5 }}>{fmt(c.total)}</span>
              </div>
              <div style={{ position: 'relative', height: 10, background: 'var(--paper-deep)', border: '1px solid var(--ink)' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: `${pct}%`,
                  background: palette[i % palette.length],
                  borderRight: pct < 100 ? '1px solid var(--ink)' : 'none',
                  transition: 'width 600ms cubic-bezier(.2,.8,.2,1)',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── HabitsPanel ───────────────────────────────────────────────
function HabitsPanel({ habits, pendingIds }) {
  const doneCount = habits.filter(h => !pendingIds.has(h.id)).length

  return (
    <div style={{ background: 'var(--bone)', border: '1px solid var(--ink)', padding: 24 }}>
      <SectionHead
        eyebrow="Capítulo II"
        title={<>Hábitos del <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>día</em></>}
        right={
          <span className="t-mono" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>
            <span style={{ color: 'var(--terracotta)' }}>{doneCount}</span>
            <span style={{ color: 'var(--ink-mute)' }}> / {habits.length}</span>
          </span>
        }
      />

      {habits.length === 0 ? (
        <p className="t-italic" style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Sin hábitos activos.</p>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {habits.map((h, i) => {
            const done = !pendingIds.has(h.id)
            return (
              <li
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 0',
                  borderBottom: i < habits.length - 1
                    ? '1px dashed color-mix(in srgb, var(--ink) 22%, transparent)'
                    : 'none',
                }}
              >
                {/* check circle */}
                <div style={{
                  width: 22, height: 22,
                  border: '1.5px solid var(--ink)',
                  borderRadius: 999,
                  background: done ? 'var(--terracotta)' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5 L4.5 8 L9 3" stroke="var(--bone)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="t-display" style={{ fontSize: 17, lineHeight: 1.1 }}>{h.name}</div>
                </div>
                {h.streak > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div className="t-mono" style={{ fontSize: 18, color: 'var(--ochre-deep)', letterSpacing: '-0.02em' }}>
                      {h.streak}
                    </div>
                    <div className="t-eyebrow" style={{ fontSize: 8.5, letterSpacing: '0.18em' }}>días</div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── RecentTransactions ────────────────────────────────────────
function RecentTransactions({ items }) {
  return (
    <div style={{ background: 'var(--bone)', border: '1px solid var(--ink)', padding: 24 }}>
      <SectionHead
        eyebrow="Bitácora"
        title={<>Movimientos <em style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>recientes</em></>}
      />

      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 140px 120px',
        padding: '8px 0',
        borderBottom: '1px solid var(--ink)',
      }}>
        {['Fecha', 'Concepto', 'Categoría', 'Monto'].map((col, i) => (
          <div key={col} className="t-eyebrow" style={i === 3 ? { textAlign: 'right' } : {}}>
            {col}
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="t-italic" style={{ padding: '20px 0', color: 'var(--ink-mute)', fontSize: 14 }}>
          Sin movimientos este mes.
        </p>
      ) : (
        <ul>
          {items.slice(0, 10).map((tx, i) => (
            <li
              key={tx.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 140px 120px',
                padding: '13px 0',
                alignItems: 'center',
                borderBottom: i < Math.min(items.length, 10) - 1
                  ? '1px solid color-mix(in srgb, var(--ink) 12%, transparent)'
                  : 'none',
              }}
            >
              <div className="t-mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                {formatDateShort(tx.date)}
              </div>
              <div>
                <div className="t-display" style={{ fontSize: 16, lineHeight: 1.2 }}>
                  {tx.description || tx.category?.name || '—'}
                </div>
              </div>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                  background: 'transparent', color: 'var(--ink-soft)',
                  border: '1px solid color-mix(in srgb, var(--ink) 25%, transparent)',
                  borderRadius: 999, fontSize: 11.5, fontWeight: 500,
                  letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {tx.category?.name || '—'}
                </span>
              </div>
              <div
                className="t-mono"
                style={{
                  textAlign: 'right',
                  fontSize: 17,
                  color: tx.type === 'income' ? 'var(--olive)' : 'var(--ink)',
                  fontWeight: 500,
                }}
              >
                {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount).replace('−', '').replace('+', '')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── SectionHead ───────────────────────────────────────────────
function SectionHead({ eyebrow, title, right }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          {eyebrow && <div className="t-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
          <div className="t-display" style={{ fontSize: 26, lineHeight: 1.05 }}>{title}</div>
        </div>
        {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      </div>
      <div className="divider-double" style={{ marginTop: 12 }} />
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard({ summary, transactions, habitsSummary, pendingHabits = [] }) {
  if (!summary) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p className="t-italic" style={{ fontSize: 18, color: 'var(--ink-mute)' }}>Cargando...</p>
      </div>
    )
  }

  const pendingIds = new Set((pendingHabits || []).map(h => h.id))

  return (
    <div className="anim-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
      <BalancePanel
        balance={summary.balance}
        income={summary.income}
        expenses={summary.expenses}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <SpendingByCategory data={summary.top_categories || []} />
        <HabitsPanel habits={habitsSummary || []} pendingIds={pendingIds} />
      </div>

      <RecentTransactions items={transactions || []} />
    </div>
  )
}
