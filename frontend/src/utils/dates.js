import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export const formatDateShort = (date) => {
  return formatDate(date, 'MMM dd')
}

export const formatDateLong = (date) => {
  return formatDate(date, 'MMMM dd, yyyy')
}

export const isDateToday = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isToday(dateObj)
}

export const isDateThisWeek = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isThisWeek(dateObj)
}

export const isDateThisMonth = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isThisMonth(dateObj)
}

export const getCurrentMonthYear = () => {
  const now = new Date()
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
}

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1]
}
