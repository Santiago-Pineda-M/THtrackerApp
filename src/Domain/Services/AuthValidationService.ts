/**
 * DOMAIN LAYER - Domain Services
 * AuthValidationService: Servicio de dominio para validación de requests.
 * Este servicio contiene reglas de validación de negocio que no pertenecen a una entidad específica.
 */

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult<T> {
    valid: boolean;
    value?: T;
    errors?: ValidationError[];
}

/**
 * Validador de requests de autenticación.
 * Las reglas de validación viven en el dominio, no en la aplicación.
 */
export class AuthValidationService {
    
    /**
     * Valida un request de login.
     */
    validateLoginRequest(input: unknown): ValidationResult<LoginRequestData> {
        const errors: ValidationError[] = [];
        
        if (!input || typeof input !== 'object') {
            return { 
                valid: false, 
                errors: [{ field: 'body', message: 'Request body inválido' }] 
            };
        }
        
        const data = input as Record<string, unknown>;
        
        // Validar email
        const email = data.email;
        if (!email || typeof email !== 'string') {
            errors.push({ field: 'email', message: 'Email es requerido' });
        } else if (!this.isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Formato de email inválido' });
        }
        
        // Validar password
        const password = data.password;
        if (!password || typeof password !== 'string') {
            errors.push({ field: 'password', message: 'Contraseña es requerida' });
        } else if (password.length < 8) {
            errors.push({ field: 'password', message: 'Contraseña debe tener al menos 8 caracteres' });
        }
        
        // deviceInfo es opcional
        const deviceInfo = data.deviceInfo as string | undefined;
        
        if (errors.length > 0) {
            return { valid: false, errors };
        }
        
        return {
            valid: true,
            value: {
                email: email as string,
                password: password as string,
                deviceInfo
            }
        };
    }
    
    /**
     * Valida un request de registro.
     */
    validateRegisterRequest(input: unknown): ValidationResult<RegisterRequestData> {
        const errors: ValidationError[] = [];
        
        if (!input || typeof input !== 'object') {
            return { 
                valid: false, 
                errors: [{ field: 'body', message: 'Request body inválido' }] 
            };
        }
        
        const data = input as Record<string, unknown>;
        
        // Validar nombre
        const name = data.name;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            errors.push({ field: 'name', message: 'Nombre es requerido' });
        } else if (name.trim().length < 2) {
            errors.push({ field: 'name', message: 'Nombre debe tener al menos 2 caracteres' });
        }
        
        // Validar email
        const email = data.email;
        if (!email || typeof email !== 'string') {
            errors.push({ field: 'email', message: 'Email es requerido' });
        } else if (!this.isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Formato de email inválido' });
        }
        
        // Validar password
        const password = data.password;
        if (!password || typeof password !== 'string') {
            errors.push({ field: 'password', message: 'Contraseña es requerida' });
        } else {
            if (password.length < 8) {
                errors.push({ field: 'password', message: 'Contraseña debe tener al menos 8 caracteres' });
            }
            if (!this.hasRequiredPasswordStrength(password)) {
                errors.push({ 
                    field: 'password', 
                    message: 'Contraseña debe contener al menos una mayúscula y un número' 
                });
            }
        }
        
        if (errors.length > 0) {
            return { valid: false, errors };
        }
        
        return {
            valid: true,
            value: {
                name: name as string,
                email: email as string,
                password: password as string
            }
        };
    }
    
    /**
     * Valida formato de email.
     */
    private isValidEmail(email: string): boolean {
        const trimmed = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(trimmed);
    }
    
    /**
     * Verifica que la contraseña tenga fuerza mínima:
     * - Al menos 8 caracteres
     * - Al menos una mayúscula
     * - Al menos un número
     */
    private hasRequiredPasswordStrength(password: string): boolean {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasUpperCase && hasNumber;
    }
}

// Tipos para los datos validados
export interface LoginRequestData {
    email: string;
    password: string;
    deviceInfo?: string;
}

export interface RegisterRequestData {
    name: string;
    email: string;
    password: string;
}
