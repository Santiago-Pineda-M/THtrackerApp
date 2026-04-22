/**
 * INFRASTRUCTURE LAYER - Implementación del DateProvider
 * Maneja la lógica específica de parsing de la API para corregir desfases UTC-Local.
 */

import type { IDateProvider } from '../../../Domain'

export class DateProvider implements IDateProvider {
  /**
   * Asegura que el string ISO de la API se trate como UTC antes de crear el objeto Date.
   * Si no termina en 'Z' ni tiene offset, se le añade automáticamente 'Z'.
   */
  parse(isoString: string): Date {
    if (!isoString) return new Date()

    const hasTimezone =
      isoString.endsWith('Z') ||
      isoString.includes('+') ||
      (isoString.split('T')[1]?.includes('-') ?? false)

    const normalizedString = hasTimezone ? isoString : `${isoString}Z`
    return new Date(normalizedString)
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString()
  }

  now(): Date {
    return new Date()
  }

  toISOString(date: Date): string {
    return date.toISOString()
  }
}
