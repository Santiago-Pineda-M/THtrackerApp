/**
 * DOMAIN LAYER - Auth Module
 * Entidades puras de dominio relacionadas con la autenticación.
 */

export interface IUserSession {
    id: string;
    name: string;
    email: string;
}

export interface IAuthToken {
    accessToken: string;
    refreshToken: string;
    expiry?: number | Date;
}

export interface IAuthSession {
    user: IUserSession;
    token: IAuthToken;
}
