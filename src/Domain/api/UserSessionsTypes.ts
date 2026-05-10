import type { components, paths } from './api'

type UserSessionResponsePaginated =
  components['schemas']['UserSessionResponsePaginatedResponse']
type ProblemDetails = components['schemas']['ProblemDetails']
type GetUserSessionsFilters =
  paths['/api/v1/sessions']['get']['parameters']['query']
type RevokeSessionIdPath =
  paths['/api/v1/sessions/{sessionId}/revoke']['post']['parameters']['path']

export type ApiUserSessionTypes = {
  UserSessionResponsePaginated: UserSessionResponsePaginated
  ProblemDetails: ProblemDetails
  GetUserSessionsFilters: GetUserSessionsFilters
  RevokeSessionIdPath: RevokeSessionIdPath
}
