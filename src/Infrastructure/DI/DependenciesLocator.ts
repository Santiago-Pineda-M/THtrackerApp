// ============================================
// 1. IMPORTACIONES
// ============================================

// Application - Casos de Uso
import {
    LoginUserUseCase,
    RefreshTokenUseCases,
    RegisterUseCases,
    LogoutUseCase,
    CheckAuthSessionUseCase,
    GetSessionUseCase,
} from '../../Application/UseCases/Auth';

// Application - Casos de Uso User
import {
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
} from '../../Application/UseCases/User';

// Application - Casos de Uso Category
import {
    GetCategoriesUseCase,
    GetCategoryByIdUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
} from '../../Application/UseCases/Category';

// Application - Casos de Uso Sidebar
import {
    GetSidebarStateUseCase,
    SaveSidebarStateUseCase,
} from '../../Application/UseCases/Sidebar';

// Application - Casos de Uso Activity
import {
    GetActivitiesUseCase,
    GetActivityByIdUseCase,
    CreateActivityUseCase,
    UpdateActivityUseCase,
    DeleteActivityUseCase,
    GetValueDefinitionsUseCase,
    CreateValueDefinitionUseCase,
} from '../../Application/UseCases/Activity';

// Application - Casos de Uso ActivityLog
import {
    GetActivityLogsUseCase,
    GetActivityLogByIdUseCase,
    StartActivityLogUseCase,
    StopActivityLogUseCase,
    UpdateActivityLogUseCase,
    SaveActivityLogValuesUseCase,
    GetActivityLogValuesUseCase,
} from '../../Application/UseCases/ActivityLog';

// Controllers - Plocs
import { AuthPloc } from '../../Controllers/Auth/AuthPloc';
import { LoginPloc } from '../../Controllers/Auth/LoginPloc';
import { RegisterPloc } from '../../Controllers/Auth/RegisterPloc';
import { RefreshTokenPloc } from '../../Controllers/Auth/RefreshTokenPloc';
import { LogoutPloc } from '../../Controllers/Auth/LogoutPloc';
import { SidebarPloc } from '../../Controllers/Sidebar/SidebarPloc';
import { UserProfileDisplayPloc } from '../../Controllers/User/UserProfileDisplayPloc';
import { UserProfileFormPloc } from '../../Controllers/User/UserProfileFormPloc';
import { CategoriesListPloc } from '../../Controllers/Category/CategoriesListPloc';
import { CategoryDetailPloc } from '../../Controllers/Category/CategoryDetailPloc';
import { CategoryCreateFormPloc } from '../../Controllers/Category/CategoryCreateFormPloc';
import { CategoryEditFormPloc } from '../../Controllers/Category/CategoryEditFormPloc';
import { CategoryDeletePloc } from '../../Controllers/Category/CategoryDeletePloc';

// Controllers - Activity Plocs
import {
    ActivitiesListPloc,
    ActivityCreateFormPloc,
    ActivityDetailPloc,
    ActivityEditFormPloc,
    ActivityDeletePloc,
    ActivityValueDefinitionsListPloc,
    ValueDefinitionCreateFormPloc,
} from '../../Controllers/Activity';

// Controllers - ActivityLog Plocs
import {
    ActivityLogsListPloc,
    ActivityLogDetailPloc,
} from '../../Controllers/ActivityLog';

// Domain
import { isoToExpiresInSeconds } from '../../Domain';

// Infrastructure - Adaptadores y Servicios
import { TokenRefreshStrategy } from '../Adapters/http/TokenRefreshStrategy';
import { FetchHttpClient } from '../Adapters/http/FetchHttpClient';
import { SecureStorageAdapter, LocalStorageAdapter } from '../Adapters/storage';
import { AuthSessionRepository } from '../Repositories/AuthSessionRepository';
import { SidebarRepository } from '../Repositories/SidebarRepository';
import { AuthService } from '../Services/AuthService';
import { UserService } from '../Services/UserService';
import { CategoryService } from '../Services/CategoryService';
import { ActivityService } from '../Services/ActivityService';
import { ActivityLogService } from '../Services/ActivityLogService';


// ============================================
// 2. CONSTANTES Y CONFIGURACIÓN
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'https://thtracker-api.onrender.com';


// ============================================
// 3. ADAPTADORES (Storage)
// ============================================

const secureStorageAdapter = new SecureStorageAdapter();
const localStorageAdapter = new LocalStorageAdapter('sidebar');


// ============================================
// 4. REPOSITORIOS
// ============================================

const authSessionRepository = new AuthSessionRepository(secureStorageAdapter);
const sidebarRepository = new SidebarRepository(localStorageAdapter);


// ============================================
// 5. FUNCIONES AUXILIARES PARA HTTP CLIENT
// ============================================

const getAccessToken = () =>
    authSessionRepository.getSession().then((s) => s?.accessToken ?? null);

const getRefreshToken = () =>
    authSessionRepository.getSession().then((s) => s?.refreshToken ?? null);

const onSessionRefreshed = async (
    newAccessToken: string,
    response: import('../../Domain').IRefreshTokenResponse
) => {
    const currentSession = await authSessionRepository.getSession();
    if (!currentSession) return;

    const updatedSession = currentSession.updateTokens(
        newAccessToken,
        response.refreshToken,
        isoToExpiresInSeconds(response.refreshTokenExpiry)
    );

    await authSessionRepository.saveSession(updatedSession);
};


// ============================================
// 6. HTTP CLIENT (con estrategia de refresh)
// ============================================

const refreshStrategy = new TokenRefreshStrategy(API_URL, getRefreshToken, onSessionRefreshed);
const httpClient = new FetchHttpClient(API_URL, getAccessToken, refreshStrategy);


// ============================================
// 7. SERVICIOS
// ============================================

const authService = new AuthService(httpClient);
const userService = new UserService(httpClient);
const categoryService = new CategoryService(httpClient);
const activityService = new ActivityService(httpClient);
const activityLogService = new ActivityLogService(httpClient);



// ============================================
// 8. CASOS DE USO (Use Cases)
// ============================================

const loginUserUseCase = new LoginUserUseCase(authService, authSessionRepository);
const registerUseCases = new RegisterUseCases(authService);
const refreshTokenUseCases = new RefreshTokenUseCases(authService, authSessionRepository);
const logoutUseCase = new LogoutUseCase(authSessionRepository);
const checkAuthSessionUseCase = new CheckAuthSessionUseCase(authSessionRepository, authService);
const getSessionUseCase = new GetSessionUseCase(authSessionRepository);

// Sidebar Use Cases
const getSidebarStateUseCase = new GetSidebarStateUseCase(sidebarRepository);
const saveSidebarStateUseCase = new SaveSidebarStateUseCase(sidebarRepository);

// User Use Cases
const getUserProfileUseCase = new GetUserProfileUseCase(userService);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userService);

// Category Use Cases
const getCategoriesUseCase = new GetCategoriesUseCase(categoryService);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryService);
const createCategoryUseCase = new CreateCategoryUseCase(categoryService);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryService);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryService);

// Activity Use Cases
const getActivitiesUseCase = new GetActivitiesUseCase(activityService);
const getActivityByIdUseCase = new GetActivityByIdUseCase(activityService);
const createActivityUseCase = new CreateActivityUseCase(activityService);
const updateActivityUseCase = new UpdateActivityUseCase(activityService);
const deleteActivityUseCase = new DeleteActivityUseCase(activityService);
const getValueDefinitionsUseCase = new GetValueDefinitionsUseCase(activityService);
const createValueDefinitionUseCase = new CreateValueDefinitionUseCase(activityService);

// ActivityLog Use Cases
const getActivityLogsUseCase = new GetActivityLogsUseCase(activityLogService);
const getActivityLogByIdUseCase = new GetActivityLogByIdUseCase(activityLogService);
const startActivityLogUseCase = new StartActivityLogUseCase(activityLogService);
const stopActivityLogUseCase = new StopActivityLogUseCase(activityLogService);
const updateActivityLogUseCase = new UpdateActivityLogUseCase(activityLogService);
const saveActivityLogValuesUseCase = new SaveActivityLogValuesUseCase(activityLogService);
const getActivityLogValuesUseCase = new GetActivityLogValuesUseCase(activityLogService);



// ============================================
// 9. CONTROLLERS / PLOCS
// ============================================

// AuthPloc principal - maneja el estado global de autenticación
const authPloc = new AuthPloc(
    checkAuthSessionUseCase,
    getSessionUseCase,
    authSessionRepository
);

// LoginPloc - maneja el flujo de inicio de sesión
const loginPloc = new LoginPloc(loginUserUseCase, authPloc);

// RegisterPloc - maneja el flujo de registro
const registerPloc = new RegisterPloc(registerUseCases);

// RefreshTokenPloc - maneja la renovación de tokens
const refreshTokenPloc = new RefreshTokenPloc(refreshTokenUseCases, getSessionUseCase);

// LogoutPloc - maneja el cierre de sesión
const logoutPloc = new LogoutPloc(logoutUseCase, authPloc);

// SidebarPloc - maneja el estado del Sidebar con persistencia
const sidebarPloc = new SidebarPloc(getSidebarStateUseCase, saveSidebarStateUseCase);

// UserProfilePloc - maneja el perfil del usuario
const userProfileDisplayPloc = new UserProfileDisplayPloc(getUserProfileUseCase, authPloc);
const userProfileFormPloc = new UserProfileFormPloc(updateUserProfileUseCase, getUserProfileUseCase, authPloc);

// CategoriesPloc - maneja las categorías
const categoriesListPloc = new CategoriesListPloc(getCategoriesUseCase);
const categoryDetailPloc = new CategoryDetailPloc(getCategoryByIdUseCase);
const categoryCreateFormPloc = new CategoryCreateFormPloc(createCategoryUseCase);
const categoryEditFormPloc = new CategoryEditFormPloc(updateCategoryUseCase, getCategoryByIdUseCase);
const categoryDeletePloc = new CategoryDeletePloc(deleteCategoryUseCase);

// Activity Plocs
const activitiesListPloc = new ActivitiesListPloc(getActivitiesUseCase);
const activityDetailPloc = new ActivityDetailPloc(getActivityByIdUseCase);
const activityCreateFormPloc = new ActivityCreateFormPloc(createActivityUseCase);
const activityEditFormPloc = new ActivityEditFormPloc(updateActivityUseCase, getActivityByIdUseCase);
const activityDeletePloc = new ActivityDeletePloc(deleteActivityUseCase);
const activityValueDefinitionsListPloc = new ActivityValueDefinitionsListPloc(getValueDefinitionsUseCase);
const valueDefinitionCreateFormPloc = new ValueDefinitionCreateFormPloc(createValueDefinitionUseCase);

// ActivityLog Plocs
const activityLogsListPloc = new ActivityLogsListPloc(getActivityLogsUseCase, startActivityLogUseCase, stopActivityLogUseCase);
const activityLogDetailPloc = new ActivityLogDetailPloc(getActivityLogByIdUseCase, updateActivityLogUseCase, saveActivityLogValuesUseCase, getActivityLogValuesUseCase);


// ============================================
// 10. INTERFAZ DE DEPENDENCIAS
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
    providerActivityValueDefinitionsListPloc: ActivityValueDefinitionsListPloc
    providerValueDefinitionCreateFormPloc: ValueDefinitionCreateFormPloc
    providerActivityLogsListPloc: ActivityLogsListPloc
    providerActivityLogDetailPloc: ActivityLogDetailPloc
}


// ============================================
// 11. FUNCIONES PROVIDER
// ============================================

function provideLoginPloc(): LoginPloc {
    return loginPloc;
}

function provideAuthPloc(): AuthPloc {
    return authPloc;
}

function provideRegisterPloc(): RegisterPloc {
    return registerPloc;
}

function provideRefreshTokenPloc(): RefreshTokenPloc {
    return refreshTokenPloc;
}

function provideLogoutPloc(): LogoutPloc {
    return logoutPloc;
}

function provideAuthSessionRepository(): AuthSessionRepository {
    return authSessionRepository;
}

function provideSidebarPloc(): SidebarPloc {
    return sidebarPloc;
}

function provideUserProfileDisplayPloc(): UserProfileDisplayPloc {
    return userProfileDisplayPloc;
}

function provideUserProfileFormPloc(): UserProfileFormPloc {
    return userProfileFormPloc;
}

function provideCategoriesListPloc(): CategoriesListPloc {
    return categoriesListPloc;
}

function provideCategoryDetailPloc(): CategoryDetailPloc {
    return categoryDetailPloc;
}

function provideCategoryCreateFormPloc(): CategoryCreateFormPloc {
    return categoryCreateFormPloc;
}

function provideCategoryEditFormPloc(): CategoryEditFormPloc {
    return categoryEditFormPloc;
}

function provideCategoryDeletePloc(): CategoryDeletePloc {
    return categoryDeletePloc;
}

// Activity Providers
function provideActivitiesListPloc(): ActivitiesListPloc {
    return activitiesListPloc;
}

function provideActivityDetailPloc(): ActivityDetailPloc {
    return activityDetailPloc;
}

function provideActivityCreateFormPloc(): ActivityCreateFormPloc {
    return activityCreateFormPloc;
}

function provideActivityEditFormPloc(): ActivityEditFormPloc {
    return activityEditFormPloc;
}

function provideActivityDeletePloc(): ActivityDeletePloc {
    return activityDeletePloc;
}

function provideActivityValueDefinitionsListPloc(): ActivityValueDefinitionsListPloc {
    return activityValueDefinitionsListPloc;
}

function provideValueDefinitionCreateFormPloc(): ValueDefinitionCreateFormPloc {
    return valueDefinitionCreateFormPloc;
}

// ActivityLog Providers
function provideActivityLogsListPloc(): ActivityLogsListPloc {
    return activityLogsListPloc;
}

function provideActivityLogDetailPloc(): ActivityLogDetailPloc {
    return activityLogDetailPloc;
}


// ============================================
// 12. LOCATOR PÚBLICO
// ============================================

export const dependenciesLocator: Dependencies = {
    providerLoginPloc: provideLoginPloc(),
    providerAuthPloc: provideAuthPloc(),
    providerRegisterPloc: provideRegisterPloc(),
    providerRefreshTokenPloc: provideRefreshTokenPloc(),
    providerLogoutPloc: provideLogoutPloc(),
    providerAuthSessionRepository: provideAuthSessionRepository(),
    providerSidebarPloc: provideSidebarPloc(),
    providerUserProfileDisplayPloc: provideUserProfileDisplayPloc(),
    providerUserProfileFormPloc: provideUserProfileFormPloc(),
    providerCategoriesListPloc: provideCategoriesListPloc(),
    providerCategoryDetailPloc: provideCategoryDetailPloc(),
    providerCategoryCreateFormPloc: provideCategoryCreateFormPloc(),
    providerCategoryEditFormPloc: provideCategoryEditFormPloc(),
    providerCategoryDeletePloc: provideCategoryDeletePloc(),
    providerActivitiesListPloc: provideActivitiesListPloc(),
    providerActivityDetailPloc: provideActivityDetailPloc(),
    providerActivityCreateFormPloc: provideActivityCreateFormPloc(),
    providerActivityEditFormPloc: provideActivityEditFormPloc(),
    providerActivityDeletePloc: provideActivityDeletePloc(),
    providerActivityValueDefinitionsListPloc: provideActivityValueDefinitionsListPloc(),
    providerValueDefinitionCreateFormPloc: provideValueDefinitionCreateFormPloc(),
    providerActivityLogsListPloc: provideActivityLogsListPloc(),
    providerActivityLogDetailPloc: provideActivityLogDetailPloc(),
};
