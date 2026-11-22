export const STORAGE_KEY = 'r54-t049.tasks'
export const STORAGE_VERSION = 1

export function visibleTasks(tasks, filter) {
  if (filter === 'completed') return tasks.filter((task) => task.completed)
  if (filter === 'active') return tasks.filter((task) => !task.completed)
  return tasks
}

export function parseStoredTasks(raw) {
  if (raw === null) return { tasks: [], corrupt: false }
  try {
    const parsed = JSON.parse(raw)
    const valid = parsed?.version === STORAGE_VERSION && Array.isArray(parsed.tasks) && parsed.tasks.every(
      (task) => typeof task.id === 'string' && typeof task.label === 'string' && typeof task.completed === 'boolean',
    )
    return valid ? { tasks: parsed.tasks, corrupt: false } : { tasks: [], corrupt: true }
  } catch {
    return { tasks: [], corrupt: true }
  }
}

export function serializeTasks(tasks) {
  return JSON.stringify({ version: STORAGE_VERSION, tasks })
}
