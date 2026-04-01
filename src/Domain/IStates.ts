/**
 * DOMAIN LAYER - State Interfaces
 * Contiene los estados globales para los PLOCs de autenticación.
 * Centralizado siguiendo principios de Clean Architecture para evitar acoplamiento ciclico.
 */

import type { AuthSession } from './Entities/AuthSession';
import type { ApiErrorResponse } from './Common/IApiErrorResponse';
import type { ActivityValueDefinitionResponse } from './Activity/IActivityResponses';
import type { ActivityLogResponse } from './ActivityLog/IActivityLogResponses';

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
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

/**
 * Interfaz del estado de autenticación usado por AuthPloc.
 */
export interface IAuthState {
    status: AuthStatus,
    user?: AuthSession | null;
}

export const initialAuthState: IAuthState = {
    status: AuthStatus.IDLE,
    user: undefined,
};

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
    email: string;
    password: string;
    errors: Record<string, string[]>;
    success: boolean;
    message: string;
    isLoading: boolean;
}

export const initialLoginState: ILoginState = {
    email: '',
    password: '',
    errors: {},
    success: false,
    message: '',
    isLoading: false,
};

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
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    errors: Record<string, string[]>;
    success: boolean;
    message: string;
    isLoading: boolean;
}

export const initialRegisterState: IRegisterState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
    success: false,
    message: '',
    isLoading: false,
};

/**
 * ==========================================
 * REFRESH TOKEN STATES
 * ==========================================
 */

export interface IRefreshTokenState {
    isRefreshing: boolean;
    success: boolean;
    error?: string;
}

export const initialRefreshTokenState: IRefreshTokenState = {
    isRefreshing: false,
    success: false,
    error: undefined,
};

/**
 * ==========================================
 * LOGOUT STATES
 * ==========================================
 */

export interface ILogoutState {
    isLoggingOut: boolean;
    success: boolean;
    error?: string;
}

export const initialLogoutState: ILogoutState = {
    isLoggingOut: false,
    success: false,
    error: undefined,
};

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
    isMenuOpen: boolean;
}

export const initialSidebarState: ISidebarState = {
    isMenuOpen: true,
};

/**
 * ==========================================
 * USER PROFILE DISPLAY STATE
 * ==========================================
 */

/**
 * Estado simple para mostrar el perfil del usuario (consulta)
 */
export interface IUserProfileDisplayState {
    user: {
        id: string;
        name: string | null;
        email: string | null;
    } | null;
    error: {
        title?: string;
        detail?: string;
    } | null;
    isLoading: boolean;
}

export const initialUserProfileDisplayState: IUserProfileDisplayState = {
    user: null,
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * USER PROFILE FORM STATE
 * ==========================================
 */

/**
 * Estado simple para el formulario de actualización de perfil
 */
export interface IUserProfileFormState {
    name: string;
    email: string;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        name: string;
        email: string;
    };
}

export const initialUserProfileFormState: IUserProfileFormState = {
    name: '',
    email: '',
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        name: '',
        email: '',
    },
};

/**
 * ==========================================
 * CATEGORIES LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de categorías del usuario autenticado
 */
export interface ICategoriesListState {
    categories: Array<{
        id: string;
        userId: string;
        name: string | null;
        color: string | null;
    }>;
    error: ApiErrorResponse | null;
    isLoading: boolean;
}

export const initialCategoriesListState: ICategoriesListState = {
    categories: [],
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * CATEGORY DETAIL STATE
 * ==========================================
 */

/**
 * Estado para mostrar una categoría individual
 */
export interface ICategoryDetailState {
    category: {
        id: string;
        userId: string;
        name: string | null;
        color: string | null;
    } | null;
    error: ApiErrorResponse | null;
    isLoading: boolean;
}

export const initialCategoryDetailState: ICategoryDetailState = {
    category: null,
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * CATEGORY CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de categoría
 */
export interface ICategoryCreateFormState {
    name: string;
    color: string;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        name: string;
        color: string;
    };
}

export const initialCategoryCreateFormState: ICategoryCreateFormState = {
    name: '',
    color: '',
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        name: '',
        color: '',
    },
};

/**
 * ==========================================
 * CATEGORY EDIT FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de edición de categoría
 */
export interface ICategoryEditFormState {
    id: string;
    name: string;
    color: string;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        name: string;
        color: string;
    };
}

export const initialCategoryEditFormState: ICategoryEditFormState = {
    id: '',
    name: '',
    color: '',
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        name: '',
        color: '',
    },
};

/**
 * ==========================================
 * ACTIVITIES LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de actividades del usuario autenticado
 */
export interface IActivitiesListState {
    activities: Array<{
        id: string;
        userId: string;
        categoryId: string;
        name: string | null;
        color: string | null;
        allowOverlap: boolean;
    }>;
    error: ApiErrorResponse | null;
    isLoading: boolean;
}

export const initialActivitiesListState: IActivitiesListState = {
    activities: [],
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * ACTIVITY DETAIL STATE
 * ==========================================
 */

/**
 * Estado para mostrar una actividad individual
 */
export interface IActivityDetailState {
    activity: {
        id: string;
        userId: string;
        categoryId: string;
        name: string | null;
        color: string | null;
        allowOverlap: boolean;
    } | null;
    error: ApiErrorResponse | null;
    isLoading: boolean;
}

export const initialActivityDetailState: IActivityDetailState = {
    activity: null,
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * ACTIVITY CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de actividad
 */
export interface IActivityCreateFormState {
    categoryId: string;
    name: string;
    color: string;
    allowOverlap: boolean;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        categoryId: string;
        name: string;
        color: string;
        allowOverlap: boolean;
    };
}

export const initialActivityCreateFormState: IActivityCreateFormState = {
    categoryId: '',
    name: '',
    color: '',
    allowOverlap: false,
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        categoryId: '',
        name: '',
        color: '',
        allowOverlap: false,
    },
};

/**
 * ==========================================
 * ACTIVITY EDIT FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de edición de actividad
 */
export interface IActivityEditFormState {
    id: string;
    categoryId: string;
    name: string;
    color: string;
    allowOverlap: boolean;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        categoryId: string;
        name: string;
        color: string;
        allowOverlap: boolean;
    };
}

export const initialActivityEditFormState: IActivityEditFormState = {
    id: '',
    categoryId: '',
    name: '',
    color: '',
    allowOverlap: false,
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        categoryId: '',
        name: '',
        color: '',
        allowOverlap: false,
    },
};

/**
 * ==========================================
 * ACTIVITY DELETE STATE
 * ==========================================
 */

/**
 * Estado para la eliminación de una actividad
 */
export interface IActivityDeleteState {
    isLoading: boolean;
    success: boolean;
    error: ApiErrorResponse | null;
}

export const initialActivityDeleteState: IActivityDeleteState = {
    isLoading: false,
    success: false,
    error: null,
};

/**
 * ==========================================
 * ACTIVITY VALUE DEFINITIONS LIST STATE
 * ==========================================
 */

/**
 * Estado para la lista de definiciones de valor de una actividad
 */
export interface IActivityValueDefinitionsState {
    activityId: string | null;
    definitions: ActivityValueDefinitionResponse[];
    isLoading: boolean;
    error: ApiErrorResponse | null;
}

export const initialActivityValueDefinitionsState: IActivityValueDefinitionsState = {
    activityId: null,
    definitions: [],
    isLoading: false,
    error: null,
};

/**
 * ==========================================
 * VALUE DEFINITION CREATE FORM STATE
 * ==========================================
 */

/**
 * Estado para el formulario de creación de una definición de valor
 */
export interface IValueDefinitionCreateFormState {
    activityId: string;
    name: string;
    valueType: string;
    isRequired: boolean;
    unit: string;
    minValue: string;
    maxValue: string;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
}

export const initialValueDefinitionCreateFormState: IValueDefinitionCreateFormState = {
    activityId: '',
    name: '',
    valueType: 'Number',
    isRequired: false,
    unit: '',
    minValue: '',
    maxValue: '',
    errors: {},
    isLoading: false,
    success: false,
    message: '',
};

/**
 * ==========================================
 * ACTIVITY LOGS STATES
 * ==========================================
 */

/**
 * Estado para la lista de registros (logs) de una actividad
 */
export interface IActivityLogsListState {
    activityId: string;
    logs: ActivityLogResponse[];
    isLoading: boolean;
    error: ApiErrorResponse | null;
}

export const initialActivityLogsListState: IActivityLogsListState = {
    activityId: '',
    logs: [],
    isLoading: false,
    error: null,
};

/**
 * Estado para el detalle y edición de valores de un registro de actividad específico
 */
export interface IActivityLogDetailState {
    log: ActivityLogResponse | null;
    isLoading: boolean;
    error: ApiErrorResponse | null;
    success: boolean;
    message: string;
}

export const initialActivityLogDetailState: IActivityLogDetailState = {
    log: null,
    isLoading: false,
    error: null,
    success: false,
    message: '',
};
