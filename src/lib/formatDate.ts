export function formatDate(date: Date | undefined): string {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export function parseDateFromString(value: string): Date | null {
  const [day, month, year] = value.split("-")
  if (!day || !month || !year) return null

  const parsed = new Date(`${year}-${month}-${day}`)
  const isValid =
    parsed instanceof Date &&
    !isNaN(parsed.getTime()) &&
    parsed.getDate() === Number(day) &&
    parsed.getMonth() + 1 === Number(month) &&
    parsed.getFullYear() === Number(year)

  return isValid ? parsed : null
}
export function isValidDate(value: string): boolean {
  const date = parseDateFromString(value)
  return date !== null && !isNaN(date.getTime())
}