import {
  GetUserSessionsUseCase,
  RevokeSessionUseCase,
} from '../../../Application/UseCases/UserSession'
import {
  UserSessionsListPloc,
  SessionRevokePloc,
} from '../../../Controllers/UserSession'
import { UserSessionService } from '../../../Application/Services/UserSession/UserSessionService'
import { httpClient } from '../core/http.config'

let _userSessionService: UserSessionService | null = null
export const getUserSessionService = (): UserSessionService => {
  if (!_userSessionService)
    _userSessionService = new UserSessionService(httpClient)
  return _userSessionService
}

let _getUserSessionsUseCase: GetUserSessionsUseCase | null = null
const getGetUserSessionsUseCase = (): GetUserSessionsUseCase => {
  if (!_getUserSessionsUseCase)
    _getUserSessionsUseCase = new GetUserSessionsUseCase(
      getUserSessionService()
    )
  return _getUserSessionsUseCase
}

let _revokeSessionUseCase: RevokeSessionUseCase | null = null
const getRevokeSessionUseCase = (): RevokeSessionUseCase => {
  if (!_revokeSessionUseCase)
    _revokeSessionUseCase = new RevokeSessionUseCase(getUserSessionService())
  return _revokeSessionUseCase
}

let _userSessionsListPloc: UserSessionsListPloc | null = null
export const getUserSessionsListPloc = (): UserSessionsListPloc => {
  if (!_userSessionsListPloc)
    _userSessionsListPloc = new UserSessionsListPloc(
      getGetUserSessionsUseCase()
    )
  return _userSessionsListPloc
}

let _sessionRevokePloc: SessionRevokePloc | null = null
export const getSessionRevokePloc = (): SessionRevokePloc => {
  if (!_sessionRevokePloc)
    _sessionRevokePloc = new SessionRevokePloc(getRevokeSessionUseCase())
  return _sessionRevokePloc
}
