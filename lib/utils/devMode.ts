/**
 * Development mode utilities
 * Used to toggle between real data and mock data for testing
 */

export const isDevMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEV_MODE === 'true'
}

export const getCurrentYears = (): string[] => {
  const currentYear = new Date().getFullYear()
  return [
    String(currentYear - 3),
    String(currentYear - 2),
    String(currentYear - 1),
    String(currentYear),
  ]
}
