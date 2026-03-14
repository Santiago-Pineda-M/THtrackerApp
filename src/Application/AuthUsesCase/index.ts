/**
 * APPLICATION LAYER - AuthUseCases Barrel Export
 * Punto de entrada para los casos de uso de autenticación.
 */

// Login UseCases
export { LoginUserUseCase, RefreshTokenUseCases, type LoginOutput } from './LoginUseCases';

// Register UseCases
export { 
    RegisterUseCases, 
    ConfirmEmailUseCases, 
    ConfirmEmailGetUseCase, 
    type RegisterOutput 
} from './RegisterUsesCase';

// Password UseCases
export { ForgotPasswordUseCase, ResetPasswordUseCase } from './PasswordUseCases';

// Session UseCases
export { CheckAuthSessionUseCase, type CheckAuthSessionOutput } from './CheckAuthSessionUseCase';

// Logout UseCase
export { LogoutUseCase, type LogoutInput, type LogoutOutput } from './LogoutUseCase';
