import { createContext, useContext } from 'react'
import type { Dependencies } from '../DI/DependenciesLocator'

export const DependenciesContext = createContext<Dependencies | null>(null)

export const useDependencies = (): Dependencies => {
  const context = useContext(DependenciesContext)
  if (!context) {
    throw new Error('useDependencies must be used within DependenciesProvider')
  }
  return context
}
