import { useState, useEffect } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import DesertDivider from '../components/ui/DesertDivider'

export default function Settings() {
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    icon: '💰',
    color: '#D4A957',
  })

  const { categories, fetchCategories, createCategory } = useFinanceStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = async (e) => {
    e.preventDefault()

    try {
      await createCategory(newCategory)
      setNewCategory({
        name: '',
        type: 'expense',
        icon: '💰',
        color: '#D4A957',
      })
      setShowCategoryForm(false)
      fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Error creating category')
    }
  }

  const incomeCategories = categories.filter((c) => c.type === 'income')
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

      {/* Categories Management */}
      <PaperCard>
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-bold text-xl text-camel-tobacco uppercase">
            Categories
          </h4>
          <RetroButton
            size="sm"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            {showCategoryForm ? 'Cancel' : '+ New Category'}
          </RetroButton>
        </div>

        {/* Category Form */}
        {showCategoryForm && (
          <form onSubmit={handleCreateCategory} className="mb-6 p-4 bg-camel-cream" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body" style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">
                  Type
                </label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body" style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-camel-tobacco font-body" style={{ borderRadius: 'var(--radius-md)' }}
                  maxLength="2"
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-camel-charcoal mb-2 text-sm">
                  Color
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border-2 border-camel-tobacco rounded"
                />
              </div>
            </div>

            <RetroButton type="submit" size="sm" className="mt-4">
              Create Category
            </RetroButton>
          </form>
        )}

        {/* Income Categories */}
        <div className="mb-6">
          <h5 className="font-display font-bold text-lg text-income-color mb-3">
            Income Categories
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 bg-camel-cream border border-camel-dust flex items-center gap-2" style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-body text-sm text-camel-charcoal">{cat.name}</span>
                <div
                  className="ml-auto w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <DesertDivider />

        {/* Expense Categories */}
        <div>
          <h5 className="font-display font-bold text-lg text-expense-color mb-3">
            Expense Categories
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 bg-camel-cream border border-camel-dust flex items-center gap-2" style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-body text-sm text-camel-charcoal">{cat.name}</span>
                <div
                  className="ml-auto w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </PaperCard>
    </div>
  )
}
