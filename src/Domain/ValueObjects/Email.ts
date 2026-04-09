/**
 * DOMAIN LAYER - Value Objects
 * Email: Value Object que representa un email válido.
 * No permite emails inválidos en el dominio.
 */

export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Factory method que crea un Email validado.
   * @throws Error si el email no es válido
   */
  static create(email: string): Email {
    const trimmed = email.trim().toLowerCase()

    if (!trimmed) {
      throw new Error('El email no puede estar vacío')
    }

    // Validación básica de formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      throw new Error('Formato de email inválido')
    }

    return new Email(trimmed)
  }

  /**
   * Crea un Email desde un string sin validar (para casos donde ya se validó).
   * Útil para deserialización desde DB/API.
   */
  static fromString(email: string): Email {
    return new Email(email.toLowerCase().trim())
  }

  /**
   * Retorna el valor del email
   */
  toString(): string {
    return this.value
  }

  /**
   * Compara dos emails
   */
  equals(other: Email): boolean {
    return this.value === other.value
  }
}
