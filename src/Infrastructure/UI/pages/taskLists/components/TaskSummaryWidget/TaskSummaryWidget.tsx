import { useEffect } from 'react'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskListsState } from '../../../../../../Domain/IStates'

import { Card, Text } from '../../../../components'
import { TaskListCreateForm } from '../Forms/TaskListCreateForm'
export const TaskSummaryWidget: React.FC = () => {
  const { providerTaskListsPloc } = useDependencies()
  const taskListsState = usePlocState<ITaskListsState>(providerTaskListsPloc)

  useEffect(() => {
    providerTaskListsPloc.loadTaskLists()
  }, [providerTaskListsPloc])

  return (
    <Card>
      <Text>{taskListsState.taskLists.length} listas de tareas</Text>
      <TaskListCreateForm />
    </Card>
  )
}
