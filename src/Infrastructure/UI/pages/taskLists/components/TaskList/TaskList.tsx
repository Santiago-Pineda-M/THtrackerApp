import { useMemo, useEffect, useRef, useState } from 'react'
import type {
  ITaskItem,
  ITaskListItem,
  ITasksState,
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
import styles from './TaskList.module.css'

// ---------------------------------------------------------------------------
// TaskListItem
// ---------------------------------------------------------------------------

interface TaskListItemProps {
  task: ITaskItem
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
  taskList: ITaskListItem
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

  const tasksPloc = useMemo(() => createTasksPloc(), [createTasksPloc])
  const taskTogglePloc = useMemo(
    () => createTaskTogglePloc(),
    [createTaskTogglePloc]
  )

  const state = usePlocState<ITasksState>(tasksPloc)

  const isMountedRef = useRef(true)
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    tasksPloc.loadTasks(taskList.id)
  }, [taskList.id, tasksPloc])

  const handleToggleTask = async (taskId: string) => {
    try {
      await taskTogglePloc.toggle(taskId)
      if (isMountedRef.current) {
        await tasksPloc.loadTasks(taskList.id)
      }
    } catch {
      // El PLOC expone el error en su estado; no se necesita manejo adicional aquí
    }
  }

  const handleListActionSuccess = () => {
    providerTaskListsPloc.loadTaskLists()
  }

  // ✅ Sin mutación del array original, memoizado
  const sortedTasks = useMemo(
    () =>
      [...(state.tasks ?? [])].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
        return b.content.localeCompare(a.content)
      }),
    [state.tasks]
  )

  const totalCount = sortedTasks.length
  const completedCount = useMemo(
    () => sortedTasks.filter((t) => t.isCompleted).length,
    [sortedTasks]
  )
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const visibleTasks = isExpanded ? sortedTasks : sortedTasks.slice(0, 3)
  const hiddenCount = isExpanded ? 0 : sortedTasks.length - visibleTasks.length

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
      style={{
        zIndex: isExpanded ? 20 : 1,
        viewTransitionName: `task-list-${taskList.id}`,
      }}
    >
      {/* Header */}
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

      {/* Descripción */}
      {isExpanded && taskList.description && (
        <Text
          muted
          size='sm'
          className={styles.description}
        >
          {taskList.description}
        </Text>
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

        {!state.isLoading && state.error && (
          <Text
            size='xs'
            className={styles.errorText}
          >
            Error al cargar las tareas
          </Text>
        )}

        {!state.isLoading && !state.error && sortedTasks.length === 0 && (
          <Text
            size='xs'
            muted
          >
            No hay tareas
          </Text>
        )}

        {!state.isLoading &&
          !state.error &&
          visibleTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              isExpanded={isExpanded}
              onToggle={() => handleToggleTask(task.id)}
              onReload={() => tasksPloc.loadTasks(taskList.id)}
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
          taskListId={taskList.id}
          onSuccess={() => tasksPloc.loadTasks(taskList.id)}
        />
      </div>
    </Card>
  )
}
