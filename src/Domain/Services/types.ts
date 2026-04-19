/**
 * DOMAIN LAYER - Validation Types
 * Tipos compartilhados entre validadores.
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult<T> {
  valid: boolean
  value?: T
  errors?: ValidationError[]
}
