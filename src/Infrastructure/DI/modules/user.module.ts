import {
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
} from '../../../Application/UseCases/User'
import {
  UserProfileDisplayPloc,
  UserProfileFormPloc,
} from '../../../Controllers/User'
import { UserService } from '../../../Application/Services/User/UserService'
import { httpClient } from '../core/http.config'
import { getAuthPloc } from './auth.module'

let _userService: UserService | null = null
export const getUserService = (): UserService => {
  if (!_userService) _userService = new UserService(httpClient)
  return _userService
}

let _getUserProfileUseCase: GetUserProfileUseCase | null = null
const getGetUserProfileUseCase = (): GetUserProfileUseCase => {
  if (!_getUserProfileUseCase)
    _getUserProfileUseCase = new GetUserProfileUseCase(getUserService())
  return _getUserProfileUseCase
}

let _updateUserProfileUseCase: UpdateUserProfileUseCase | null = null
const getUpdateUserProfileUseCase = (): UpdateUserProfileUseCase => {
  if (!_updateUserProfileUseCase)
    _updateUserProfileUseCase = new UpdateUserProfileUseCase(getUserService())
  return _updateUserProfileUseCase
}

let _userProfileDisplayPloc: UserProfileDisplayPloc | null = null
export const getUserProfileDisplayPloc = (): UserProfileDisplayPloc => {
  if (!_userProfileDisplayPloc)
    _userProfileDisplayPloc = new UserProfileDisplayPloc(
      getGetUserProfileUseCase(),
      getAuthPloc()
    )
  return _userProfileDisplayPloc
}

let _userProfileFormPloc: UserProfileFormPloc | null = null
export const getUserProfileFormPloc = (): UserProfileFormPloc => {
  if (!_userProfileFormPloc)
    _userProfileFormPloc = new UserProfileFormPloc(
      getUpdateUserProfileUseCase(),
      getGetUserProfileUseCase(),
      getAuthPloc()
    )
  return _userProfileFormPloc
}
