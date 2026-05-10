import type { components } from './api'

type UserResponse = components['schemas']['UserResponse']
type UpdateUserCommand = components['schemas']['UpdateUserCommand']
type ProblemDetails = components['schemas']['ProblemDetails']

export type ApiUserTypes = {
  UserResponse: UserResponse
  UpdateUserCommand: UpdateUserCommand
  ProblemDetails: ProblemDetails
}
