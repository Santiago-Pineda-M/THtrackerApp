import React from 'react'
import { MainLayout } from '../../components/layouts/MainLayout'
import { CategoriesList } from '../../components'

export const CategoriesPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Categorías' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <CategoriesList />
    </MainLayout>
  )
}
