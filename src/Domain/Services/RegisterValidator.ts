/**
 * DOMAIN LAYER - Register Validator
 * Validador especializado para requests de registro.
 */

import type { ValidationError, ValidationResult } from './types'

export interface RegisterRequestData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export class RegisterValidator {
  validate(input: unknown): ValidationResult<RegisterRequestData> {
    const errors: ValidationError[] = []

    if (!input || typeof input !== 'object') {
      return {
        valid: false,
        errors: [{ field: 'body', message: 'Request body inválido' }],
      }
    }

    const data = input as Record<string, unknown>

    const name = data.name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Nombre es requerido' })
    } else if (name.trim().length < 2) {
      errors.push({
        field: 'name',
        message: 'Nombre debe tener al menos 2 caracteres',
      })
    }

    const email = data.email
    if (!email || typeof email !== 'string') {
      errors.push({ field: 'email', message: 'Email es requerido' })
    } else if (!this.isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Formato de email inválido' })
    }

    const password = data.password
    if (!password || typeof password !== 'string') {
      errors.push({ field: 'password', message: 'Contraseña es requerida' })
    } else {
      if (password.length < 8) {
        errors.push({
          field: 'password',
          message: 'Contraseña debe tener al menos 8 caracteres',
        })
      }
      if (!this.hasRequiredPasswordStrength(password)) {
        errors.push({
          field: 'password',
          message:
            'Contraseña debe contener al menos una mayúscula y un número',
        })
      }
    }

    const confirmPassword = data.confirmPassword
    if (password && confirmPassword !== password) {
      errors.push({
        field: 'confirmPassword',
        message: 'Las contraseñas no coinciden',
      })
    }

    if (errors.length > 0) {
      return { valid: false, errors }
    }

    return {
      valid: true,
      value: {
        name: name as string,
        email: email as string,
        password: password as string,
      },
    }
  }

  private isValidEmail(email: string): boolean {
    const trimmed = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(trimmed)
  }

  private hasRequiredPasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return hasUpperCase && hasNumber
  }
}
