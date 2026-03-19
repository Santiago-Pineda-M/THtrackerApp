import { useEffect, useState } from 'react'
import { Ploc } from '../../Domain/Ploc'

export function usePlocState<S>(ploc: Ploc<S>) {
  const [state, setState] = useState(ploc.state)

  useEffect(() => {
    const stateSubscription = async (state: S) => {
      setState(state)
    }
    ploc.subscribe(stateSubscription)

    return () => ploc.unsubscribe(stateSubscription)
  }, [ploc])
  return state
}
