import type { components, paths } from './api'

type TaskResponse = components['schemas']['TaskResponse']
type TaskResponsePaginated =
  components['schemas']['TaskResponsePaginatedResponse']
type ProblemDetails = components['schemas']['ProblemDetails']

type CreateTaskCommand = components['schemas']['CreateTaskCommand']
type UpdateTaskCommand = components['schemas']['UpdateTaskCommand']

type TaskByListPath =
  paths['/api/v1/tasks/by-task-list/{taskListId}']['get']['parameters']['path']
type TaskIdPath = paths['/api/v1/tasks/{id}']['get']['parameters']['path']

type ToggleTaskPath =
  paths['/api/v1/tasks/{id}/toggle']['patch']['parameters']['path']

type GetTasksByListQuery =
  paths['/api/v1/tasks/by-task-list/{taskListId}']['get']['parameters']['query']

export type ApiTasksTypes = {
  GetTasksByListQuery: GetTasksByListQuery
  TaskResponse: TaskResponse
  TaskResponsePaginated: TaskResponsePaginated
  ProblemDetails: ProblemDetails
  CreateTaskCommand: CreateTaskCommand
  UpdateTaskCommand: UpdateTaskCommand
  TaskByListPath: TaskByListPath
  TaskIdPath: TaskIdPath
  ToggleTaskPath: ToggleTaskPath
}
