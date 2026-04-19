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

export interface ITaskListCreatedEvent {
  type: 'TASK_LIST_CREATED'
  payload: { id: string; name: string; createdAt: string }
}
export interface ITaskListUpdatedEvent {
  type: 'TASK_LIST_UPDATED'
  payload: { id: string; name: string; updatedAt: string }
}
export interface ITaskListDeletedEvent {
  type: 'TASK_LIST_DELETED'
  payload: { id: string }
}
export interface ITaskCreatedEvent {
  type: 'TASK_CREATED'
  payload: { id: string; taskListId: string; title: string; createdAt: string }
}
export interface ITaskUpdatedEvent {
  type: 'TASK_UPDATED'
  payload: { id: string; updatedAt: string }
}
export interface ITaskDeletedEvent {
  type: 'TASK_DELETED'
  payload: { id: string; taskListId: string }
}
export interface ITaskToggledEvent {
  type: 'TASK_TOGGLED'
  payload: { id: string; isCompleted: boolean }
}
export type TaskListDomainEvent =
  | ITaskListCreatedEvent
  | ITaskListUpdatedEvent
  | ITaskListDeletedEvent
  | ITaskCreatedEvent
  | ITaskUpdatedEvent
  | ITaskDeletedEvent
  | ITaskToggledEvent
