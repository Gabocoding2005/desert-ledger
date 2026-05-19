import { useState, useRef } from 'react'
import RetroButton from '../ui/RetroButton'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'

const fieldStyle = {
  width: '100%',
  padding: '0.5rem 1rem',
  border: '2px solid var(--ink)',
  background: 'var(--paper)',
  color: 'var(--ink)',
  borderRadius: '4px',
  fontFamily: 'inherit',
  outline: 'none',
}

export default function ReceiptScanModal({ categories, onSave, onClose }) {
  const [step, setStep]       = useState('upload')
  const [preview, setPreview] = useState(null)
  const [file, setFile]       = useState(null)
  const [hint, setHint]       = useState('')
  const [error, setError]     = useState(null)
  const [formData, setFormData] = useState({
    amount:      '',
    type:        'expense',
    description: '',
    date:        new Date().toISOString().split('T')[0],
    category_id: '',
  })
  const fileInputRef = useRef(null)

  const setFileAndPreview = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setFileAndPreview(e.dataTransfer.files[0])
  }

  const handleScan = async () => {
    if (!file) return
    setStep('scanning')
    setError(null)

    try {
      const payload = new FormData()
      payload.append('image', file)

      const res = await fetch(`${API_BASE}/receipts/scan`, { method: 'POST', body: payload })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)

      setFormData(prev => ({
        ...prev,
        amount:      data.amount?.toString() ?? '',
        description: data.description ?? '',
        date:        data.date ?? prev.date,
      }))
      setHint(data.category_suggestion ?? '')
      setStep('review')
    } catch (err) {
      setError(err.message)
      setStep('upload')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSave({
        ...formData,
        amount:      parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
      })
    } catch {
      setError('Error al guardar la transacción')
    }
  }

  const filteredCategories = categories.filter(c => c.type === formData.type)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div style={{
        background:   'var(--paper)',
        border:       '2px solid var(--ink)',
        borderRadius: '4px',
        padding:      '2rem',
        maxWidth:     '460px',
        width:        '100%',
        maxHeight:    '92vh',
        overflowY:    'auto',
      }}>
        <h3 className="font-display font-bold text-2xl uppercase mb-1" style={{ color: 'var(--ink)' }}>
          Escanear Recibo
        </h3>
        <p className="font-body text-sm mb-6" style={{ color: 'var(--ink)', opacity: 0.5 }}>
          Sube una foto y Claude extrae los datos
        </p>

        {error && (
          <div className="font-body text-sm mb-4" style={{
            background:   '#fef2f2',
            border:       '1px solid var(--terracotta)',
            color:        'var(--terracotta)',
            borderRadius: '4px',
            padding:      '0.75rem 1rem',
          }}>
            {error}
          </div>
        )}

        {step === 'upload' && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border:        `2px dashed var(--ochre)`,
                borderRadius:  '4px',
                padding:       '2rem 1rem',
                textAlign:     'center',
                cursor:        'pointer',
                background:    'rgba(217,164,65,0.04)',
                marginBottom:  '1rem',
                minHeight:     '160px',
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                justifyContent:'center',
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa del recibo"
                  style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '2px' }}
                />
              ) : (
                <>
                  <p className="font-body text-base mb-1" style={{ color: 'var(--ochre)' }}>
                    Arrastra una imagen aquí
                  </p>
                  <p className="font-body text-sm" style={{ color: 'var(--ink)', opacity: 0.4 }}>
                    o haz clic para seleccionar · JPG, PNG, WebP
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setFileAndPreview(e.target.files[0])}
              style={{ display: 'none' }}
            />

            {file && (
              <p className="font-body text-xs mb-4" style={{ color: 'var(--ink)', opacity: 0.45 }}>
                {file.name}
              </p>
            )}

            <div className="flex gap-3">
              <RetroButton onClick={handleScan} disabled={!file} className="flex-1">
                Escanear
              </RetroButton>
              <RetroButton variant="secondary" onClick={onClose}>
                Cancelar
              </RetroButton>
            </div>
          </>
        )}

        {step === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            {preview && (
              <img
                src={preview}
                alt="Recibo"
                style={{ maxHeight: '160px', maxWidth: '100%', opacity: 0.5, borderRadius: '2px', marginBottom: '1.5rem' }}
              />
            )}
            <p className="font-body text-lg" style={{ color: 'var(--ochre)' }}>
              Analizando recibo...
            </p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--ink)', opacity: 0.45 }}>
              Claude está leyendo los datos
            </p>
          </div>
        )}

        {step === 'review' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Recibo"
                style={{ maxHeight: '100px', maxWidth: '100%', display: 'block', margin: '0 auto 0.25rem', borderRadius: '2px', opacity: 0.75 }}
              />
            )}

            <div>
              <label className="block font-body font-semibold mb-2" style={{ color: 'var(--ink)' }}>Tipo</label>
              <div className="flex gap-4">
                {[['expense', 'Gasto'], ['income', 'Ingreso']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer font-body">
                    <input
                      type="radio"
                      value={val}
                      checked={formData.type === val}
                      onChange={e => setFormData({ ...formData, type: e.target.value, category_id: '' })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2" style={{ color: 'var(--ink)' }}>Monto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                style={{ ...fieldStyle, fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                Categoría
                {hint && (
                  <span className="font-body font-normal text-xs ml-2" style={{ color: 'var(--ochre)' }}>
                    sugerida: {hint}
                  </span>
                )}
              </label>
              <select
                required
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                style={fieldStyle}
              >
                <option value="">Selecciona una categoría</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body font-semibold mb-2" style={{ color: 'var(--ink)' }}>Descripción</label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={fieldStyle}
              />
            </div>

            <div>
              <label className="block font-body font-semibold mb-2" style={{ color: 'var(--ink)' }}>Fecha</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                style={{ ...fieldStyle, fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <RetroButton type="submit" className="flex-1">Guardar Transacción</RetroButton>
              <RetroButton type="button" variant="secondary" onClick={onClose}>Cancelar</RetroButton>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
