// componente que consulta las listas de tareas y muestra un tablero con las tareas organizadas por listas
import { useEffect } from 'react'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskListsState } from '../../../../../../Domain/IStates'

import { Text, Card } from '../../../../components'

export const TaskBoard: React.FC = () => {
  const { providerTaskListsPloc } = useDependencies()
  const taskListsState = usePlocState<ITaskListsState>(providerTaskListsPloc)
  // cargar las listas de tareas al montar el componente
  useEffect(() => {
    providerTaskListsPloc.loadTaskLists()
  }, [providerTaskListsPloc])

  if (taskListsState.isLoading) {
    return <div>Cargando listas de tareas...</div>
  }

  if (taskListsState.error) {
    return <div>Error al cargar las listas de tareas</div>
  }

  return (
    <>
      {taskListsState.taskLists.map((taskList) => (
        <Card key={taskList.id}>
          <Text>{taskList.name}</Text>
          {/* Aquí se podrían renderizar las tareas de cada lista */}
        </Card>
      ))}
    </>
  )
}
