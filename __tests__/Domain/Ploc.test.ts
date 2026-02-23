import { describe, it, expect, vi } from 'vitest';
import { Ploc } from '../../src/Domain/Ploc';

/**
 * TEST - Domain Layer
 * Ploc (clase base Observer): Verifica el patrón Observer puro.
 */

// Subclase concreta para testear la clase abstracta
class ConcreteTestPloc extends Ploc<{ count: number }> {
    constructor() {
        super({ count: 0 });
    }
    increment() {
        this.changeState({ count: this.state.count + 1 });
    }
    setCount(n: number) {
        this.changeState({ count: n });
    }
}

describe('Ploc (Domain base class)', () => {
    it('should hold the initial state', () => {
        const ploc = new ConcreteTestPloc();
        expect(ploc.state).toEqual({ count: 0 });
    });

    it('should update state via changeState', () => {
        const ploc = new ConcreteTestPloc();
        ploc.increment();
        expect(ploc.state.count).toBe(1);
    });

    it('should notify all subscribers on state change', () => {
        const ploc = new ConcreteTestPloc();
        const listenerA = vi.fn();
        const listenerB = vi.fn();

        ploc.subscribe(listenerA);
        ploc.subscribe(listenerB);
        ploc.setCount(42);

        expect(listenerA).toHaveBeenCalledOnce();
        expect(listenerA).toHaveBeenCalledWith({ count: 42 });
        expect(listenerB).toHaveBeenCalledOnce();
    });

    it('should stop notifying after unsubscribe', () => {
        const ploc = new ConcreteTestPloc();
        const listener = vi.fn();

        ploc.subscribe(listener);
        ploc.unsubscribe(listener);
        ploc.increment();

        expect(listener).not.toHaveBeenCalled();
    });

    it('should support multiple subscribe/unsubscribe cycles', () => {
        const ploc = new ConcreteTestPloc();
        const listener = vi.fn();

        ploc.subscribe(listener);
        ploc.increment(); // call 1
        ploc.unsubscribe(listener);
        ploc.increment(); // should NOT call listener
        ploc.subscribe(listener);
        ploc.increment(); // call 2

        expect(listener).toHaveBeenCalledTimes(2);
    });
});
