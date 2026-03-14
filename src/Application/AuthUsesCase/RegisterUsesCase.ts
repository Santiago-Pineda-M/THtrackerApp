/**
 * APPLICATION LAYER - RegisterUseCases
 * Caso de uso para registrar un nuevo usuario.
 */

import type { IUseCase } from '../../Domain';
import type { IRegistrationService } from '../Interfaces/IServices/IAuthService';
import type { IRegisterRequest } from '../../Domain/Request/IAuthRequest';
import type { IRegisterResponse, IConfirmEmailResponse, IResendEmailConfirmationResponse } from '../../Domain/Responses/IAuthResponses';
import type { ILoginResponseError } from '../../Domain/Responses/IAuthResponsesError';
import type { IConfirmEmailRequest, IResendEmailConfirmationRequest } from '../../Domain/Request/IAuthRequest';

/**
 * Output del caso de uso de registro.
 */
export type RegisterOutput = IRegisterResponse | ILoginResponseError;

/**
 * Caso de uso para registrar un nuevo usuario.
 */
export class RegisterUseCases implements IUseCase<IRegisterRequest, RegisterOutput> {
    private readonly registrationService: IRegistrationService;

    constructor(registrationService: IRegistrationService) {
        this.registrationService = registrationService;
    }

    async execute(input: IRegisterRequest): Promise<RegisterOutput> {
        return this.registrationService.register(input);
    }
}

/**
 * Caso de uso para confirmar el correo electrónico.
 */
export class ConfirmEmailUseCases implements IUseCase<IConfirmEmailRequest, IConfirmEmailResponse> {
    private readonly registrationService: IRegistrationService;

    constructor(registrationService: IRegistrationService) {
        this.registrationService = registrationService;
    }

    async execute(input: IConfirmEmailRequest): Promise<IConfirmEmailResponse> {
        return this.registrationService.confirmEmail(input);
    }
}

/**
 * Caso de uso para reenviar el correo de confirmación.
 */
export class ConfirmEmailGetUseCase implements IUseCase<IResendEmailConfirmationRequest, IResendEmailConfirmationResponse> {
    private readonly registrationService: IRegistrationService;

    constructor(registrationService: IRegistrationService) {
        this.registrationService = registrationService;
    }

    async execute(input: IResendEmailConfirmationRequest): Promise<IResendEmailConfirmationResponse> {
        return this.registrationService.resendConfirmationEmail(input);
    }
}
