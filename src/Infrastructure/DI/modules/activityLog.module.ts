import {
  GetActivityLogsUseCase,
  GetActivityLogByIdUseCase,
  StartActivityLogUseCase,
  StopActivityLogUseCase,
  UpdateActivityLogUseCase,
  SaveActivityLogValuesUseCase,
  GetActivityLogValuesUseCase,
  GetActiveActivityLogsUseCase,
  GetCalendarLogsUseCase,
} from '../../../Application/UseCases/ActivityLog'
import {
  ActivityLogsListPloc,
  ActivityLogDetailPloc,
  ActiveActivityLogsPloc,
  ActivityLogStartPloc,
  ActivityLogStopPloc,
  CalendarLogsPloc,
} from '../../../Controllers/ActivityLog'
import { ActivityLogService } from '../../../Application/Services/ActivityLog/ActivityLogService'
import { httpClient } from '../core/http.config'
import { getGetListAVDUseCase } from './activity.module'

let _activityLogService: ActivityLogService | null = null
export const getActivityLogService = (): ActivityLogService => {
  if (!_activityLogService)
    _activityLogService = new ActivityLogService(httpClient)
  return _activityLogService
}

let _getActivityLogsUseCase: GetActivityLogsUseCase | null = null
const getGetActivityLogsUseCase = (): GetActivityLogsUseCase => {
  if (!_getActivityLogsUseCase)
    _getActivityLogsUseCase = new GetActivityLogsUseCase(
      getActivityLogService()
    )
  return _getActivityLogsUseCase
}

let _getActivityLogByIdUseCase: GetActivityLogByIdUseCase | null = null
const getGetActivityLogByIdUseCase = (): GetActivityLogByIdUseCase => {
  if (!_getActivityLogByIdUseCase)
    _getActivityLogByIdUseCase = new GetActivityLogByIdUseCase(
      getActivityLogService()
    )
  return _getActivityLogByIdUseCase
}

let _startActivityLogUseCase: StartActivityLogUseCase | null = null
const getStartActivityLogUseCase = (): StartActivityLogUseCase => {
  if (!_startActivityLogUseCase)
    _startActivityLogUseCase = new StartActivityLogUseCase(
      getActivityLogService()
    )
  return _startActivityLogUseCase
}

let _stopActivityLogUseCase: StopActivityLogUseCase | null = null
const getStopActivityLogUseCase = (): StopActivityLogUseCase => {
  if (!_stopActivityLogUseCase)
    _stopActivityLogUseCase = new StopActivityLogUseCase(
      getActivityLogService()
    )
  return _stopActivityLogUseCase
}

let _updateActivityLogUseCase: UpdateActivityLogUseCase | null = null
const getUpdateActivityLogUseCase = (): UpdateActivityLogUseCase => {
  if (!_updateActivityLogUseCase)
    _updateActivityLogUseCase = new UpdateActivityLogUseCase(
      getActivityLogService()
    )
  return _updateActivityLogUseCase
}

let _saveActivityLogValuesUseCase: SaveActivityLogValuesUseCase | null = null
const getSaveActivityLogValuesUseCase = (): SaveActivityLogValuesUseCase => {
  if (!_saveActivityLogValuesUseCase)
    _saveActivityLogValuesUseCase = new SaveActivityLogValuesUseCase(
      getActivityLogService()
    )
  return _saveActivityLogValuesUseCase
}

let _getActivityLogValuesUseCase: GetActivityLogValuesUseCase | null = null
const getGetActivityLogValuesUseCase = (): GetActivityLogValuesUseCase => {
  if (!_getActivityLogValuesUseCase)
    _getActivityLogValuesUseCase = new GetActivityLogValuesUseCase(
      getActivityLogService()
    )
  return _getActivityLogValuesUseCase
}

let _getActiveActivityLogsUseCase: GetActiveActivityLogsUseCase | null = null
const getGetActiveActivityLogsUseCase = (): GetActiveActivityLogsUseCase => {
  if (!_getActiveActivityLogsUseCase)
    _getActiveActivityLogsUseCase = new GetActiveActivityLogsUseCase(
      getActivityLogService()
    )
  return _getActiveActivityLogsUseCase
}

let _getCalendarLogsUseCase: GetCalendarLogsUseCase | null = null
const getGetCalendarLogsUseCase = (): GetCalendarLogsUseCase => {
  if (!_getCalendarLogsUseCase)
    _getCalendarLogsUseCase = new GetCalendarLogsUseCase(
      getActivityLogService()
    )
  return _getCalendarLogsUseCase
}

// Plocs
let _activityLogsListPloc: ActivityLogsListPloc | null = null
export const getActivityLogsListPloc = (): ActivityLogsListPloc => {
  if (!_activityLogsListPloc)
    _activityLogsListPloc = new ActivityLogsListPloc(
      getGetActivityLogsUseCase(),
      getStartActivityLogUseCase(),
      getStopActivityLogUseCase()
    )
  return _activityLogsListPloc
}

let _activityLogDetailPloc: ActivityLogDetailPloc | null = null
export const getActivityLogDetailPloc = (): ActivityLogDetailPloc => {
  if (!_activityLogDetailPloc)
    _activityLogDetailPloc = new ActivityLogDetailPloc(
      getGetActivityLogByIdUseCase(),
      getUpdateActivityLogUseCase(),
      getSaveActivityLogValuesUseCase(),
      getGetActivityLogValuesUseCase()
    )
  return _activityLogDetailPloc
}

let _activeActivityLogsPloc: ActiveActivityLogsPloc | null = null
export const getActiveActivityLogsPloc = (): ActiveActivityLogsPloc => {
  if (!_activeActivityLogsPloc)
    _activeActivityLogsPloc = new ActiveActivityLogsPloc(
      getGetActiveActivityLogsUseCase()
    )
  return _activeActivityLogsPloc
}

let _activityLogStartPloc: ActivityLogStartPloc | null = null
export const getActivityLogStartPloc = (): ActivityLogStartPloc => {
  if (!_activityLogStartPloc)
    _activityLogStartPloc = new ActivityLogStartPloc(
      getStartActivityLogUseCase()
    )
  return _activityLogStartPloc
}

let _activityLogStopPloc: ActivityLogStopPloc | null = null
export const getActivityLogStopPloc = (): ActivityLogStopPloc => {
  if (!_activityLogStopPloc)
    _activityLogStopPloc = new ActivityLogStopPloc(
      getStopActivityLogUseCase(),
      getGetListAVDUseCase(),
      getSaveActivityLogValuesUseCase()
    )
  return _activityLogStopPloc
}

let _calendarLogsPloc: CalendarLogsPloc | null = null
export const getCalendarLogsPloc = (): CalendarLogsPloc => {
  if (!_calendarLogsPloc)
    _calendarLogsPloc = new CalendarLogsPloc(getGetCalendarLogsUseCase())
  return _calendarLogsPloc
}
