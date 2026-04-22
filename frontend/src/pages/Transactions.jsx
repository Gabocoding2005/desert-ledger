import { useState } from 'react'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import TransactionRow from '../components/finance/TransactionRow'
import TransactionModal from '../components/finance/TransactionModal'

export default function Transactions({ transactions, categories, onCreate, onUpdate, onDelete }) {
  const [showModal, setShowModal]   = useState(false)
  const [editingTx, setEditingTx]   = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')

  const handleEdit = (tx) => { setEditingTx(tx); setShowModal(true) }

  const handleDelete = async (id) => {
    if (confirm('Delete this transaction?')) await onDelete(id)
  }

  const handleSave = async (data) => {
    if (editingTx) await onUpdate(editingTx.id, data)
    else           await onCreate(data)
    setShowModal(false)
    setEditingTx(null)
  }

  const filtered = transactions.filter((t) =>
    typeFilter === 'all' || t.type === typeFilter
  )

  return (
    <div className="max-w-5xl mx-auto">
      <PaperCard>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { id: 'all',     label: 'All',      active: 'bg-camel-sand text-camel-charcoal' },
              { id: 'income',  label: 'Income',   active: 'bg-income-color text-white'         },
              { id: 'expense', label: 'Expenses', active: 'bg-expense-color text-white'        },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={`px-4 py-2 font-body font-semibold border-2 border-camel-tobacco transition-colors ${
                  typeFilter === f.id ? f.active : 'bg-camel-cream text-camel-tobacco'
                }`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <RetroButton onClick={() => setShowModal(true)}>+ New Transaction</RetroButton>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-1">
            {filtered.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">No transactions found</p>
          </div>
        )}
      </PaperCard>

      {showModal && (
        <TransactionModal
          transaction={editingTx}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTx(null) }}
        />
      )}
    </div>
  )
}
