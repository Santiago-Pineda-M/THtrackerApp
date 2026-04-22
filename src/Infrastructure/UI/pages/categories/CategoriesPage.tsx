import React from 'react'
import { CategoriesList } from './components'
import { MainLayout } from '../../components/layouts'

export const CategoriesPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Categorías' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <CategoriesList />
    </MainLayout>
  )
}

export default CategoriesPage
