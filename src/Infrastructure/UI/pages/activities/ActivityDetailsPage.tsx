import React from 'react'
import { useParams } from 'react-router-dom'
import {
  ActivityGeneralInfo,
  ActivityProperties,
  ActivityLogs,
} from './components'
import { MainLayout } from '../../components/layouts'

export const ActivityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const breadcrumbs = [
    { label: 'Actividades', path: '/activities' },
    { label: 'Detalles' },
  ]

  if (!id) return <div>ID de actividad no proporcionado</div>

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <ActivityGeneralInfo activityId={id} />
      <ActivityProperties activityId={id} />
      <ActivityLogs activityId={id} />
    </MainLayout>
  )
}

export default ActivityDetailsPage
