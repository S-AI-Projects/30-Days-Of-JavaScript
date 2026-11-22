export const characters = [
  { id: 'c10', name: 'Mira 10', score: 10 },
  { id: 'c2', name: 'Mira 2', score: 2 },
  { id: 'r11', name: 'Ravi 11', score: 11 },
]

export function selectCharacters(records, query, sortByScore) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const selected = records.filter((record) => record.name.toLocaleLowerCase().includes(normalizedQuery))
  return sortByScore
    ? selected.toSorted((left, right) => left.score - right.score || left.id.localeCompare(right.id))
    : selected
}
