/**
 * DOMAIN LAYER - Entities
 * SidebarState: Entidad de dominio que representa el estado del Sidebar.
 * Se persistirá en localStorage para mantener el estado entre sesiones.
 */

export interface SidebarStateProps {
  isMenuOpen: boolean
}

/**
 * Entidad inmutable que encapsula el estado del Sidebar.
 */
export class SidebarState {
  private readonly _isMenuOpen: boolean

  private constructor(props: SidebarStateProps) {
    this._isMenuOpen = props.isMenuOpen
  }

  /**
   * Factory method que crea una SidebarState.
   */
  static create(props: SidebarStateProps): SidebarState {
    return new SidebarState({
      isMenuOpen: props.isMenuOpen,
    })
  }

  /**
   * Crea desde JSON persistido.
   */
  static fromJSON(json: string): SidebarState {
    try {
      const data = JSON.parse(json)
      return SidebarState.create({
        isMenuOpen: data.isMenuOpen ?? true,
      })
    } catch {
      // Si hay error, retornar estado por defecto
      return SidebarState.create({ isMenuOpen: true })
    }
  }

  /**
   * Crea el estado por defecto (menú abierto).
   */
  static default(): SidebarState {
    return SidebarState.create({ isMenuOpen: true })
  }

  get isMenuOpen(): boolean {
    return this._isMenuOpen
  }

  /**
   * Crea una nueva instancia con el estado del menú invertido.
   */
  toggle(): SidebarState {
    return SidebarState.create({
      isMenuOpen: !this._isMenuOpen,
    })
  }

  /**
   * Serializa a JSON para persistencia.
   */
  toJSON(): string {
    return JSON.stringify({
      isMenuOpen: this._isMenuOpen,
    })
  }
}
