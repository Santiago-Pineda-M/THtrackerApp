import type { IUseCase } from "../../Domain/Interfaces/IUseCase";
import type { IHttpClient } from "../../Domain/Interfaces/IHttpClient";
import type { IUserSession } from "../../Domain/Auth/AuthEntities";
import type { UserDto } from "./AuthDTOs";
import { validateUserResponse } from "./HttpResponseValidator";

/**
 * APPLICATION LAYER - GetSessionUserUseCase
 * Obtiene el perfil del usuario autenticado.
 */
export class GetSessionUserUseCase implements IUseCase<void, IUserSession> {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async execute(): Promise<IUserSession> {
        const response = await this.httpClient.get<UserDto>('/api/v1/users/me');

        const data = validateUserResponse<UserDto>(response);

        return {
            id: data.id,
            name: data.name,
            email: data.email
        };
    }
}
