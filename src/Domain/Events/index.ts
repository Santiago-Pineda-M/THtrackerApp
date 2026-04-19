/**
 * DOMAIN LAYER - Domain Events
 * Sistema de eventos para efectos en cascada.
 */

export type EventHandler<T = unknown> = (event: T) => void | Promise<void>

export interface DomainEvent<T = unknown> {
  type: string
  payload: T
  timestamp: Date
  correlationId?: string
}

export class EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  on<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler as EventHandler)

    return () => this.off(eventType, handler)
  }

  off<T>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.delete(handler as EventHandler)
    }
  }

  async emit<T>(event: DomainEvent<T>): Promise<void> {
    const handlers = this.handlers.get(event.type)
    if (!handlers) return

    const promises = Array.from(handlers).map((handler) =>
      handler(event.payload)
    )
    await Promise.all(promises)
  }

  clear(): void {
    this.handlers.clear()
  }
}

export const globalEventEmitter = new EventEmitter()
