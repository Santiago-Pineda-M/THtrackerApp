import {
  GetTaskListsUseCase,
  GetTaskListByIdUseCase,
  CreateTaskListUseCase,
  UpdateTaskListUseCase,
  DeleteTaskListUseCase,
} from '../../../Application/UseCases/TaskList'
import {
  GetTasksByListUseCase,
  GetTaskByIdUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  ToggleTaskUseCase,
} from '../../../Application/UseCases/Task'
import {
  TaskListsPloc,
  TaskListDetailPloc,
  TaskListCreateFormPloc,
  TaskListEditFormPloc,
  TaskListDeletePloc,
  TasksPloc,
  TaskCreateFormPloc,
  TaskEditFormPloc,
  TaskDeletePloc,
  TaskTogglePloc,
} from '../../../Controllers/TaskList'
import { TaskListService } from '../../../Application/Services/TaskList/TaskListService'
import { TaskService } from '../../../Application/Services/Task/TaskService'
import { httpClient } from '../core/http.config'

// ── Services (Singletons) ──────────────────────────────────────────────────────

let _taskListService: TaskListService | null = null
export const getTaskListService = (): TaskListService => {
  if (!_taskListService) _taskListService = new TaskListService(httpClient)
  return _taskListService
}

let _taskService: TaskService | null = null
export const getTaskService = (): TaskService => {
  if (!_taskService) _taskService = new TaskService(httpClient)
  return _taskService
}

// ── TaskList Use Cases (Singletons) ───────────────────────────────────────────

let _getTaskListsUC: GetTaskListsUseCase | null = null
const getGetTaskListsUC = () =>
  (_getTaskListsUC ??= new GetTaskListsUseCase(getTaskListService()))

let _getTaskListByIdUC: GetTaskListByIdUseCase | null = null
const getGetTaskListByIdUC = () =>
  (_getTaskListByIdUC ??= new GetTaskListByIdUseCase(getTaskListService()))

let _createTaskListUC: CreateTaskListUseCase | null = null
const getCreateTaskListUC = () =>
  (_createTaskListUC ??= new CreateTaskListUseCase(getTaskListService()))

let _updateTaskListUC: UpdateTaskListUseCase | null = null
const getUpdateTaskListUC = () =>
  (_updateTaskListUC ??= new UpdateTaskListUseCase(getTaskListService()))

let _deleteTaskListUC: DeleteTaskListUseCase | null = null
const getDeleteTaskListUC = () =>
  (_deleteTaskListUC ??= new DeleteTaskListUseCase(getTaskListService()))

// ── Task Use Cases (Singletons) ───────────────────────────────────────────────

let _getTasksByListUC: GetTasksByListUseCase | null = null
const getGetTasksByListUC = () =>
  (_getTasksByListUC ??= new GetTasksByListUseCase(getTaskService()))

let _getTaskByIdUC: GetTaskByIdUseCase | null = null
const getGetTaskByIdUC = () =>
  (_getTaskByIdUC ??= new GetTaskByIdUseCase(getTaskService()))

let _createTaskUC: CreateTaskUseCase | null = null
const getCreateTaskUC = () =>
  (_createTaskUC ??= new CreateTaskUseCase(getTaskService()))

let _updateTaskUC: UpdateTaskUseCase | null = null
const getUpdateTaskUC = () =>
  (_updateTaskUC ??= new UpdateTaskUseCase(getTaskService()))

let _deleteTaskUC: DeleteTaskUseCase | null = null
const getDeleteTaskUC = () =>
  (_deleteTaskUC ??= new DeleteTaskUseCase(getTaskService()))

let _toggleTaskUC: ToggleTaskUseCase | null = null
const getToggleTaskUC = () =>
  (_toggleTaskUC ??= new ToggleTaskUseCase(getTaskService()))

// ── Plocs (Singletons) ────────────────────────────────────────────────────────

let _taskListsPloc: TaskListsPloc | null = null
export const getTaskListsPloc = (): TaskListsPloc => {
  if (!_taskListsPloc) _taskListsPloc = new TaskListsPloc(getGetTaskListsUC())
  return _taskListsPloc
}

let _taskListDetailPloc: TaskListDetailPloc | null = null
export const getTaskListDetailPloc = (): TaskListDetailPloc => {
  if (!_taskListDetailPloc)
    _taskListDetailPloc = new TaskListDetailPloc(getGetTaskListByIdUC())
  return _taskListDetailPloc
}

let _taskListCreateFormPloc: TaskListCreateFormPloc | null = null
export const getTaskListCreateFormPloc = (): TaskListCreateFormPloc => {
  if (!_taskListCreateFormPloc)
    _taskListCreateFormPloc = new TaskListCreateFormPloc(getCreateTaskListUC())
  return _taskListCreateFormPloc
}

let _taskListEditFormPloc: TaskListEditFormPloc | null = null
export const getTaskListEditFormPloc = (): TaskListEditFormPloc => {
  if (!_taskListEditFormPloc)
    _taskListEditFormPloc = new TaskListEditFormPloc(
      getGetTaskListByIdUC(),
      getUpdateTaskListUC()
    )
  return _taskListEditFormPloc
}

let _taskListDeletePloc: TaskListDeletePloc | null = null
export const getTaskListDeletePloc = (): TaskListDeletePloc => {
  if (!_taskListDeletePloc)
    _taskListDeletePloc = new TaskListDeletePloc(getDeleteTaskListUC())
  return _taskListDeletePloc
}

let _taskCreateFormPloc: TaskCreateFormPloc | null = null
export const getTaskCreateFormPloc = (): TaskCreateFormPloc => {
  if (!_taskCreateFormPloc)
    _taskCreateFormPloc = new TaskCreateFormPloc(getCreateTaskUC())
  return _taskCreateFormPloc
}

let _taskEditFormPloc: TaskEditFormPloc | null = null
export const getTaskEditFormPloc = (): TaskEditFormPloc => {
  if (!_taskEditFormPloc)
    _taskEditFormPloc = new TaskEditFormPloc(
      getGetTaskByIdUC(),
      getUpdateTaskUC()
    )
  return _taskEditFormPloc
}

let _taskDeletePloc: TaskDeletePloc | null = null
export const getTaskDeletePloc = (): TaskDeletePloc => {
  if (!_taskDeletePloc) _taskDeletePloc = new TaskDeletePloc(getDeleteTaskUC())
  return _taskDeletePloc
}

// ── Factories (new instance every time) ──────────────────────────────────────

export const createTasksPloc = (): TasksPloc => {
  return new TasksPloc(getGetTasksByListUC())
}

export const createTaskTogglePloc = (): TaskTogglePloc => {
  return new TaskTogglePloc(getToggleTaskUC())
}
