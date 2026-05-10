/**
 * DOMAIN LAYER - State Interfaces
 * Contiene los estados globales para los PLOCs de autenticación.
 * Centralizado siguiendo principios de Clean Architecture para evitar acoplamiento ciclico.
 */

import type { AuthSession } from './Entities/AuthSession'
import type {
  ApiActivitiesTypes,
  ApiCategoriesTypes,
  ApiUserSessionTypes,
  ApiAuthTypes,
  ApiActivityValueDefinitionTypes,
  ApiActivityLogsTypes,
  ApiTaskListsTypes,
  ApiTasksTypes,
  ApiUserTypes,
} from './api'

/**
 * ==========================================
 * AUTHENTICATION STATES
 * ==========================================
 */

/**
 * Definición de los estados para la máquina de estados de autenticación.
 */
export const AuthStatus = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  AUTHENTICATING: 'AUTHENTICATING',
  AUTHENTICATED: 'AUTHENTICATED',
  FAILED: 'FAILED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOGGING_OUT: 'LOGGING_OUT',
  REFRESHING_TOKEN: 'REFRESHING_TOKEN',
} as const

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus]

/**
 * Interfaz del estado de autenticación usado por AuthPloc.
 */
export interface IAuthState {
  status: AuthStatus
  user?: AuthSession | null
}

export const initialAuthState: IAuthState = {
  status: AuthStatus.IDLE,
  user: undefined,
}

/**
 * ==========================================
 * LOGIN STATES
 * ==========================================
 */

/**
 * Interfaz del estado del formulario de login.
 * Usada por LoginPloc para gestionar el flujo de login.
 */
export interface ILoginState {
  deviceInfo: string
  email: string
  password: string
  errors: ApiAuthTypes['ProblemDetails'] | null
  success: boolean
  message: string
  isLoading: boolean
}

export const initialLoginState: ILoginState = {
  deviceInfo: '',
  email: '',
  password: '',
  errors: null,
  success: false,
  message: '',
  isLoading: false,
}

/**
 * ==========================================
 * REGISTER STATES
 * ==========================================
 */

/**
 * Interfaz del estado del formulario de registro.
 * Usada por RegisterPloc para gestionar el flujo de registro.
 */
export interface IRegisterState {
  name: string
  email: string
  password: string
  confirmPassword: string
  errors: ApiAuthTypes['ProblemDetails'] | null
  success: boolean
  message: string
  isLoading: boolean
}

export const initialRegisterState: IRegisterState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: null,
  success: false,
  message: '',
  isLoading: false,
}

/**
 * ==========================================
 * REFRESH TOKEN STATES
 * ==========================================
 */

export interface IRefreshTokenState {
  isRefreshing: boolean
  success: boolean
  error: ApiAuthTypes['ProblemDetails'] | null
}

export const initialRefreshTokenState: IRefreshTokenState = {
  isRefreshing: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * LOGOUT STATES
 * ==========================================
 */

export interface ILogoutState {
  isLoggingOut: boolean
  success: boolean
  error: ApiAuthTypes['ProblemDetails'] | null
}

export const initialLogoutState: ILogoutState = {
  isLoggingOut: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * SIDEBAR STATES
 * ==========================================
 */

/**
 * Interfaz del estado del componente Sidebar.
 * Usada por SidebarPloc para gestionar el estado del menú.
 */
export interface ISidebarState {
  isMenuOpen: boolean
}

export const initialSidebarState: ISidebarState = {
  isMenuOpen: true,
}

/**
 * ==========================================
 * USER PROFILE DISPLAY STATE
 * ==========================================
 */

/**
 * Estado simple para mostrar el perfil del usuario (consulta)
 */
export interface IUserProfileDisplayState {
  user: ApiUserTypes['UserResponse'] | null
  error: ApiUserTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialUserProfileDisplayState: IUserProfileDisplayState = {
  user: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * USER PROFILE FORM STATE
 * ==========================================
 */

/**
 * Estado simple para el formulario de actualización de perfil
 */
export interface IUserProfileFormState {
  name: string
  email: string
  errors: ApiUserTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
  initialValues: {
    name: string
    email: string
  }
}

export const initialUserProfileFormState: IUserProfileFormState = {
  name: '',
  email: '',
  errors: null,
  isLoading: false,
  success: false,
  message: '',
  initialValues: {
    name: '',
    email: '',
  },
}

/**
 * ==========================================
 * CATEGORIES LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de categorías del usuario autenticado
 */

export interface ICategoriesListState {
  categories: ApiCategoriesTypes['CategoryPaginatedResponse'] | null
  error: ApiCategoriesTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialCategoriesListState: ICategoriesListState = {
  categories: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * CATEGORY DETAIL STATE
 * ==========================================
 */

/**
 * Estado para mostrar una categoría individual
 */
export interface ICategoryDetailState {
  category: ApiCategoriesTypes['CategoryResponse'] | null
  error: ApiCategoriesTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialCategoryDetailState: ICategoryDetailState = {
  category: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * CATEGORY CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de categoría
 */
export interface ICategoryCreateFormState {
  name: string
  color: string
  errors: ApiCategoriesTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
  initialValues: {
    name: string
    color: string
  }
}

export const initialCategoryCreateFormState: ICategoryCreateFormState = {
  name: '',
  color: '#000000',
  errors: null,
  isLoading: false,
  success: false,
  message: '',
  initialValues: {
    name: '',
    color: '',
  },
}

/**
 * ==========================================
 * CATEGORY EDIT FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de edición de categoría
 */
export interface ICategoryEditFormState {
  id: string
  name: string
  color: string
  errors: ApiCategoriesTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
  initialValues: {
    name: string
    color: string
  }
}

export const initialCategoryEditFormState: ICategoryEditFormState = {
  id: '',
  name: '',
  color: '',
  errors: null,
  isLoading: false,
  success: false,
  message: '',
  initialValues: {
    name: '',
    color: '',
  },
}

/**
 * ==========================================
 * ACTIVITIES LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de actividades del usuario autenticado
 */
export interface IActivitiesListState {
  activities: ApiActivitiesTypes['ActivityPaginatedResponse'] | null
  error: ApiActivitiesTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialActivitiesListState: IActivitiesListState = {
  activities: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * ACTIVITY DETAIL STATE
 * ==========================================
 */

/**
 * Estado para mostrar una actividad individual
 */
export interface IActivityDetailState {
  activity: ApiActivitiesTypes['ActivityResponse'] | null
  error: ApiActivitiesTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialActivityDetailState: IActivityDetailState = {
  activity: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * ACTIVITY CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de actividad
 */
export interface IActivityCreateFormState {
  categoryId: string
  name: string
  color: string
  allowOverlap: boolean
  errors: ApiActivitiesTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
  initialValues: {
    categoryId: string
    name: string
    color: string
    allowOverlap: boolean
  }
}

export const initialActivityCreateFormState: IActivityCreateFormState = {
  categoryId: '',
  name: '',
  color: '#000000',
  allowOverlap: false,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
  initialValues: {
    categoryId: '',
    name: '',
    color: '',
    allowOverlap: false,
  },
}

/**
 * ==========================================
 * ACTIVITY EDIT FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de edición de actividad
 */
export interface IActivityEditFormState {
  id: string
  categoryId: string
  name: string
  color: string
  allowOverlap: boolean
  errors: ApiActivitiesTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
  initialValues: {
    categoryId: string
    name: string
    color: string
    allowOverlap: boolean
  }
}

export const initialActivityEditFormState: IActivityEditFormState = {
  id: '',
  categoryId: '',
  name: '',
  color: '',
  allowOverlap: false,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
  initialValues: {
    categoryId: '',
    name: '',
    color: '',
    allowOverlap: false,
  },
}

/**
 * ==========================================
 * ACTIVITY DELETE STATE
 * ==========================================
 */

/**
 * Estado para la eliminación de una actividad
 */
export interface IActivityDeleteState {
  isLoading: boolean
  success: boolean
  error: ApiActivitiesTypes['ProblemDetails'] | null
}

export const initialActivityDeleteState: IActivityDeleteState = {
  isLoading: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * ACTIVITY VALUE DEFINITIONS LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de definiciones de valor de una actividad
 */
export interface IActivityValueDefinitionsState {
  activityId: string | null
  definitions:
    | ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponsePaginated']
    | null
  isLoading: boolean
  error: ApiActivityValueDefinitionTypes['ProblemDetails'] | null
}

export const initialActivityValueDefinitionsState: IActivityValueDefinitionsState =
  {
    activityId: null,
    definitions: null,
    isLoading: false,
    error: null,
  }

/**
 * ==========================================
 * VALUE DEFINITION CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de una definición de valor
 */
export interface IValueDefinitionCreateFormState {
  activityId: string
  name: string
  valueType: string
  isRequired: boolean
  unit: string
  minValue: string
  maxValue: string
  errors: ApiActivityValueDefinitionTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialValueDefinitionCreateFormState: IValueDefinitionCreateFormState =
  {
    activityId: '',
    name: '',
    valueType: 'Number',
    isRequired: false,
    unit: '',
    minValue: '',
    maxValue: '',
    errors: null,
    isLoading: false,
    success: false,
    message: '',
  }

/**
 * ==========================================
 * VALUE DEFINITION EDIT FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de edición de una definición de valor
 */
export interface IValueDefinitionEditFormState {
  id: string
  activityId: string
  name: string | null
  valueType: string | null
  isRequired: boolean
  unit: string | null
  minValue: string | null
  maxValue: string | null
  errors: ApiActivityValueDefinitionTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialValueDefinitionEditFormState: IValueDefinitionEditFormState =
  {
    id: '',
    activityId: '',
    name: null,
    valueType: 'Number',
    isRequired: false,
    unit: null,
    minValue: null,
    maxValue: null,
    errors: null,
    isLoading: false,
    success: false,
    message: '',
  }

/**
 * ==========================================
 * VALUE DEFINITION DELETE STATE
 * ==========================================
 */

/**
 * Estado para la eliminación de una definición de valor
 */
export interface IValueDefinitionDeleteState {
  isLoading: boolean
  success: boolean
  error: ApiActivityValueDefinitionTypes['ProblemDetails'] | null
}

export const initialValueDefinitionDeleteState: IValueDefinitionDeleteState = {
  isLoading: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * ACTIVITY LOGS STATES
 * ==========================================
 */

/**
 * Estado para la lista de registros (logs) de una actividad
 */
export interface IActivityLogsListState {
  activityId: string
  logs: ApiActivityLogsTypes['ActivityLogResponsePaginated'] | null
  isLoading: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
}

export const initialActivityLogsListState: IActivityLogsListState = {
  activityId: '',
  logs: null,
  isLoading: false,
  error: null,
}

/**
 * Estado para el detalle y edición de valores de un registro de actividad específico
 */
export interface IActivityLogDetailState {
  log: ApiActivityLogsTypes['ActivityLogResponse'] | null
  isLoading: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
  success: boolean
  message: string
}

export const initialActivityLogDetailState: IActivityLogDetailState = {
  log: null,
  isLoading: false,
  error: null,
  success: false,
  message: '',
}

/**
 * Estado para la lista global de registros activos (en curso) del usuario
 */
export interface IActiveActivityLogsState {
  logs: ApiActivityLogsTypes['ActivityLogResponsePaginated'] | null
  isLoading: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
}

export const initialActiveActivityLogsState: IActiveActivityLogsState = {
  logs: null,
  isLoading: false,
  error: null,
}

/**
 * Estado para la operación de inicio de un registro de actividad
 */
export interface IActivityLogStartState {
  isLoading: boolean
  success: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
  newLog: ApiActivityLogsTypes['ActivityLogResponse'] | null
}

export const initialActivityLogStartState: IActivityLogStartState = {
  isLoading: false,
  success: false,
  error: null,
  newLog: null,
}

/**
 * Estado para el flujo de detención de un registro de actividad
 */
export interface IActivityLogStopState {
  logToStop: ApiActivityLogsTypes['ActivityLogResponse'] | null
  definitions:
    | ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponsePaginated']
    | null
  isLoadingDefinitions: boolean
  isStopping: boolean
  success: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
}

export const initialActivityLogStopState: IActivityLogStopState = {
  logToStop: null,
  definitions: null,
  isLoadingDefinitions: false,
  isStopping: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * USER SESSIONS LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de sesiones activas del usuario
 */
export interface IUserSessionsListState {
  sessions: ApiUserSessionTypes['UserSessionResponsePaginated'] | null
  error: ApiUserSessionTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialUserSessionsListState: IUserSessionsListState = {
  sessions: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * SESSION REVOKE STATE
 * ==========================================
 */

/**
 * Estado para la acción de revocar una sesión
 */
export interface ISessionRevokeState {
  isRevoking: boolean
  success: boolean
  error: ApiUserSessionTypes['ProblemDetails'] | null
  revokedSessionId: string | null
}

export const initialSessionRevokeState: ISessionRevokeState = {
  isRevoking: false,
  success: false,
  error: null,
  revokedSessionId: null,
}

/**
 * ==========================================
 * CALENDAR LOGS STATE
 * ==========================================
 */

/**
 * Estado para la visualización del calendario semanal
 */
export interface ICalendarLogsState {
  currentWeekDate: Date
  logs: ApiActivityLogsTypes['ActivityLogResponsePaginated'] | null
  isLoading: boolean
  error: ApiActivityLogsTypes['ProblemDetails'] | null
}

export const initialCalendarLogsState: ICalendarLogsState = {
  currentWeekDate: new Date(),
  logs: null,
  isLoading: false,
  error: null,
}

/**
 * ==========================================
 * TASK LISTS STATE
 * ==========================================
 */

/**
 * Estado para la lista de listas de tareas del usuario autenticado
 */
export interface ITaskListsState {
  taskLists: ApiTaskListsTypes['TaskListResponsePaginated'] | null
  error: ApiTaskListsTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialTaskListsState: ITaskListsState = {
  taskLists: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * TASKS STATE
 * ==========================================
 */

/**
 * Estado para la lista de tareas dentro de una lista de tareas
 */
export interface ITasksState {
  tasks: ApiTasksTypes['TaskResponsePaginated'] | null
  error: ApiTasksTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialTasksState: ITasksState = {
  tasks: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * TASK LIST DETAIL STATE
 * ==========================================
 */

export interface ITaskListDetailState {
  taskList: ApiTaskListsTypes['TaskListResponse'] | null
  error: ApiTaskListsTypes['ProblemDetails'] | null
  isLoading: boolean
}

export const initialTaskListDetailState: ITaskListDetailState = {
  taskList: null,
  error: null,
  isLoading: false,
}

/**
 * ==========================================
 * TASK LIST CREATE FORM STATE
 * ==========================================
 */

export interface ITaskListCreateFormState {
  name: string
  description: string | null
  color: string
  errors: ApiTaskListsTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialTaskListCreateFormState: ITaskListCreateFormState = {
  color: '',
  name: '',
  description: null,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
}

/**
 * ==========================================
 * TASK LIST EDIT FORM STATE
 * ==========================================
 */

export interface ITaskListEditFormState {
  id: string
  name: string
  description: string | null
  errors: ApiTaskListsTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialTaskListEditFormState: ITaskListEditFormState = {
  id: '',
  name: '',
  description: null,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
}

/**
 * ==========================================
 * TASK LIST DELETE STATE
 * ==========================================
 */

export interface ITaskListDeleteState {
  isLoading: boolean
  success: boolean
  error: ApiTaskListsTypes['ProblemDetails'] | null
}

export const initialTaskListDeleteState: ITaskListDeleteState = {
  isLoading: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * TASK CREATE FORM STATE
 * ==========================================
 */

export interface ITaskCreateFormState {
  taskListId: string
  content: string
  dueDate: string
  showDueDate: boolean
  errors: ApiTasksTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialTaskCreateFormState: ITaskCreateFormState = {
  taskListId: '',
  content: '',
  dueDate: '',
  showDueDate: false,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
}

/**
 * ==========================================
 * TASK EDIT FORM STATE
 * ==========================================
 */

export interface ITaskEditFormState {
  id: string
  taskListId: string
  content: string
  dueDate: string
  showDueDate: boolean
  errors: ApiTasksTypes['ProblemDetails'] | null
  isLoading: boolean
  success: boolean
  message: string
}

export const initialTaskEditFormState: ITaskEditFormState = {
  id: '',
  taskListId: '',
  content: '',
  dueDate: '',
  showDueDate: false,
  errors: null,
  isLoading: false,
  success: false,
  message: '',
}

/**
 * ==========================================
 * TASK DELETE STATE
 * ==========================================
 */

export interface ITaskDeleteState {
  isLoading: boolean
  success: boolean
  error: ApiTasksTypes['ProblemDetails'] | null
}

export const initialTaskDeleteState: ITaskDeleteState = {
  isLoading: false,
  success: false,
  error: null,
}

/**
 * ==========================================
 * TASK TOGGLE STATE
 * ==========================================
 */

export interface ITaskToggleState {
  taskId: string
  isLoading: boolean
  success: boolean
  error: ApiTasksTypes['ProblemDetails'] | null
}

export const initialTaskToggleState: ITaskToggleState = {
  taskId: '',
  isLoading: false,
  success: false,
  error: null,
}
