import type { IUserSession, IAuthToken } from "../../Domain";
import { AuthStatus } from "../../Domain";

/**
 * CONTROLLERS LAYER - Auth Module
 * Interfaz del estado de autenticación.
 */
export interface IAuthState {
    status: AuthStatus;
    user?: IUserSession;
    token?: IAuthToken;
    error?: string;
}

export const initialAuthState: IAuthState = {
    status: AuthStatus.IDLE
};
