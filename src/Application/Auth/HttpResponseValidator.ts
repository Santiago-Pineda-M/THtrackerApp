import type { ProblemDetails } from "./AuthDTOs";

/**
 * Códigos de estado HTTP esperados por operación
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

/**
 * Opciones para validar respuesta HTTP
 */
interface HttpResponseValidationOptions {
    /** Mensaje de error por defecto */
    defaultMessage: string;
    /** Códigos de estado considerados como éxito */
    expectedStatuses?: readonly number[];
}

/**
 * Valida que el código de estado HTTP sea exitoso y devuelve los datos.
 * Si no es exitoso, lanza un Error con el detalle del problema.
 * 
 * @param response - Respuesta HTTP del cliente
 * @param options - Opciones de validación
 * @returns Los datos de la respuesta
 * @throws Error si el código de estado no es exitoso
 */
export function validateHttpResponse<T>(
    response: { status: number; data: unknown },
    options: HttpResponseValidationOptions
): T {
    const expectedStatuses = options.expectedStatuses ?? [HttpStatus.OK];
    
    if (!expectedStatuses.includes(response.status)) {
        const errorData = response.data as ProblemDetails;
        throw new Error(
            errorData?.detail || 
            errorData?.title || 
            options.defaultMessage
        );
    }
    
    return response.data as T;
}

/**
 * Helper específico para operaciones de login (espera 200)
 */
export function validateLoginResponse<T>(
    response: { status: number; data: unknown },
    defaultMessage = "Error al iniciar sesión"
): T {
    return validateHttpResponse<T>(response, {
        defaultMessage,
        expectedStatuses: [HttpStatus.OK]
    });
}

/**
 * Helper específico para operaciones de registro (espera 200 o 201)
 */
export function validateRegisterResponse<T>(
    response: { status: number; data: unknown },
    defaultMessage = "Error al crear la cuenta"
): T {
    return validateHttpResponse<T>(response, {
        defaultMessage,
        expectedStatuses: [HttpStatus.OK, HttpStatus.CREATED]
    });
}

/**
 * Helper específico para operaciones de refresh token (espera 200)
 */
export function validateRefreshTokenResponse<T>(
    response: { status: number; data: unknown },
    defaultMessage = "Sesión expirada"
): T {
    return validateHttpResponse<T>(response, {
        defaultMessage,
        expectedStatuses: [HttpStatus.OK]
    });
}

/**
 * Helper específico para obtener datos del usuario (espera 200)
 */
export function validateUserResponse<T>(
    response: { status: number; data: unknown },
    defaultMessage = "No se pudo obtener el perfil"
): T {
    return validateHttpResponse<T>(response, {
        defaultMessage,
        expectedStatuses: [HttpStatus.OK]
    });
}
