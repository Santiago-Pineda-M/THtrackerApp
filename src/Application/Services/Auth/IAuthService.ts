/**
 * APPLICATION LAYER - Auth Service Interface
 * Puerto para el servicio de autenticación.
 * Solo refleja los 3 endpoints que existen en la API.
 */

import type { ApiAuthTypes } from '../../../Domain'

type LoginCommand = ApiAuthTypes['LoginCommand']
type RegisterCommand = ApiAuthTypes['RegisterCommand']
type SubmitRefreshToken = ApiAuthTypes['SubmitRefreshToken']
type TokenResponse = ApiAuthTypes['TokenResponse']
type UserResponse = ApiAuthTypes['UserResponse']
type ProblemDetails = ApiAuthTypes['ProblemDetails']
/**
 * Contrato del servicio de autenticación.
 * Implementado en Infrastructure por AuthService.
 */
export interface IAuthService {
  /** POST /api/v1/auth/login — Devuelve tokens JWT o 401. */
  login(request: LoginCommand): Promise<TokenResponse | ProblemDetails>

  /** POST /api/v1/auth/register — Devuelve el usuario creado o 400. */
  register(request: RegisterCommand): Promise<UserResponse | ProblemDetails>

  /** POST /api/v1/auth/refresh — Renueva el access token o 401. */
  refreshToken(
    request: SubmitRefreshToken
  ): Promise<TokenResponse | ProblemDetails>
}
