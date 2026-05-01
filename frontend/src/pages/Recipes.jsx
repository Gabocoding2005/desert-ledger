import { useState } from 'react'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import RecipeCard from '../components/recipes/RecipeCard'
import RecipeModal from '../components/recipes/RecipeModal'

export default function Recipes({ recipes, onCreate, onUpdate, onDelete }) {
  const [showModal,    setShowModal]    = useState(false)
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [tagFilter,    setTagFilter]    = useState(null)

  const allTags = [...new Set(recipes.flatMap(r => r.tags || []))]
  const filtered = tagFilter ? recipes.filter(r => r.tags?.includes(tagFilter)) : recipes

  const handleOpen  = (recipe) => { setActiveRecipe(recipe); setShowModal(true) }
  const handleNew   = ()       => { setActiveRecipe(null);   setShowModal(true) }
  const handleClose = ()       => { setShowModal(false);     setActiveRecipe(null) }

  const handleSave = async (data) => {
    if (activeRecipe) await onUpdate(activeRecipe.id, data)
    else              await onCreate(data)
    handleClose()
  }

  const handleDelete = async (id) => {
    await onDelete(id)
    handleClose()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PaperCard className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-camel-tobacco uppercase">Recetas</h2>
            <p className="text-sm text-camel-charcoal font-body mt-1">Tu recetario personal</p>
          </div>
          <RetroButton onClick={handleNew}>+ Nueva Receta</RetroButton>
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-camel-dust">
            <button
              onClick={() => setTagFilter(null)}
              className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wide border-2 transition-colors ${
                !tagFilter
                  ? 'bg-camel-tobacco text-camel-cream border-camel-tobacco'
                  : 'bg-transparent text-camel-tobacco border-camel-tobacco hover:bg-camel-dust'
              }`}
            >
              Todas
            </button>
            {allTags.map(tag => (
              <button key={tag}
                onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
                className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wide border-2 transition-colors ${
                  tagFilter === tag
                    ? 'bg-camel-tobacco text-camel-cream border-camel-tobacco'
                    : 'bg-transparent text-camel-tobacco border-camel-tobacco hover:bg-camel-dust'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </PaperCard>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={handleOpen} />
          ))}
        </div>
      ) : (
        <PaperCard>
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">
              {tagFilter
                ? `No hay recetas con el tag "${tagFilter}"`
                : 'No hay recetas aún. ¡Agrega la primera!'}
            </p>
          </div>
        </PaperCard>
      )}

      {showModal && (
        <RecipeModal
          recipe={activeRecipe}
          onSave={handleSave}
          onDelete={activeRecipe ? handleDelete : null}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
