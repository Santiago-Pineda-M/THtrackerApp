import { MainLayout } from '../../components/layouts'
import { TaskBoard, TaskSummaryWidget } from './components'

export const TaskListsPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Listas de Tareas' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <TaskSummaryWidget />
      <TaskBoard />
    </MainLayout>
  )
}
