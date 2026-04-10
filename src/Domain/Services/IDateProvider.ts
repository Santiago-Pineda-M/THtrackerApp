/**
 * DOMAIN LAYER - Interfaz para el manejo de fechas
 * Encapsula la lógica de parsing, formateo y obtención de tiempo actual.
 */

export interface IDateProvider {
  /**
   * Parsea una cadena ISO de la API asegurando que se trate como UTC
   * (Especialmente si falta el sufijo 'Z')
   */
  parse(isoString: string): Date

  /**
   * Formatea una fecha para mostrar solo la hora (ej: 14:30) en local
   */
  formatTime(date: Date): string

  /**
   * Formatea una fecha para mostrar el día (ej: 10/04/2024) en local
   */
  formatDate(date: Date): string

  /**
   * Obtiene la fecha y hora actual
   */
  now(): Date

  /**
   * Convierte una fecha a string ISO UTC
   */
  toISOString(date: Date): string
}
