import { MainLayout } from '../../components/layouts'
import { useParams } from 'react-router-dom'

export const TaskListDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const breadcrumbs = [{ label: 'Detalles de Lista de Tareas' }]

  if (!id) return <div>ID de lista no proporcionado</div>
  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <h1>Detalles de Lista de Tareas</h1>
      {/* card con descripción de la lista */}
      {/* card con resumen de cuantas tareas completadas pendientes y el btn para agregar nueva tarea */}
      {/* una card con la lista de tareas cada tarea tiene sus acciones de completar o eliminar o editar */}
    </MainLayout>
  )
}
