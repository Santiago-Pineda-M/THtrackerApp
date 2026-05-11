/**
 * APPLICATION LAYER - Task Service Interface
 * Puerto para el servicio de gestión de tareas.
 * Refleja los endpoints de /api/v1/tasks
 */

import type { ApiTasksTypes } from '../../../Domain'

type TaskResponse = ApiTasksTypes['TaskResponse']
type TaskResponsePaginated = ApiTasksTypes['TaskResponsePaginated']
type ProblemDetails = ApiTasksTypes['ProblemDetails']
type CreateTaskRequest = ApiTasksTypes['CreateTaskCommand']
type UpdateTaskRequest = ApiTasksTypes['UpdateTaskCommand']

type TaskByListPath = ApiTasksTypes['TaskByListPath']
type TaskIdPath = ApiTasksTypes['TaskIdPath']

type ToggleTaskPath = ApiTasksTypes['ToggleTaskPath']

type GetTasksByListQuery = ApiTasksTypes['GetTasksByListQuery']

export interface ITaskService {
  /** GET  /api/v1/task-lists/{id}/tasks */
  getTasksByList(
    path: TaskByListPath,
    query: GetTasksByListQuery
  ): Promise<TaskResponsePaginated | ProblemDetails>

  /** GET  /api/v1/tasks/{id} */
  getTaskById(path: TaskIdPath): Promise<TaskResponse | ProblemDetails>

  /** POST /api/v1/tasks */
  createTask(request: CreateTaskRequest): Promise<TaskResponse | ProblemDetails>

  /** PUT  /api/v1/tasks/{id} */
  updateTask(
    path: TaskIdPath,
    request: UpdateTaskRequest
  ): Promise<TaskResponse | ProblemDetails>

  /** DELETE /api/v1/tasks/{id} */
  deleteTask(path: TaskIdPath): Promise<void | ProblemDetails>

  /** PATCH /api/v1/tasks/{id}/toggle */
  toggleTask(path: ToggleTaskPath): Promise<TaskResponse | ProblemDetails>
}
