import { useEffect } from 'react'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskListsState } from '../../../../../../Domain/IStates'
import { Card, Text } from '../../../../components'
import { TaskListCreateForm } from '../Forms/TaskListCreateForm'
import styles from './TaskSummaryWidget.module.scss'

export const TaskSummaryWidget: React.FC = () => {
  const { providerTaskListsPloc } = useDependencies()
  const taskListsState = usePlocState<ITaskListsState>(providerTaskListsPloc)

  useEffect(() => {
    providerTaskListsPloc.loadTaskLists()
  }, [providerTaskListsPloc])

  const isLoading = taskListsState.isLoading
  const hasErrors =
    taskListsState.errors && Object.keys(taskListsState.errors).length > 0
  const totalLists = taskListsState.taskLists?.items?.length ?? 0

  return (
    <Card
      h={1}
      w={2}
    >
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Text
            weight='bold'
            size='lg'
          >
            Resumen
          </Text>
        </div>
        <TaskListCreateForm />
      </div>

      <div>
        {/* Cargando */}
        {isLoading && <Text size='lg'>Cargando...</Text>}

        {/* Error */}
        {!isLoading && hasErrors && (
          <>
            <Text size='lg'>Error al cargar las listas de tareas</Text>
            <textarea
              readOnly
              value={JSON.stringify(taskListsState.errors!, null, 2)}
            />
          </>
        )}

        {/* Éxito / sin datos */}
        {!isLoading && !hasErrors && (
          <Text size='lg'>Número de Listas: {totalLists}</Text>
        )}
      </div>
    </Card>
  )
}
