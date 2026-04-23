import { MainLayout } from '../../components/layouts'
import { TaskBoard } from './components'
import { TaskSummaryWidget } from './components'

export const TaskListsPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Listas de Tareas' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      {/* card con controles para buscar tarea o lista y filtrarla */}
      <TaskSummaryWidget />
      <TaskBoard />
    </MainLayout>
  )
}
