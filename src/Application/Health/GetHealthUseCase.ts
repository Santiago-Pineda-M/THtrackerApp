/**
 * APPLICATION LAYER - Health Module
 * Caso de Uso: Verificar si el API está disponible (health check).
 * Depende de IHttpClient (contrato del dominio), no de la implementación concreta.
 */
import type { IUseCase } from "../../Domain/Interfaces/IUseCase";
import type { IHttpClient } from "../../Domain/Interfaces/IHttpClient";

export class GetHealthUseCase implements IUseCase<void, boolean> {
    private readonly httpClient: IHttpClient;
    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async execute(): Promise<boolean> {
        try {
            const response = await this.httpClient.get("/api/v1/health");
            return response.status === 200;
        } catch {
            return false;
        }
    }
}
