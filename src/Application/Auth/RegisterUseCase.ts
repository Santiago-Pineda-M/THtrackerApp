import type { IUseCase } from "../../Domain/Interfaces/IUseCase";
import type { IHttpClient } from "../../Domain/Interfaces/IHttpClient";
import type { RegisterUserRequest } from "./AuthDTOs";
import { validateRegisterResponse } from "./HttpResponseValidator";

/**
 * APPLICATION LAYER - RegisterUseCase
 * Registra un nuevo usuario en el sistema.
 */
export class RegisterUseCase implements IUseCase<RegisterUserRequest, void> {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async execute(request: RegisterUserRequest): Promise<void> {
        const response = await this.httpClient.post<void>(
            '/api/v1/auth/register',
            request
        );

        validateRegisterResponse(response);
    }
}
