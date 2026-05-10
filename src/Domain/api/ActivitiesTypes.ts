import type { components, paths } from './api'

type ActivityPaginatedResponse =
  components['schemas']['ActivityResponsePaginatedResponse']
type CreateActivityCommand = components['schemas']['CreateActivityCommand']
type UpdateActivityCommand = components['schemas']['UpdateActivityCommand']
type ProblemDetails = components['schemas']['ProblemDetails']
type ActivityResponse = components['schemas']['ActivityResponse']

// parametros de path

type GetActivitiesFilters =
  paths['/api/v1/activities']['get']['parameters']['query']
type GetActivityIdPath =
  paths['/api/v1/activities/{id}']['get']['parameters']['path']
type DeleteActivityPath =
  paths['/api/v1/activities/{id}']['delete']['parameters']['path']
type UpdateActivityPath =
  paths['/api/v1/activities/{id}']['put']['parameters']['path']

type ApiActivitiesTypes = {
  ActivityPaginatedResponse: ActivityPaginatedResponse
  CreateActivityCommand: CreateActivityCommand
  UpdateActivityCommand: UpdateActivityCommand
  ProblemDetails: ProblemDetails
  GetActivitiesFilters: GetActivitiesFilters
  GetActivityIdPath: GetActivityIdPath
  DeleteActivityPath: DeleteActivityPath
  UpdateActivityPath: UpdateActivityPath
  ActivityResponse: ActivityResponse
}

export { type ApiActivitiesTypes }
