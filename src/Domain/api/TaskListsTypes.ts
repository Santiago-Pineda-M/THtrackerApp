import type { components, paths } from './api'

// ── Responses ─────────────────────────────────────────────────────────────────
type TaskListResponse = components['schemas']['TaskListResponse']
type TaskListResponsePaginated =
  components['schemas']['TaskListResponsePaginatedResponse']
type ProblemDetails = components['schemas']['ProblemDetails']

// ── Requests ──────────────────────────────────────────────────────────────────
type CreateTaskListCommand = components['schemas']['CreateTaskListCommand']
type UpdateTaskListCommand = components['schemas']['UpdateTaskListCommand']

// ── Path params ───────────────────────────────────────────────────────────────
type TaskListIdPath =
  paths['/api/v1/task-lists/{id}']['get']['parameters']['path']

type GetTaskListsQueryParams =
  paths['/api/v1/task-lists']['get']['parameters']['query']

export type ApiTaskListsTypes = {
  TaskListResponse: TaskListResponse
  TaskListResponsePaginated: TaskListResponsePaginated
  ProblemDetails: ProblemDetails
  CreateTaskListCommand: CreateTaskListCommand
  UpdateTaskListCommand: UpdateTaskListCommand
  TaskListIdPath: TaskListIdPath
  GetTaskListsRequest: GetTaskListsQueryParams
}
