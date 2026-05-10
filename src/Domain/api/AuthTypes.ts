import type { components } from './api'

type LoginCommand = components['schemas']['LoginCommand']
type RegisterCommand = components['schemas']['RegisterCommand']
type SubmitRefreshToken = components['schemas']['SubmitRefreshToken']
type TokenResponse = components['schemas']['TokenResponse']
type UserResponse = components['schemas']['UserResponse']
type ProblemDetails = components['schemas']['ProblemDetails']

type ApiAuthTypes = {
  LoginCommand: LoginCommand
  RegisterCommand: RegisterCommand
  SubmitRefreshToken: SubmitRefreshToken
  TokenResponse: TokenResponse
  UserResponse: UserResponse
  ProblemDetails: ProblemDetails
}

export { type ApiAuthTypes }
