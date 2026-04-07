import React from 'react'
import { MainLayout } from '../../components/layouts/MainLayout'
import { ActivitiesList, CategoriesList, Calendar } from '../../components'

export const ActivitiesPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Actividades' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <Calendar />
      <ActivitiesList />
      <CategoriesList />
    </MainLayout>
  )
}

export default ActivitiesPage
