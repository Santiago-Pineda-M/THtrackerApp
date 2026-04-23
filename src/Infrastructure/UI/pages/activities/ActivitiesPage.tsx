import React from 'react'
import {
  ActivitiesList,
  Calendar,
  ActionsRecordLogs,
  ListActiveActivityLogs,
  CategoriesList,
} from './components'
import { MainLayout } from '../../components/layouts'

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
