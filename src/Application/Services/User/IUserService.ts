/**
 * APPLICATION LAYER - User Service Interface
 * Puerto para el servicio de gestión de usuario.
 * Refleja los endpoints de /api/v1/users/me
 */

import type {
  UserProfileResponse,
  UpdateUserProfileRequest,
  ProblemDetails,
} from '../../../Domain'

/**
 * Contrato del servicio de usuario.
 * Implementado en Infrastructure por UserService.
 */
export interface IUserService {
  /**
   * Obtiene los datos del usuario autenticado.
   * GET /api/v1/users/me
   * @returns UserProfileResponse o ProblemDetails en caso de error
   */
  getProfile(): Promise<UserProfileResponse | ProblemDetails>

  /**
   * Actualiza los datos del usuario autenticado.
   * PUT /api/v1/users/me
   * @param request - Datos a actualizar (name y/o email)
   * @returns UserProfileResponse actualizado o ProblemDetails en caso de error
   */
  updateProfile(
    request: UpdateUserProfileRequest
  ): Promise<UserProfileResponse | ProblemDetails>
}
