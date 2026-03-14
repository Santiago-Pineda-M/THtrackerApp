/**
 * APPLICATION LAYER - Password UseCases
 * Casos de uso para recuperación y reset de contraseña.
 */

import type { IUseCase } from '../../Domain';
import type { IPasswordService } from '../Interfaces/IServices/IAuthService';
import type { IForgotPasswordRequest, IResetPasswordRequest } from '../../Domain/Request/IAuthRequest';
import type { IForgotPasswordResponse, IResetPasswordResponse } from '../../Domain/Responses/IAuthResponses';

/**
 * Caso de uso para solicitar recuperación de contraseña.
 */
export class ForgotPasswordUseCase implements IUseCase<IForgotPasswordRequest, IForgotPasswordResponse> {
    private readonly passwordService: IPasswordService;

    constructor(passwordService: IPasswordService) {
        this.passwordService = passwordService;
    }

    async execute(input: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
        return this.passwordService.forgotPassword(input);
    }
}

/**
 * Caso de uso para resetear la contraseña.
 */
export class ResetPasswordUseCase implements IUseCase<IResetPasswordRequest, IResetPasswordResponse> {
    private readonly passwordService: IPasswordService;

    constructor(passwordService: IPasswordService) {
        this.passwordService = passwordService;
    }

    async execute(input: IResetPasswordRequest): Promise<IResetPasswordResponse> {
        return this.passwordService.resetPassword(input);
    }
}
