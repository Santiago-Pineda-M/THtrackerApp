/**
 * APPLICATION LAYER - User Service Interface
 * Puerto para el servicio de gestión de usuario.
 * Refleja los endpoints de /api/v1/users/me
 */

import type { ApiUserTypes } from '../../../Domain'

type UserResponse = ApiUserTypes['UserResponse']
type UpdateUserCommand = ApiUserTypes['UpdateUserCommand']
type ProblemDetails = ApiUserTypes['ProblemDetails']

/**
 * Contrato del servicio de usuario.
 * Implementado en Infrastructure por UserService.
 */
export interface IUserService {
  /** GET /api/v1/users/me */
  getProfile(): Promise<UserResponse | ProblemDetails>

  /** PUT /api/v1/users/me */
  updateProfile(
    request: UpdateUserCommand
  ): Promise<UserResponse | ProblemDetails>
}
