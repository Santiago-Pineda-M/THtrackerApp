import React from 'react'
import {
  ActivitiesList,
  Calendar,
  ActionsRecordLogs,
  ListActiveActivityLogs,
} from './components'
import { CategoriesList } from '../categories/components'
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
