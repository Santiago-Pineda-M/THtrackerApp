/**
 * APPLICATION LAYER - TaskList Service Interface
 * Puerto para el servicio de gestión de listas de tareas.
 * Refleja los endpoints de /api/v1/task-lists
 */

import type { ApiTaskListsTypes } from '../../../Domain'

// ── Responses ─────────────────────────────────────────────────────────────────
type TaskListResponse = ApiTaskListsTypes['TaskListResponse']
type TaskListResponsePaginated = ApiTaskListsTypes['TaskListResponsePaginated']
type ProblemDetails = ApiTaskListsTypes['ProblemDetails']

// ── Requests ──────────────────────────────────────────────────────────────────
type CreateTaskListCommand = ApiTaskListsTypes['CreateTaskListCommand']
type UpdateTaskListCommand = ApiTaskListsTypes['UpdateTaskListCommand']

// ── Path params ───────────────────────────────────────────────────────────────
type TaskListIdPath = ApiTaskListsTypes['TaskListIdPath']

type GetTaskListsRequest = ApiTaskListsTypes['GetTaskListsRequest']

/**
 * Contrato del servicio de listas de tareas.
 * Implementado en Infrastructure por TaskListService.
 */
export interface ITaskListService {
  /** GET    /api/v1/task-lists       */
  getTaskLists(
    path: GetTaskListsRequest
  ): Promise<TaskListResponsePaginated | ProblemDetails>

  /** GET    /api/v1/task-lists/{id}  */
  getTaskListById(
    path: TaskListIdPath
  ): Promise<TaskListResponse | ProblemDetails>

  /** POST   /api/v1/task-lists       */
  createTaskList(
    request: CreateTaskListCommand
  ): Promise<TaskListResponse | ProblemDetails>

  /** PUT    /api/v1/task-lists/{id}  */
  updateTaskList(
    path: TaskListIdPath,
    request: UpdateTaskListCommand
  ): Promise<TaskListResponse | ProblemDetails>

  /** DELETE /api/v1/task-lists/{id}  */
  deleteTaskList(path: TaskListIdPath): Promise<void | ProblemDetails>
}
