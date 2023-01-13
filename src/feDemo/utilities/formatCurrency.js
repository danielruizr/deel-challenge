export const formatCurrency = (value, format = 'en-US') => {
  if (value === '' || value === undefined) {
    return value
  }
  
  const stringValue = String(value)
  
  if (!stringValue.match(/\d/g)) {
    return ''
  }
  
  const removeComma = stringValue.replace(/,/g, '')
  const hasDecimal = removeComma.match(/\./)
  const [int, decimals] = removeComma.split('.')
  
  const formattedInt = new Intl.NumberFormat(format, {
    currency: 'USD',
    style: 'currency',
  }).format(Number(int) || Number(removeComma))
  
  if (!int || !hasDecimal) {
    return formattedInt
  }
  return decimals
    ? new Intl.NumberFormat(format, {
      currency: 'USD',
      style: 'currency',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Number(`${int || removeComma}.${decimals}`))
    : `${formattedInt}.`
}

export const formatNumberInput = (value) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  