import {
  GetActivitiesUseCase,
  GetActivityByIdUseCase,
  CreateActivityUseCase,
  UpdateActivityUseCase,
  DeleteActivityUseCase,
} from '../../../Application/UseCases/Activity'
import {
  GetListActivityValueDefinitionUseCase,
  GetByIdActivityValueDefinitionUseCase,
  CreateActivityValueDefinitionUseCase,
  UpdateActivityValueDefinitionUseCase,
  DeleteActivityValueDefinitionUseCase,
} from '../../../Application/UseCases/ActivityValueDefinition'
import {
  ActivitiesListPloc,
  ActivityDetailPloc,
  ActivityCreateFormPloc,
  ActivityEditFormPloc,
  ActivityDeletePloc,
} from '../../../Controllers/Activity'
import {
  ActivityValueDefinitionListPloc,
  ActivityValueDefinitionCreateFormPloc,
  ActivityValueDefinitionEditFormPloc,
  ActivityValueDefinitionDeletePloc,
} from '../../../Controllers/ActivityValueDefinition'
import { ActivityService } from '../../../Application/Services/Activity/ActivityService'
import { ActivityValueDefinitionService } from '../../../Application/Services/ActivityValueDefinition/ActivityValueDefinitionService'
import { httpClient } from '../core/http.config'

let _activityService: ActivityService | null = null
export const getActivityService = (): ActivityService => {
  if (!_activityService) _activityService = new ActivityService(httpClient)
  return _activityService
}

let _activityValueDefinitionService: ActivityValueDefinitionService | null =
  null
export const getActivityValueDefinitionService =
  (): ActivityValueDefinitionService => {
    if (!_activityValueDefinitionService)
      _activityValueDefinitionService = new ActivityValueDefinitionService(
        httpClient
      )
    return _activityValueDefinitionService
  }

// Activity Use Cases
let _getActivitiesUseCase: GetActivitiesUseCase | null = null
const getGetActivitiesUseCase = (): GetActivitiesUseCase => {
  if (!_getActivitiesUseCase)
    _getActivitiesUseCase = new GetActivitiesUseCase(getActivityService())
  return _getActivitiesUseCase
}

let _getActivityByIdUseCase: GetActivityByIdUseCase | null = null
const getGetActivityByIdUseCase = (): GetActivityByIdUseCase => {
  if (!_getActivityByIdUseCase)
    _getActivityByIdUseCase = new GetActivityByIdUseCase(getActivityService())
  return _getActivityByIdUseCase
}

let _createActivityUseCase: CreateActivityUseCase | null = null
const getCreateActivityUseCase = (): CreateActivityUseCase => {
  if (!_createActivityUseCase)
    _createActivityUseCase = new CreateActivityUseCase(getActivityService())
  return _createActivityUseCase
}

let _updateActivityUseCase: UpdateActivityUseCase | null = null
const getUpdateActivityUseCase = (): UpdateActivityUseCase => {
  if (!_updateActivityUseCase)
    _updateActivityUseCase = new UpdateActivityUseCase(getActivityService())
  return _updateActivityUseCase
}

let _deleteActivityUseCase: DeleteActivityUseCase | null = null
const getDeleteActivityUseCase = (): DeleteActivityUseCase => {
  if (!_deleteActivityUseCase)
    _deleteActivityUseCase = new DeleteActivityUseCase(getActivityService())
  return _deleteActivityUseCase
}

// ActivityValueDefinition Use Cases
let _getListAVDUseCase: GetListActivityValueDefinitionUseCase | null = null
export const getGetListAVDUseCase =
  (): GetListActivityValueDefinitionUseCase => {
    if (!_getListAVDUseCase)
      _getListAVDUseCase = new GetListActivityValueDefinitionUseCase(
        getActivityValueDefinitionService()
      )
    return _getListAVDUseCase
  }

let _getByIdAVDUseCase: GetByIdActivityValueDefinitionUseCase | null = null
const getGetByIdAVDUseCase = (): GetByIdActivityValueDefinitionUseCase => {
  if (!_getByIdAVDUseCase)
    _getByIdAVDUseCase = new GetByIdActivityValueDefinitionUseCase(
      getActivityValueDefinitionService()
    )
  return _getByIdAVDUseCase
}

let _createAVDUseCase: CreateActivityValueDefinitionUseCase | null = null
const getCreateAVDUseCase = (): CreateActivityValueDefinitionUseCase => {
  if (!_createAVDUseCase)
    _createAVDUseCase = new CreateActivityValueDefinitionUseCase(
      getActivityValueDefinitionService()
    )
  return _createAVDUseCase
}

let _updateAVDUseCase: UpdateActivityValueDefinitionUseCase | null = null
const getUpdateAVDUseCase = (): UpdateActivityValueDefinitionUseCase => {
  if (!_updateAVDUseCase)
    _updateAVDUseCase = new UpdateActivityValueDefinitionUseCase(
      getActivityValueDefinitionService()
    )
  return _updateAVDUseCase
}

let _deleteAVDUseCase: DeleteActivityValueDefinitionUseCase | null = null
const getDeleteAVDUseCase = (): DeleteActivityValueDefinitionUseCase => {
  if (!_deleteAVDUseCase)
    _deleteAVDUseCase = new DeleteActivityValueDefinitionUseCase(
      getActivityValueDefinitionService()
    )
  return _deleteAVDUseCase
}

// Activity Plocs
let _activitiesListPloc: ActivitiesListPloc | null = null
export const getActivitiesListPloc = (): ActivitiesListPloc => {
  if (!_activitiesListPloc)
    _activitiesListPloc = new ActivitiesListPloc(getGetActivitiesUseCase())
  return _activitiesListPloc
}

let _activityDetailPloc: ActivityDetailPloc | null = null
export const getActivityDetailPloc = (): ActivityDetailPloc => {
  if (!_activityDetailPloc)
    _activityDetailPloc = new ActivityDetailPloc(getGetActivityByIdUseCase())
  return _activityDetailPloc
}

let _activityCreateFormPloc: ActivityCreateFormPloc | null = null
export const getActivityCreateFormPloc = (): ActivityCreateFormPloc => {
  if (!_activityCreateFormPloc)
    _activityCreateFormPloc = new ActivityCreateFormPloc(
      getCreateActivityUseCase()
    )
  return _activityCreateFormPloc
}

let _activityEditFormPloc: ActivityEditFormPloc | null = null
export const getActivityEditFormPloc = (): ActivityEditFormPloc => {
  if (!_activityEditFormPloc)
    _activityEditFormPloc = new ActivityEditFormPloc(
      getUpdateActivityUseCase(),
      getGetActivityByIdUseCase()
    )
  return _activityEditFormPloc
}

let _activityDeletePloc: ActivityDeletePloc | null = null
export const getActivityDeletePloc = (): ActivityDeletePloc => {
  if (!_activityDeletePloc)
    _activityDeletePloc = new ActivityDeletePloc(getDeleteActivityUseCase())
  return _activityDeletePloc
}

// ActivityValueDefinition Plocs
let _avdListPloc: ActivityValueDefinitionListPloc | null = null
export const getActivityValueDefinitionsListPloc =
  (): ActivityValueDefinitionListPloc => {
    if (!_avdListPloc)
      _avdListPloc = new ActivityValueDefinitionListPloc(getGetListAVDUseCase())
    return _avdListPloc
  }

let _avdCreateFormPloc: ActivityValueDefinitionCreateFormPloc | null = null
export const getValueDefinitionCreateFormPloc =
  (): ActivityValueDefinitionCreateFormPloc => {
    if (!_avdCreateFormPloc)
      _avdCreateFormPloc = new ActivityValueDefinitionCreateFormPloc(
        getCreateAVDUseCase()
      )
    return _avdCreateFormPloc
  }

let _avdEditFormPloc: ActivityValueDefinitionEditFormPloc | null = null
export const getValueDefinitionEditFormPloc =
  (): ActivityValueDefinitionEditFormPloc => {
    if (!_avdEditFormPloc)
      _avdEditFormPloc = new ActivityValueDefinitionEditFormPloc(
        getGetByIdAVDUseCase(),
        getUpdateAVDUseCase()
      )
    return _avdEditFormPloc
  }

let _avdDeletePloc: ActivityValueDefinitionDeletePloc | null = null
export const getValueDefinitionDeletePloc =
  (): ActivityValueDefinitionDeletePloc => {
    if (!_avdDeletePloc)
      _avdDeletePloc = new ActivityValueDefinitionDeletePloc(
        getDeleteAVDUseCase()
      )
    return _avdDeletePloc
  }

export const createValueDefinitionDeletePloc =
  (): ActivityValueDefinitionDeletePloc => {
    return new ActivityValueDefinitionDeletePloc(getDeleteAVDUseCase())
  }
