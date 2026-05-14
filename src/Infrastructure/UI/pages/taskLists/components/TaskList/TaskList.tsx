import { useEffect, useState, useMemo, useCallback } from 'react'
import type {
  ITasksState,
  ApiTasksTypes,
  ApiTaskListsTypes,
} from '../../../../../../Domain'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import {
  TaskCreateForm,
  TaskDelete,
  TaskEditForm,
  TaskListEditForm,
  TaskListDelete,
} from '../Forms'
import {
  Text,
  Card,
  Divider,
  Button,
  ProgressBar,
  Badge,
  Icon,
  Spinner,
} from '../../../../components'
import styles from './TaskList.module.scss'

// ---------------------------------------------------------------------------
// TaskListItem (la lista de tareas tiene un color, aplicar ese color badge )
// ---------------------------------------------------------------------------

interface TaskListItemProps {
  task: ApiTasksTypes['TaskResponse']
  isExpanded: boolean
  onToggle: () => Promise<void>
  onReload: () => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  isExpanded,
  onToggle,
  onReload,
}) => {
  const [isToggleLoading, setIsToggleLoading] = useState(false)

  const handleTaskToggle = async () => {
    if (isToggleLoading) return
    setIsToggleLoading(true)
    try {
      await onToggle()
    } finally {
      setIsToggleLoading(false)
    }
  }

  const taskItemClass = [
    styles.taskItem,
    task.isCompleted ? styles.taskItemCompleted : '',
  ]
    .filter(Boolean)
    .join(' ')

  const taskTextClass = [
    styles.taskText,
    task.isCompleted ? styles.taskTextCompleted : '',
    isExpanded ? styles.taskTextVisible : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={taskItemClass}>
      <div className={styles.taskItemContent}>
        <Text
          size='sm'
          className={taskTextClass}
        >
          {task.content}
        </Text>
      </div>

      <div className={styles.taskActions}>
        {isExpanded && (
          <>
            <TaskEditForm
              task={task}
              onSuccess={onReload}
            />
            <TaskDelete
              task={task}
              onSuccess={onReload}
            />
          </>
        )}
        <button
          onClick={handleTaskToggle}
          disabled={isToggleLoading}
          className={styles.toggleButton}
          aria-label={
            task.isCompleted ? 'Marcar como pendiente' : 'Completar tarea'
          }
        >
          {isToggleLoading ? (
            <Spinner size='sm' />
          ) : (
            <Icon
              name={task.isCompleted ? 'Check' : 'Circle'}
              size={16}
            />
          )}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TaskList
// ---------------------------------------------------------------------------

interface TaskListProps {
  taskList: ApiTaskListsTypes['TaskListResponse']
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export const TaskList: React.FC<TaskListProps> = ({
  taskList,
  isExpanded = false,
  onToggleExpand,
}) => {
  const { createTasksPloc, createTaskTogglePloc, providerTaskListsPloc } =
    useDependencies()

  // -------------------------------
  // Plocs estables sin usar ref.current en render
  // -------------------------------
  const [tasksPloc] = useState(() => createTasksPloc())
  const [taskTogglePloc] = useState(() => createTaskTogglePloc())

  const state = usePlocState<ITasksState>(tasksPloc)

  // Todos los hooks deben estar aquí, antes de cualquier early return
  const hasId = !!taskList.id

  useEffect(() => {
    if (hasId) {
      tasksPloc.loadTasks(taskList.id!)
    }
  }, [hasId, taskList.id, tasksPloc])

  const handleToggleTask = useCallback(
    async (taskId: string) => {
      try {
        await taskTogglePloc.toggle(taskId)
        await tasksPloc.loadTasks(taskList.id!)
      } catch {
        // El PLOC expone el error en su estado
      }
    },
    [taskTogglePloc, tasksPloc, taskList.id]
  )

  const handleListActionSuccess = useCallback(() => {
    providerTaskListsPloc.loadTaskLists()
  }, [providerTaskListsPloc])

  // Memoizamos después de todos los hooks
  const sortedTasks = useMemo(() => {
    const items = state.tasks?.items ?? []
    return [...items].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
      if (a.createdAt && b.createdAt)
        return b.createdAt.localeCompare(a.createdAt)
      return 0
    })
  }, [state.tasks?.items])

  const totalCount = sortedTasks.length
  const completedCount = useMemo(
    () => sortedTasks.filter((t) => t.isCompleted).length,
    [sortedTasks]
  )
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const visibleTasks = isExpanded ? sortedTasks : sortedTasks.slice(0, 3)
  const hiddenCount = isExpanded ? 0 : sortedTasks.length - visibleTasks.length

  const hasErrors = state.errors && Object.keys(state.errors).length > 0

  // Ahora el early return es legal, después de todos los hooks
  if (!hasId) return null

  const cardClass = [
    styles.cardContainer,
    isExpanded ? styles.expandedCard : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Card
      h={isExpanded ? 4 : 2}
      w={isExpanded ? 3 : 2}
      className={cardClass}
      style={{ zIndex: isExpanded ? 20 : 1 }}
    >
      {/* Header */}
      <>
        {/* un div que pinta la esqquina superior isquierda de la card de el color de la lista */}
        <div
          className={styles.headerTopLeftCorner}
          style={{ backgroundColor: taskList.color ?? '' }}
        />
        <div className={styles.cardHeader}>
          <div className={styles.headerTitle}>
            <Text
              as='h3'
              size='lg'
              weight='bold'
            >
              {taskList.name}
            </Text>
            {isExpanded && (
              <Badge variant={progress === 100 ? 'success' : 'info'}>
                {completedCount}/{totalCount} Tareas
              </Badge>
            )}
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onToggleExpand}
          >
            <Icon
              name={isExpanded ? 'Minimize' : 'Maximize'}
              size={16}
            />
          </Button>
        </div>

        {/* Barra de progreso */}
        {isExpanded && (
          <div className={styles.progressWrapper}>
            <ProgressBar
              value={progress}
              label={`${progress}% completado`}
              variant={progress === 100 ? 'success' : 'default'}
            />
          </div>
        )}

        <Divider className={styles.dividerTop} />

        {/* Lista de tareas */}
        <div className={styles.taskListContainer}>
          {state.isLoading && (
            <Text
              size='xs'
              muted
            >
              Cargando...
            </Text>
          )}

          {!state.isLoading && hasErrors && (
            <Text
              size='xs'
              className={styles.errorText}
            >
              Error al cargar las tareas
            </Text>
          )}

          {!state.isLoading && !hasErrors && sortedTasks.length === 0 && (
            <Text
              size='xs'
              muted
            >
              No hay tareas
            </Text>
          )}

          {!state.isLoading &&
            !hasErrors &&
            visibleTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                isExpanded={isExpanded}
                onToggle={() => handleToggleTask(task.id!)}
                onReload={() => tasksPloc.loadTasks(taskList.id!)}
              />
            ))}

          {hiddenCount > 0 && (
            <Text
              size='xs'
              muted
            >
              + {hiddenCount} más...
            </Text>
          )}
        </div>

        <Divider className={styles.dividerBottom} />

        {/* Footer */}
        <div className={styles.footer}>
          {!isExpanded && (
            <Badge variant={progress === 100 ? 'success' : 'info'}>
              {completedCount}/{totalCount} Tareas
            </Badge>
          )}
          {isExpanded && (
            <div className={styles.footerActions}>
              <TaskListEditForm
                taskList={taskList}
                onSuccess={handleListActionSuccess}
              />
              <TaskListDelete
                taskList={taskList}
                onSuccess={handleListActionSuccess}
              />
            </div>
          )}
          <TaskCreateForm
            taskListId={taskList.id!}
            onSuccess={() => tasksPloc.loadTasks(taskList.id!)}
          />
        </div>
      </>
    </Card>
  )
}
