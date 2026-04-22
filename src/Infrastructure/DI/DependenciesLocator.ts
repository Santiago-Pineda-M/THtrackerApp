// ============================================
// DependenciesLocator — Orquestador de DI
// Cada propiedad es un getter lazy (Singleton
// garantizado por cada módulo).
// ============================================

// ── Core ──────────────────────────────────────────────────────────────────────
export { authSessionRepository } from './core/storage.config'

// ── Auth module ───────────────────────────────────────────────────────────────
import {
  getAuthPloc,
  getLoginPloc,
  getRegisterPloc,
  getRefreshTokenPloc,
  getLogoutPloc,
} from './modules/auth.module'

// ── Sidebar module ────────────────────────────────────────────────────────────
import { getSidebarPloc } from './modules/sidebar.module'

// ── User module ───────────────────────────────────────────────────────────────
import {
  getUserProfileDisplayPloc,
  getUserProfileFormPloc,
} from './modules/user.module'

// ── Category module ───────────────────────────────────────────────────────────
import {
  getCategoriesListPloc,
  getCategoryDetailPloc,
  getCategoryCreateFormPloc,
  getCategoryEditFormPloc,
  getCategoryDeletePloc,
} from './modules/category.module'

// ── Activity module ───────────────────────────────────────────────────────────
import {
  getActivitiesListPloc,
  getActivityDetailPloc,
  getActivityCreateFormPloc,
  getActivityEditFormPloc,
  getActivityDeletePloc,
  getActivityValueDefinitionsListPloc,
  getValueDefinitionCreateFormPloc,
  getValueDefinitionEditFormPloc,
  getValueDefinitionDeletePloc,
  createValueDefinitionDeletePloc,
} from './modules/activity.module'

// ── ActivityLog module ────────────────────────────────────────────────────────
import {
  getActivityLogsListPloc,
  getActivityLogDetailPloc,
  getActiveActivityLogsPloc,
  getActivityLogStartPloc,
  getActivityLogStopPloc,
  getCalendarLogsPloc,
} from './modules/activityLog.module'

// ── UserSession module ────────────────────────────────────────────────────────
import {
  getUserSessionsListPloc,
  getSessionRevokePloc,
} from './modules/userSession.module'

// ── TaskList module ───────────────────────────────────────────────────────────
import {
  getTaskListsPloc,
  getTaskListDetailPloc,
  getTaskListCreateFormPloc,
  getTaskListEditFormPloc,
  getTaskListDeletePloc,
  getTasksPloc,
  getTaskCreateFormPloc,
  getTaskEditFormPloc,
  getTaskDeletePloc,
  getTaskTogglePloc,
} from './modules/taskList.module'

// ── Date module ───────────────────────────────────────────────────────────────
import { getDateProvider } from './core/date.config'
import { authSessionRepository } from './core/storage.config'

// ── Tipos exportados para compatibilidad ──────────────────────────────────────
import type { AuthPloc } from '../../Controllers/Auth/AuthPloc'
import type { LoginPloc } from '../../Controllers/Auth/LoginPloc'
import type { RegisterPloc } from '../../Controllers/Auth/RegisterPloc'
import type { RefreshTokenPloc } from '../../Controllers/Auth/RefreshTokenPloc'
import type { LogoutPloc } from '../../Controllers/Auth/LogoutPloc'
import type { SidebarPloc } from '../../Controllers/Sidebar/SidebarPloc'
import type { UserProfileDisplayPloc } from '../../Controllers/User/UserProfileDisplayPloc'
import type { UserProfileFormPloc } from '../../Controllers/User/UserProfileFormPloc'
import type { CategoriesListPloc } from '../../Controllers/Category/CategoriesListPloc'
import type { CategoryDetailPloc } from '../../Controllers/Category/CategoryDetailPloc'
import type { CategoryCreateFormPloc } from '../../Controllers/Category/CategoryCreateFormPloc'
import type { CategoryEditFormPloc } from '../../Controllers/Category/CategoryEditFormPloc'
import type { CategoryDeletePloc } from '../../Controllers/Category/CategoryDeletePloc'
import type {
  ActivitiesListPloc,
  ActivityCreateFormPloc,
  ActivityDetailPloc,
  ActivityEditFormPloc,
  ActivityDeletePloc,
} from '../../Controllers/Activity'
import type {
  ActivityValueDefinitionListPloc,
  ActivityValueDefinitionCreateFormPloc,
  ActivityValueDefinitionEditFormPloc,
  ActivityValueDefinitionDeletePloc,
} from '../../Controllers/ActivityValueDefinition'
import type {
  ActivityLogsListPloc,
  ActivityLogDetailPloc,
  ActiveActivityLogsPloc,
  ActivityLogStartPloc,
  ActivityLogStopPloc,
  CalendarLogsPloc,
} from '../../Controllers/ActivityLog'
import type {
  UserSessionsListPloc,
  SessionRevokePloc,
} from '../../Controllers/UserSession'
import type {
  TaskListsPloc,
  TaskListDetailPloc,
  TaskListCreateFormPloc,
  TaskListEditFormPloc,
  TaskListDeletePloc,
  TasksPloc,
  TaskCreateFormPloc,
  TaskEditFormPloc,
  TaskDeletePloc,
  TaskTogglePloc,
} from '../../Controllers/TaskList'
import type { AuthSessionRepository } from '../Repositories/AuthSessionRepository'
import type { DateProvider } from '../Services/DateProvider'

// ============================================
// INTERFAZ DE DEPENDENCIAS
// ============================================

export interface Dependencies {
  providerLoginPloc: LoginPloc
  providerAuthPloc: AuthPloc
  providerRegisterPloc: RegisterPloc
  providerRefreshTokenPloc: RefreshTokenPloc
  providerLogoutPloc: LogoutPloc
  providerAuthSessionRepository: AuthSessionRepository
  providerSidebarPloc: SidebarPloc
  providerUserProfileDisplayPloc: UserProfileDisplayPloc
  providerUserProfileFormPloc: UserProfileFormPloc
  providerCategoriesListPloc: CategoriesListPloc
  providerCategoryDetailPloc: CategoryDetailPloc
  providerCategoryCreateFormPloc: CategoryCreateFormPloc
  providerCategoryEditFormPloc: CategoryEditFormPloc
  providerCategoryDeletePloc: CategoryDeletePloc
  // Activity Providers
  providerActivitiesListPloc: ActivitiesListPloc
  providerActivityDetailPloc: ActivityDetailPloc
  providerActivityCreateFormPloc: ActivityCreateFormPloc
  providerActivityEditFormPloc: ActivityEditFormPloc
  providerActivityDeletePloc: ActivityDeletePloc
  providerActivityValueDefinitionsListPloc: ActivityValueDefinitionListPloc
  providerValueDefinitionCreateFormPloc: ActivityValueDefinitionCreateFormPloc
  providerValueDefinitionEditFormPloc: ActivityValueDefinitionEditFormPloc
  providerValueDefinitionDeletePloc: ActivityValueDefinitionDeletePloc
  providerActivityLogsListPloc: ActivityLogsListPloc
  providerActivityLogDetailPloc: ActivityLogDetailPloc
  providerActiveActivityLogsPloc: ActiveActivityLogsPloc
  providerActivityLogStartPloc: ActivityLogStartPloc
  providerActivityLogStopPloc: ActivityLogStopPloc
  providerCalendarLogsPloc: CalendarLogsPloc
  // UserSession Providers
  providerUserSessionsListPloc: UserSessionsListPloc
  providerSessionRevokePloc: SessionRevokePloc
  providerDateProvider: DateProvider
  // TaskList Providers
  providerTaskListsPloc: TaskListsPloc
  providerTaskListDetailPloc: TaskListDetailPloc
  providerTaskListCreateFormPloc: TaskListCreateFormPloc
  providerTaskListEditFormPloc: TaskListEditFormPloc
  providerTaskListDeletePloc: TaskListDeletePloc
  providerTasksPloc: TasksPloc
  providerTaskCreateFormPloc: TaskCreateFormPloc
  providerTaskEditFormPloc: TaskEditFormPloc
  providerTaskDeletePloc: TaskDeletePloc
  providerTaskTogglePloc: TaskTogglePloc
  // Factory functions
  createValueDefinitionDeletePloc: () => ActivityValueDefinitionDeletePloc
}

// ============================================
// LOCATOR PÚBLICO — solo getters (lazy)
// ============================================

export const dependenciesLocator: Dependencies = {
  get providerLoginPloc() {
    return getLoginPloc()
  },
  get providerAuthPloc() {
    return getAuthPloc()
  },
  get providerRegisterPloc() {
    return getRegisterPloc()
  },
  get providerRefreshTokenPloc() {
    return getRefreshTokenPloc()
  },
  get providerLogoutPloc() {
    return getLogoutPloc()
  },
  get providerAuthSessionRepository() {
    return authSessionRepository
  },
  get providerSidebarPloc() {
    return getSidebarPloc()
  },
  get providerUserProfileDisplayPloc() {
    return getUserProfileDisplayPloc()
  },
  get providerUserProfileFormPloc() {
    return getUserProfileFormPloc()
  },
  get providerCategoriesListPloc() {
    return getCategoriesListPloc()
  },
  get providerCategoryDetailPloc() {
    return getCategoryDetailPloc()
  },
  get providerCategoryCreateFormPloc() {
    return getCategoryCreateFormPloc()
  },
  get providerCategoryEditFormPloc() {
    return getCategoryEditFormPloc()
  },
  get providerCategoryDeletePloc() {
    return getCategoryDeletePloc()
  },
  get providerActivitiesListPloc() {
    return getActivitiesListPloc()
  },
  get providerActivityDetailPloc() {
    return getActivityDetailPloc()
  },
  get providerActivityCreateFormPloc() {
    return getActivityCreateFormPloc()
  },
  get providerActivityEditFormPloc() {
    return getActivityEditFormPloc()
  },
  get providerActivityDeletePloc() {
    return getActivityDeletePloc()
  },
  get providerActivityValueDefinitionsListPloc() {
    return getActivityValueDefinitionsListPloc()
  },
  get providerValueDefinitionCreateFormPloc() {
    return getValueDefinitionCreateFormPloc()
  },
  get providerValueDefinitionEditFormPloc() {
    return getValueDefinitionEditFormPloc()
  },
  get providerValueDefinitionDeletePloc() {
    return getValueDefinitionDeletePloc()
  },
  get providerActivityLogsListPloc() {
    return getActivityLogsListPloc()
  },
  get providerActivityLogDetailPloc() {
    return getActivityLogDetailPloc()
  },
  get providerActiveActivityLogsPloc() {
    return getActiveActivityLogsPloc()
  },
  get providerActivityLogStartPloc() {
    return getActivityLogStartPloc()
  },
  get providerActivityLogStopPloc() {
    return getActivityLogStopPloc()
  },
  get providerCalendarLogsPloc() {
    return getCalendarLogsPloc()
  },
  get providerUserSessionsListPloc() {
    return getUserSessionsListPloc()
  },
  get providerSessionRevokePloc() {
    return getSessionRevokePloc()
  },
  get providerDateProvider() {
    return getDateProvider()
  },
  get providerTaskListsPloc() {
    return getTaskListsPloc()
  },
  get providerTaskListDetailPloc() {
    return getTaskListDetailPloc()
  },
  get providerTaskListCreateFormPloc() {
    return getTaskListCreateFormPloc()
  },
  get providerTaskListEditFormPloc() {
    return getTaskListEditFormPloc()
  },
  get providerTaskListDeletePloc() {
    return getTaskListDeletePloc()
  },
  get providerTasksPloc() {
    return getTasksPloc()
  },
  get providerTaskCreateFormPloc() {
    return getTaskCreateFormPloc()
  },
  get providerTaskEditFormPloc() {
    return getTaskEditFormPloc()
  },
  get providerTaskDeletePloc() {
    return getTaskDeletePloc()
  },
  get providerTaskTogglePloc() {
    return getTaskTogglePloc()
  },
  createValueDefinitionDeletePloc,
}
