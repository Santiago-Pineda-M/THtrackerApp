import React from 'react'
import { MainLayout } from '../../components/layouts/MainLayout'
import {
  ActivitiesList,
  CategoriesList,
  Calendar,
  ActionsRecordLogs,
  ListActiveActivityLogs,
} from '../../components'

export const ActivitiesPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Actividades' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <ActionsRecordLogs />
      <ListActiveActivityLogs />
      <Calendar />
      <ActivitiesList />
      <CategoriesList />
    </MainLayout>
  )
}

export default ActivitiesPage
