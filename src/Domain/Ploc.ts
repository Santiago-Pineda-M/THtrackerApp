/**
 * DOMAIN LAYER - Ploc (Base)
 * Clase abstracta que implementa el Patrón Observer para la gestión del estado.
 * No tiene dependencias de React ni de ninguna librería externa.
 * Todas las clases de la capa Controllers extienden de esta.
 */
type Subscription<S> = (state: S) => void;

export abstract class Ploc<S> {
  private internalState: S;
  private listeners: Subscription<S>[] = [];

  constructor(initialState: S) {
    this.internalState = initialState;
  }

  public get state(): S {
    return this.internalState;
  }

  protected changeState(state: S) {
    this.internalState = state;
    this.listeners.forEach((listener) => listener(this.state));
  }

  public subscribe(listener: Subscription<S>) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: Subscription<S>) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}
