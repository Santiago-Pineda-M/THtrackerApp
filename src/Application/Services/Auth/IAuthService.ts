/**
 * APPLICATION LAYER - Auth Service Interface
 * Puerto para el servicio de autenticación.
 * Solo refleja los 3 endpoints que existen en la API.
 */

import type {
  ILoginRequest,
  IRegisterRequest,
  IRefreshTokenRequest,
  ILoginResponse,
  IRegisterResponse,
  IRefreshTokenResponse,
  ILoginResponseError,
  IRefreshTokenResponseError,
} from '../../../Domain'

/**
 * Contrato del servicio de autenticación.
 * Implementado en Infrastructure por AuthService.
 */
export interface IAuthService {
  /** Inicia sesión. Devuelve tokens JWT o error RFC 7807. */
  login(request: ILoginRequest): Promise<ILoginResponse | ILoginResponseError>

  /** Registra un nuevo usuario. Devuelve confirmación o error. */
  register(
    request: IRegisterRequest
  ): Promise<IRegisterResponse | ILoginResponseError>

  /** Renueva el access token usando el refresh token. */
  refreshToken(
    request: IRefreshTokenRequest
  ): Promise<IRefreshTokenResponse | IRefreshTokenResponseError>
}
