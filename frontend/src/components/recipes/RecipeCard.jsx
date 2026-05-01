export default function RecipeCard({ recipe, onOpen }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

  return (
    <div
      className="burned-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onOpen(recipe)}
    >
      <h4 className="font-display font-bold text-xl text-camel-charcoal mb-2 leading-tight">
        {recipe.title}
      </h4>

      {recipe.description && (
        <p className="text-sm font-body text-camel-tobacco mb-3 line-clamp-2">{recipe.description}</p>
      )}

      {recipe.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {recipe.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 text-xs font-body bg-camel-sand/30 border border-camel-sand text-camel-tobacco">
              {t}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-body text-camel-dust">+{recipe.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex gap-4 text-xs font-mono text-camel-tobacco">
        {totalTime > 0 && <span>⏱ {totalTime} min</span>}
        {recipe.servings  && <span>🍽 {recipe.servings} porciones</span>}
        <span className="ml-auto text-camel-dust">
          {(recipe.ingredients || []).length} ingredientes
        </span>
      </div>
    </div>
  )
}
