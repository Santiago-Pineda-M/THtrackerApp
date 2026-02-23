/**
 * INFRASTRUCTURE LAYER - React Hook
 * usePlocState: Vincula un Ploc con el ciclo de vida de React.
 * Se suscribe al Ploc al montar el componente y se desuscribe al desmontarlo.
 * Trigger: re-renderiza el componente automáticamente cuando el estado cambia.
 */
import { useEffect, useState } from 'react';
import { Ploc } from '../../Domain/Ploc';

export function usePlocState<S>(ploc: Ploc<S>): S {
    const [state, setState] = useState<S>(ploc.state);

    useEffect(() => {
        const listener = (newState: S) => setState(newState);
        ploc.subscribe(listener);

        return () => ploc.unsubscribe(listener);
    }, [ploc]);

    return state;
}
