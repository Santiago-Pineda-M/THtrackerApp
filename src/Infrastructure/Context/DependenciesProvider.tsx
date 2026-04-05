import React from 'react'
import { dependenciesLocator } from '../DI/DependenciesLocator'
import { DependenciesContext } from './useDependencies'

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DependenciesContext.Provider value={dependenciesLocator}>
      {children}
    </DependenciesContext.Provider>
  )
}
