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
        {!taskListsState.isLoading && !taskListsState.error && (
          <Text size='lg'>
            Numero de Listas: {taskListsState.taskLists.length}
          </Text>
        )}
        {taskListsState.isLoading && <Text size='lg'>Cargando...</Text>}
        {!taskListsState.isLoading && taskListsState.error && (
          <Text size='lg'>Error al cargar las listas de tareas</Text>
        )}
      </div>
    </Card>
  )
}
