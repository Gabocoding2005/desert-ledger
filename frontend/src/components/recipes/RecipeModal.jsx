import { useState, useEffect } from 'react'
import RetroButton from '../ui/RetroButton'
import { api } from '../../api/client'

const inputCls = 'w-full px-4 py-2 border-2 border-camel-tobacco bg-camel-cream font-body text-camel-charcoal outline-none'
const inputRadius = { borderRadius: 'var(--radius-md)' }

const emptyForm = {
  title: '', description: '', ingredients: [''], steps: [''],
  tags: '', prep_time: '', cook_time: '', servings: '',
}

function recipeToForm(recipe) {
  return {
    title:       recipe.title,
    description: recipe.description || '',
    ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
    steps:       recipe.steps?.length       ? recipe.steps       : [''],
    tags:        (recipe.tags || []).join(', '),
    prep_time:   recipe.prep_time  ?? '',
    cook_time:   recipe.cook_time  ?? '',
    servings:    recipe.servings   ?? '',
  }
}

export default function RecipeModal({ recipe, onSave, onDelete, onClose }) {
  const [mode,        setMode]        = useState(recipe ? 'view' : 'create')
  const [tab,         setTab]         = useState('write')
  const [formData,    setFormData]    = useState(recipe ? recipeToForm(recipe) : emptyForm)
  const [extractText, setExtractText] = useState('')
  const [extracting,  setExtracting]  = useState(false)
  const [saving,      setSaving]      = useState(false)

  useEffect(() => {
    if (recipe) setFormData(recipeToForm(recipe))
  }, [recipe])

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }))

  const updateItem = (field, i, val) => {
    const arr = [...formData[field]]
    arr[i] = val
    set(field, arr)
  }
  const addItem    = (field) => set(field, [...formData[field], ''])
  const removeItem = (field, i) => {
    const arr = formData[field].filter((_, idx) => idx !== i)
    set(field, arr.length ? arr : [''])
  }

  const handleExtract = async () => {
    if (!extractText.trim()) return
    setExtracting(true)
    try {
      const data = await api.post('/recipes/extract', { text: extractText })
      setFormData({
        title:       data.title        || '',
        description: data.description  || '',
        ingredients: data.ingredients?.length ? data.ingredients : [''],
        steps:       data.steps?.length       ? data.steps       : [''],
        tags:        (data.tags || []).join(', '),
        prep_time:   data.prep_time    ?? '',
        cook_time:   data.cook_time    ?? '',
        servings:    data.servings     ?? '',
      })
      setTab('write')
    } catch {
      alert('Error al extraer. Verifica tu API key de Anthropic.')
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...formData,
        ingredients: formData.ingredients.filter(Boolean),
        steps:       formData.steps.filter(Boolean),
        tags:        formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        prep_time:   formData.prep_time ? parseInt(formData.prep_time) : null,
        cook_time:   formData.cook_time ? parseInt(formData.cook_time) : null,
        servings:    formData.servings  ? parseInt(formData.servings)  : null,
        source_text: extractText || (mode === 'edit' ? recipe?.source_text : '') || '',
      })
    } catch {
      alert('Error al guardar receta')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta receta?')) {
      try { await onDelete(recipe.id) } catch { alert('Error al eliminar') }
    }
  }

  const handleExportObsidian = async () => {
    const vaultPath = localStorage.getItem('obsidian_vault_path')
    if (!vaultPath) {
      alert('Primero configura tu vault de Obsidian en Settings ⚙️')
      return
    }
    try {
      const res = await api.post(`/obsidian/export-recipe/${recipe.id}`, { vault_path: vaultPath })
      alert(`✅ Exportado a:\n${res.path}`)
    } catch {
      alert('❌ Error al exportar. Verifica la ruta del vault en Settings.')
    }
  }

  // ── View ──────────────────────────────────────────────────────
  if (mode === 'view') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-camel-paper burned-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display font-bold text-3xl text-camel-tobacco uppercase leading-tight flex-1 pr-4">
              {recipe.title}
            </h2>
            <button onClick={onClose} className="text-camel-tobacco text-3xl font-bold leading-none">×</button>
          </div>

          {recipe.description && (
            <p className="font-body text-camel-charcoal mb-4 italic">{recipe.description}</p>
          )}

          <div className="flex gap-4 flex-wrap mb-4">
            {recipe.prep_time && <span className="dl-eyebrow">Prep: {recipe.prep_time} min</span>}
            {recipe.cook_time && <span className="dl-eyebrow">Cook: {recipe.cook_time} min</span>}
            {recipe.servings  && <span className="dl-eyebrow">Porciones: {recipe.servings}</span>}
          </div>

          {recipe.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {recipe.tags.map(t => (
                <span key={t} className="px-2 py-0.5 text-xs font-body bg-camel-sand/30 border border-camel-sand text-camel-tobacco">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase mb-3">Ingredientes</h4>
              <ul className="space-y-2">
                {(recipe.ingredients || []).map((ing, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-camel-sand mt-0.5">—</span>
                    <span className="font-body text-sm text-camel-charcoal">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase mb-3">Pasos</h4>
              <ol className="space-y-3">
                {(recipe.steps || []).map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-camel-sand flex-shrink-0 w-5">{i + 1}.</span>
                    <span className="font-body text-sm text-camel-charcoal">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <RetroButton onClick={() => setMode('edit')}>Editar</RetroButton>
            <RetroButton variant="secondary" onClick={handleExportObsidian}>🟣 Obsidian</RetroButton>
            <RetroButton variant="secondary" onClick={onClose}>Cerrar</RetroButton>
          </div>
        </div>
      </div>
    )
  }

  // ── Create / Edit ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-camel-paper burned-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase">
            {mode === 'edit' ? 'Editar Receta' : 'Nueva Receta'}
          </h3>
          <button onClick={onClose} className="text-camel-tobacco text-3xl font-bold leading-none">×</button>
        </div>

        {mode === 'create' && (
          <div className="flex mb-6 border-2 border-camel-tobacco">
            {[['write', '✏️ Escribir'], ['extract', '✨ Extraer texto']].map(([t, label]) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`flex-1 py-2 font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                  tab === t
                    ? 'bg-camel-tobacco text-camel-cream'
                    : 'bg-camel-cream text-camel-tobacco hover:bg-camel-dust'
                }`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === 'extract' && mode === 'create' && (
          <div className="space-y-4">
            <p className="font-body text-sm text-camel-tobacco italic">
              Pega el texto de una receta (de un blog, mensaje, etc.) y Claude la estructurará automáticamente.
            </p>
            <textarea rows="10"
              value={extractText}
              onChange={e => setExtractText(e.target.value)}
              className={inputCls} style={inputRadius}
              placeholder="Pega la receta aquí..."
            />
            <RetroButton
              onClick={handleExtract}
              disabled={extracting || !extractText.trim()}
              className="w-full"
            >
              {extracting ? 'Extrayendo...' : '✨ Extraer Receta'}
            </RetroButton>
          </div>
        )}

        {(tab === 'write' || mode === 'edit') && (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-1">Título *</label>
              <input type="text" required
                value={formData.title}
                onChange={e => set('title', e.target.value)}
                className={inputCls} style={inputRadius}
                placeholder="ej. Pasta al pesto"
              />
            </div>

            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-1">Descripción</label>
              <textarea rows="2"
                value={formData.description}
                onChange={e => set('description', e.target.value)}
                className={inputCls} style={inputRadius}
                placeholder="Descripción breve..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[['prep_time', 'Prep (min)', '15'], ['cook_time', 'Cook (min)', '30'], ['servings', 'Porciones', '4']].map(([key, label, ph]) => (
                <div key={key}>
                  <label className="block font-body font-semibold text-camel-charcoal mb-1 text-sm">{label}</label>
                  <input type="number" min="0"
                    value={formData[key]}
                    onChange={e => set(key, e.target.value)}
                    className={inputCls + ' font-mono'} style={inputRadius}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-2">Ingredientes</label>
              <div className="space-y-2">
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text"
                      value={ing}
                      onChange={e => updateItem('ingredients', i, e.target.value)}
                      className={inputCls + ' flex-1'} style={inputRadius}
                      placeholder={`Ingrediente ${i + 1}`}
                    />
                    <button type="button" onClick={() => removeItem('ingredients', i)}
                      className="px-3 text-camel-rust border-2 border-camel-tobacco bg-camel-cream font-bold hover:bg-camel-dust">×</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addItem('ingredients')}
                className="mt-2 text-sm font-body text-camel-tobacco hover:text-camel-sand underline">
                + Agregar ingrediente
              </button>
            </div>

            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-2">Pasos</label>
              <div className="space-y-2">
                {formData.steps.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="font-mono text-sm font-bold text-camel-sand mt-3 w-5 flex-shrink-0">{i + 1}.</span>
                    <textarea rows="2"
                      value={step}
                      onChange={e => updateItem('steps', i, e.target.value)}
                      className={inputCls + ' flex-1'} style={inputRadius}
                      placeholder={`Paso ${i + 1}...`}
                    />
                    <button type="button" onClick={() => removeItem('steps', i)}
                      className="px-3 mt-2 text-camel-rust border-2 border-camel-tobacco bg-camel-cream font-bold hover:bg-camel-dust">×</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addItem('steps')}
                className="mt-2 text-sm font-body text-camel-tobacco hover:text-camel-sand underline">
                + Agregar paso
              </button>
            </div>

            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-1">Tags (separados por coma)</label>
              <input type="text"
                value={formData.tags}
                onChange={e => set('tags', e.target.value)}
                className={inputCls} style={inputRadius}
                placeholder="italiana, pasta, rápido"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <RetroButton type="submit" disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : (mode === 'edit' ? 'Actualizar' : 'Guardar Receta')}
              </RetroButton>
              <RetroButton type="button" variant="secondary" onClick={onClose}>Cancelar</RetroButton>
            </div>

            {mode === 'edit' && onDelete && (
              <RetroButton type="button" variant="danger" onClick={handleDelete} className="w-full" size="sm">
                Eliminar Receta
              </RetroButton>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
