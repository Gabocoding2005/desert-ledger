export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const parseCurrency = (value) => {
  const cleaned = value.replace(/[^0-9.-]+/g, '')
  return parseFloat(cleaned) || 0
}
