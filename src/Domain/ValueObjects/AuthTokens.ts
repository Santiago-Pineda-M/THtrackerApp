/**
 * DOMAIN LAYER - Value Objects
 * AuthTokens: Value Object que encapsula los tokens de autenticación.
 * Maneja la lógica de expiración internamente.
 */

export interface AuthTokensProps {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // Unix timestamp en milisegundos
}

export class AuthTokens {
    private readonly accessToken: string;
    private readonly refreshToken: string;
    private readonly expiresAt: number;

    private constructor(props: AuthTokensProps) {
        this.accessToken = props.accessToken;
        this.refreshToken = props.refreshToken;
        this.expiresAt = props.expiresAt;
    }

    /**
     * Factory method que crea AuthTokens con validación.
     * @throws Error si los tokens son inválidos
     */
    static create(props: AuthTokensProps): AuthTokens {
        if (!props.accessToken || props.accessToken.trim() === '') {
            throw new Error('Access token es requerido');
        }
        if (!props.refreshToken || props.refreshToken.trim() === '') {
            throw new Error('Refresh token es requerido');
        }
        if (typeof props.expiresAt !== 'number' || props.expiresAt <= 0) {
            throw new Error('ExpiresAt debe ser un número positivo');
        }

        return new AuthTokens({
            accessToken: props.accessToken.trim(),
            refreshToken: props.refreshToken.trim(),
            expiresAt: props.expiresAt
        });
    }

    /**
     * Crea AuthTokens desde tokens nuevos + duración en segundos.
     */
    static createWithExpiry(
        accessToken: string,
        refreshToken: string,
        expiresInSeconds: number
    ): AuthTokens {
        const expiresAt = Date.now() + (expiresInSeconds * 1000);
        return AuthTokens.create({
            accessToken,
            refreshToken,
            expiresAt
        });
    }

    /**
     * Crea desde JSON persistido (sin validación extra).
     */
    static fromJSON(data: { accessToken: string; refreshToken: string; expiresAt: number }): AuthTokens {
        return AuthTokens.create(data);
    }

    // Getters
    getAccessToken(): string {
        return this.accessToken;
    }

    getRefreshToken(): string {
        return this.refreshToken;
    }

    getExpiresAt(): number {
        return this.expiresAt;
    }

    /**
     * Verifica si los tokens han expirado.
     */
    isExpired(): boolean {
        return Date.now() >= this.expiresAt;
    }

    /**
     * Verifica si los tokens necesitan refresh (expiran en menos de 5 minutos).
     */
    needsRefresh(): boolean {
        const fiveMinutes = 5 * 60 * 1000;
        return Date.now() >= (this.expiresAt - fiveMinutes);
    }

    /**
     * Crea nueva instancia con nuevos tokens (manteniendo estructura inmutable).
     */
    updateTokens(newAccessToken: string, newRefreshToken: string, expiresInSeconds: number): AuthTokens {
        return AuthTokens.createWithExpiry(newAccessToken, newRefreshToken, expiresInSeconds);
    }

    /**
     * Serializa a objeto plano para persistencia.
     */
    toJSON(): { accessToken: string; refreshToken: string; expiresAt: number } {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresAt: this.expiresAt
        };
    }
}
