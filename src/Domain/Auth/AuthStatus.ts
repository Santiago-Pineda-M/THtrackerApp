/**
 * DOMAIN LAYER - Auth Module
 * Definición de los estados para la máquina de estados de autenticación.
 * Se usa un objeto constante y un tipo derivado para cumplir con 'erasableSyntaxOnly'.
 */
export const AuthStatus = {
    IDLE: 'IDLE',
    AUTHENTICATING: 'AUTHENTICATING',
    AUTHENTICATED: 'AUTHENTICATED',
    FAILED: 'FAILED',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    LOGGING_OUT: 'LOGGING_OUT',
    REFRESHING_TOKEN: 'REFRESHING_TOKEN',
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];
