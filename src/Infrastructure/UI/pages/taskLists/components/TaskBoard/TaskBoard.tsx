import { useEffect, useState, useCallback } from 'react'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskListsState } from '../../../../../../Domain/IStates'
import { TaskList } from '../TaskList/TaskList'

export const TaskBoard: React.FC = () => {
  const { providerTaskListsPloc } = useDependencies()
  const taskListsState = usePlocState<ITaskListsState>(providerTaskListsPloc)
  const [expandedListId, setExpandedListId] = useState<string | null>(null)

  useEffect(() => {
    providerTaskListsPloc.loadTaskLists()
  }, [providerTaskListsPloc])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedListId((prev) => (prev === id ? null : id))
  }, [])

  if (taskListsState.isLoading) {
    return null
  }

  if (taskListsState.error) {
    return null
  }

  return (
    <>
      {taskListsState.taskLists.map((taskList) => (
        <TaskList
          key={taskList.id}
          taskList={taskList}
          isExpanded={expandedListId === taskList.id}
          onToggleExpand={() => handleToggleExpand(taskList.id)}
        />
      ))}
    </>
  )
}
