import {
  LoginUserUseCase,
  RefreshTokenUseCases,
  RegisterUseCases,
  LogoutUseCase,
  CheckAuthSessionUseCase,
  GetSessionUseCase,
} from '../../../Application/UseCases/Auth'
import {
  LoginPloc,
  AuthPloc,
  RegisterPloc,
  RefreshTokenPloc,
  LogoutPloc,
} from '../../../Controllers/Auth'
import { AuthService } from '../../../Application/Services/Auth/AuthService'
import { httpClient } from '../core/http.config'
import { authSessionRepository } from '../core/storage.config'
import { getUserSessionService } from './userSession.module'

let _authService: AuthService | null = null
export const getAuthService = (): AuthService => {
  if (!_authService) _authService = new AuthService(httpClient)
  return _authService
}

let _checkAuthSessionUseCase: CheckAuthSessionUseCase | null = null
const getCheckAuthSessionUseCase = (): CheckAuthSessionUseCase => {
  if (!_checkAuthSessionUseCase)
    _checkAuthSessionUseCase = new CheckAuthSessionUseCase(
      authSessionRepository,
      getAuthService()
    )
  return _checkAuthSessionUseCase
}

let _getSessionUseCase: GetSessionUseCase | null = null
export const getGetSessionUseCase = (): GetSessionUseCase => {
  if (!_getSessionUseCase)
    _getSessionUseCase = new GetSessionUseCase(authSessionRepository)
  return _getSessionUseCase
}

let _authPloc: AuthPloc | null = null
export const getAuthPloc = (): AuthPloc => {
  if (!_authPloc)
    _authPloc = new AuthPloc(
      getCheckAuthSessionUseCase(),
      getGetSessionUseCase(),
      authSessionRepository
    )
  return _authPloc
}

let _loginUserUseCase: LoginUserUseCase | null = null
const getLoginUserUseCase = (): LoginUserUseCase => {
  if (!_loginUserUseCase)
    _loginUserUseCase = new LoginUserUseCase(
      getAuthService(),
      authSessionRepository
    )
  return _loginUserUseCase
}

let _loginPloc: LoginPloc | null = null
export const getLoginPloc = (): LoginPloc => {
  if (!_loginPloc)
    _loginPloc = new LoginPloc(getLoginUserUseCase(), getAuthPloc())
  return _loginPloc
}

let _registerUseCases: RegisterUseCases | null = null
const getRegisterUseCases = (): RegisterUseCases => {
  if (!_registerUseCases)
    _registerUseCases = new RegisterUseCases(getAuthService())
  return _registerUseCases
}

let _registerPloc: RegisterPloc | null = null
export const getRegisterPloc = (): RegisterPloc => {
  if (!_registerPloc) _registerPloc = new RegisterPloc(getRegisterUseCases())
  return _registerPloc
}

let _refreshTokenUseCases: RefreshTokenUseCases | null = null
const getRefreshTokenUseCases = (): RefreshTokenUseCases => {
  if (!_refreshTokenUseCases)
    _refreshTokenUseCases = new RefreshTokenUseCases(
      getAuthService(),
      authSessionRepository
    )
  return _refreshTokenUseCases
}

let _refreshTokenPloc: RefreshTokenPloc | null = null
export const getRefreshTokenPloc = (): RefreshTokenPloc => {
  if (!_refreshTokenPloc)
    _refreshTokenPloc = new RefreshTokenPloc(
      getRefreshTokenUseCases(),
      getGetSessionUseCase()
    )
  return _refreshTokenPloc
}

let _logoutUseCase: LogoutUseCase | null = null
const getLogoutUseCase = (): LogoutUseCase => {
  if (!_logoutUseCase)
    _logoutUseCase = new LogoutUseCase(
      authSessionRepository,
      httpClient,
      getUserSessionService()
    )
  return _logoutUseCase
}

let _logoutPloc: LogoutPloc | null = null
export const getLogoutPloc = (): LogoutPloc => {
  if (!_logoutPloc)
    _logoutPloc = new LogoutPloc(getLogoutUseCase(), getAuthPloc())
  return _logoutPloc
}
