/**
 * DOMAIN LAYER - Value Objects
 * UserId: Value Object que representa un ID de usuario válido.
 * Usa UUID como tipo base.
 */

export class UserId {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Factory method que crea un UserId validado.
   * @throws Error si el ID no es válido
   */
  static create(id: string): UserId {
    const trimmed = id.trim()

    if (!trimmed) {
      throw new Error('El ID de usuario no puede estar vacío')
    }

    // Validación básica de UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(trimmed)) {
      throw new Error('El ID de usuario debe ser un UUID válido')
    }

    return new UserId(trimmed)
  }

  /**
   * Crea un UserId desde un string sin validar (para datos de API/DB).
   * Útil cuando la validación ya ocurrió en la capa de infraestructura.
   */
  static fromString(id: string): UserId {
    return new UserId(id.trim())
  }

  /**
   * Retorna el valor del ID
   */
  toString(): string {
    return this.value
  }

  /**
   * Compara dos UserIds
   */
  equals(other: UserId): boolean {
    return this.value === other.value
  }
}
