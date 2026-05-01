import { useState, useEffect } from 'react'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import DesertDivider from '../components/ui/DesertDivider'
import { api } from '../api/client'

const inputCls = 'px-4 py-2 border-2 border-camel-tobacco bg-camel-cream font-body text-camel-charcoal outline-none'
const inputRadius = { borderRadius: 'var(--radius-md)' }

export default function Settings({ categories, onCreate }) {
  const [showForm,    setShowForm]    = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '', type: 'expense', icon: '💰', color: '#D9A441',
  })

  const [vaultPath,   setVaultPath]   = useState(() => localStorage.getItem('obsidian_vault_path') || '')
  const [vaultStatus, setVaultStatus] = useState(null)
  const [vaultMsg,    setVaultMsg]    = useState('')

  // ── Reminder state ─────────────────────────────────────────
  const [reminder,       setReminder]       = useState({ enabled: false, email: '', time: '08:00' })
  const [reminderStatus, setReminderStatus] = useState(null)
  const [reminderMsg,    setReminderMsg]    = useState('')
  const [testingEmail,   setTestingEmail]   = useState(false)

  useEffect(() => {
    api.get('/reminders/settings').then(setReminder).catch(console.error)
  }, [])

  const handleSaveReminder = async () => {
    setReminderStatus(null)
    try {
      const res = await api.post('/reminders/settings', reminder)
      setReminder(res)
      setReminderStatus('ok')
      setReminderMsg('Guardado. El recordatorio se enviará todos los días a las ' + res.time)
    } catch {
      setReminderStatus('error')
      setReminderMsg('Error al guardar')
    }
  }

  const handleTestEmail = async () => {
    setTestingEmail(true)
    setReminderStatus(null)
    try {
      const res = await api.post('/reminders/test')
      setReminderStatus('ok')
      setReminderMsg(res.sent > 0
        ? `✅ Email enviado con ${res.sent} hábito(s) pendiente(s)`
        : '✅ ' + (res.message || 'Email de prueba enviado'))
    } catch (err) {
      setReminderStatus('error')
      setReminderMsg('❌ Error: ' + (err.message || 'No se pudo enviar'))
    } finally {
      setTestingEmail(false)
    }
  }

  const handleTestVault = async () => {
    setVaultStatus(null)
    try {
      const res = await api.post('/obsidian/test', { vault_path: vaultPath })
      if (res.ok) {
        localStorage.setItem('obsidian_vault_path', vaultPath)
        setVaultStatus('ok')
        setVaultMsg('¡Vault encontrado y guardado!')
      } else {
        setVaultStatus('error')
        setVaultMsg(res.error || 'Error desconocido')
      }
    } catch {
      setVaultStatus('error')
      setVaultMsg('No se pudo conectar al backend')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await onCreate(newCategory)
      setNewCategory({ name: '', type: 'expense', icon: '💰', color: '#D9A441' })
      setShowForm(false)
    } catch {
      alert('Error creating category')
    }
  }

  const incomeCategories  = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  return (
    <div className="max-w-4xl mx-auto">
      <PaperCard className="mb-6">
        <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase mb-2">
          Settings
        </h3>
        <p className="text-sm text-camel-charcoal font-body">
          Manage your categories and preferences
        </p>
      </PaperCard>

      {/* Email Reminders */}
      <PaperCard className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📧</span>
          <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase">Recordatorios por Email</h4>
        </div>
        <p className="font-body text-sm text-camel-charcoal mb-4">
          Recibe un email diario con los hábitos que aún no has completado.
          Requiere configurar <code className="font-mono text-xs bg-camel-dust px-1">GMAIL_USER</code> y{' '}
          <code className="font-mono text-xs bg-camel-dust px-1">GMAIL_APP_PASSWORD</code> en el archivo{' '}
          <code className="font-mono text-xs bg-camel-dust px-1">.flaskenv</code>.
        </p>

        {/* Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setReminder(r => ({ ...r, enabled: !r.enabled }))}
            className={`w-12 h-6 transition-colors relative ${reminder.enabled ? 'bg-camel-sand' : 'bg-camel-dust'}`}
            style={{ borderRadius: 'var(--radius-pill)', border: '2px solid var(--camel-tobacco)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-camel-tobacco transition-all"
              style={{
                borderRadius: '50%',
                left: reminder.enabled ? '22px' : '2px',
              }}
            />
          </button>
          <span className="font-body text-sm text-camel-charcoal">
            {reminder.enabled ? 'Recordatorios activados' : 'Recordatorios desactivados'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-1 text-sm">
              Email destinatario
            </label>
            <input
              type="email"
              value={reminder.email}
              onChange={e => setReminder(r => ({ ...r, email: e.target.value }))}
              placeholder="tu@correo.com"
              className={inputCls + ' w-full'}
              style={inputRadius}
            />
          </div>
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-1 text-sm">
              Hora del recordatorio
            </label>
            <input
              type="time"
              value={reminder.time}
              onChange={e => setReminder(r => ({ ...r, time: e.target.value }))}
              className={inputCls + ' w-full font-mono'}
              style={inputRadius}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <RetroButton onClick={handleSaveReminder}>Guardar</RetroButton>
          <RetroButton
            variant="secondary"
            onClick={handleTestEmail}
            disabled={testingEmail || !reminder.email}
          >
            {testingEmail ? 'Enviando...' : 'Enviar prueba ahora'}
          </RetroButton>
        </div>

        {reminderStatus && (
          <p className={`mt-3 text-sm font-body ${reminderStatus === 'ok' ? 'text-income-color' : 'text-expense-color'}`}>
            {reminderMsg}
          </p>
        )}
      </PaperCard>

      {/* Obsidian Integration */}
      <PaperCard className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🟣</span>
          <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase">Obsidian Vault</h4>
        </div>
        <p className="font-body text-sm text-camel-charcoal mb-4">
          Configura la ruta a tu vault de Obsidian para exportar reportes y recetas como notas Markdown.
          Los archivos se guardarán en <code className="font-mono text-xs bg-camel-dust px-1">Desert Ledger/Reportes</code> y <code className="font-mono text-xs bg-camel-dust px-1">Desert Ledger/Recetas</code>.
        </p>

        <div className="flex gap-3 items-start">
          <input
            type="text"
            value={vaultPath}
            onChange={e => { setVaultPath(e.target.value); setVaultStatus(null) }}
            placeholder="C:\Users\User\Documents\MiVault"
            className="flex-1 px-4 py-2 border-2 border-camel-tobacco bg-camel-cream font-mono text-sm text-camel-charcoal outline-none"
            style={{ borderRadius: 'var(--radius-md)' }}
          />
          <RetroButton onClick={handleTestVault} disabled={!vaultPath.trim()}>
            Probar y Guardar
          </RetroButton>
        </div>

        {vaultStatus && (
          <p className={`mt-3 text-sm font-body ${vaultStatus === 'ok' ? 'text-income-color' : 'text-expense-color'}`}>
            {vaultStatus === 'ok' ? '✅' : '❌'} {vaultMsg}
          </p>
        )}

        {localStorage.getItem('obsidian_vault_path') && vaultStatus !== 'error' && (
          <p className="mt-2 text-xs font-mono text-camel-tobacco opacity-60">
            Guardado: {localStorage.getItem('obsidian_vault_path')}
          </p>
        )}
      </PaperCard>

      <PaperCard>
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase">
            Categories
          </h4>
          <RetroButton size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Category'}
          </RetroButton>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 p-4 bg-camel-cream" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">Name</label>
                <input
                  type="text" required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">Type</label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">Icon (emoji)</label>
                <input
                  type="text" required maxLength="2"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">Color</label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border-2 border-camel-tobacco"
                />
              </div>
            </div>
            <RetroButton type="submit" size="sm" className="mt-4">Create Category</RetroButton>
          </form>
        )}

        <div className="mb-6">
          <h5 className="font-display font-bold text-lg text-income-color mb-3">Income Categories</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {incomeCategories.map((cat) => (
              <div key={cat.id} className="p-3 bg-camel-cream border border-camel-dust flex items-center gap-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-body text-sm text-camel-charcoal">{cat.name}</span>
                <div className="ml-auto w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
            ))}
          </div>
        </div>

        <DesertDivider />

        <div>
          <h5 className="font-display font-bold text-lg text-expense-color mb-3">Expense Categories</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="p-3 bg-camel-cream border border-camel-dust flex items-center gap-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-body text-sm text-camel-charcoal">{cat.name}</span>
                <div className="ml-auto w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
            ))}
          </div>
        </div>
      </PaperCard>
    </div>
  )
}
