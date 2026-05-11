import { useEffect, useState, useCallback } from 'react'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskListsState } from '../../../../../../Domain/IStates'
import { TaskList } from '../TaskList/TaskList'
import { Spinner, Text } from '../../../../components' // asumo que tienes estos
// import styles from './TaskBoard.module.scss' // opcional

export const TaskBoard: React.FC = () => {
  const { providerTaskListsPloc } = useDependencies()
  const taskListsState = usePlocState<ITaskListsState>(providerTaskListsPloc)
  const [expandedListId, setExpandedListId] = useState<string | null>(null)

  useEffect(() => {
    // Solo cargar si no hay datos y no está cargando/erróneo
    if (
      !taskListsState.taskLists &&
      !taskListsState.isLoading &&
      !taskListsState.errors
    ) {
      providerTaskListsPloc.loadTaskLists()
    }
  }, [
    providerTaskListsPloc,
    taskListsState.taskLists,
    taskListsState.isLoading,
    taskListsState.errors,
  ])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedListId((prev) => (prev === id ? null : id))
  }, [])

  // 1. Cargando
  if (taskListsState.isLoading) {
    return <Spinner size='lg' />
  }

  // 2. Error (con verificación real de keys)
  const hasErrors =
    taskListsState.errors && Object.keys(taskListsState.errors).length > 0
  if (hasErrors) {
    return (
      <div>
        <Text color='danger'>No se pudieron cargar las listas</Text>
      </div>
    )
  }

  // 3. Sin datos (y sin error)
  const items = taskListsState.taskLists?.items ?? []
  if (items.length === 0) {
    return <Text>No hay listas de tareas</Text>
  }

  return (
    <>
      {items.map((taskList) => {
        // Asegurar un id único; usa un fallback con el índice si no existe (solo si es estable)
        const safeId = taskList.id ?? ''
        // Si safeId está vacío, mejor no renderizar o usar otro identificador
        if (!safeId) {
          console.warn('TaskList sin ID:', taskList)
          return null // O un fallback más elegante
        }
        return (
          <TaskList
            key={safeId}
            taskList={taskList}
            isExpanded={expandedListId === safeId}
            onToggleExpand={() => handleToggleExpand(safeId)}
          />
        )
      })}
    </>
  )
}
