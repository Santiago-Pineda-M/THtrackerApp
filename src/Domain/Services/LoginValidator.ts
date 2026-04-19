/**
 * DOMAIN LAYER - Login Validator
 * Validador especializado para requests de login.
 */

import type { ValidationError, ValidationResult } from './types'

export interface LoginRequestData {
  email: string
  password: string
  deviceInfo?: string
}

export class LoginValidator {
  validate(input: unknown): ValidationResult<LoginRequestData> {
    const errors: ValidationError[] = []

    if (!input || typeof input !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'body', message: 'Request body inválido' }],
      }
    }

    const data = input as Record<string, unknown>

    const email = data.email
    if (!email || typeof email !== 'string') {
      errors.push({ field: 'email', message: 'Email es requerido' })
    } else if (!this.isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Formato de email inválido' })
    }

    const password = data.password
    if (!password || typeof password !== 'string') {
      errors.push({ field: 'password', message: 'Contraseña es requerida' })
    } else if (password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Contraseña debe tener al menos 8 caracteres',
      })
    }

    const deviceInfo = data.deviceInfo as string | undefined

    if (errors.length > 0) {
      return { valid: false, errors }
    }

    return {
      valid: true,
      value: {
        email: email as string,
        password: password as string,
        deviceInfo,
      },
    }
  }

  private isValidEmail(email: string): boolean {
    const trimmed = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(trimmed)
  }
}
