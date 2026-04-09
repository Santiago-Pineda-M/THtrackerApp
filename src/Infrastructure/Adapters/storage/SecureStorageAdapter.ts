/**
 * INFRASTRUCTURE LAYER - SecureStorage Adapter
 * Implementación de ISecureStorage para entorno Web.
 * Usa localStorage con prefijo para evitar colisiones.
 *
 * NOTA: Este adapter NO provee encriptación real. Los datos se almacenan
 * en localStorage sin protección criptográfica. No usar para almacenar
 * información altamente sensible en entornos donde el usuario comparte el dispositivo.
 * Para mayor seguridad, considerar el uso de APIs nativas de storage seguro
 * (como Web Crypto API) en combinación con este adapter.
 */

import type { ISecureStorage } from '../../../Domain/IPatterns'

const STORAGE_PREFIX = 'thtracker:'

export class SecureStorageAdapter implements ISecureStorage {
  /**
   * Obtiene un valor del localStorage.
   */
  async get(key: string): Promise<string | null> {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`
      return localStorage.getItem(fullKey)
    } catch {
      return null
    }
  }

  /**
   * Guarda un valor en localStorage.
   */
  async set(key: string, value: string): Promise<void> {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`
      localStorage.setItem(fullKey, value)
    } catch {
      throw new Error(`Error saving to storage: ${key}`)
    }
  }

  /**
   * Elimina un valor del localStorage.
   */
  async delete(key: string): Promise<void> {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`
      localStorage.removeItem(fullKey)
    } catch {
      throw new Error(`Error deleting from storage: ${key}`)
    }
  }

  /**
   * Limpia todas las entradas con el prefijo.
   */
  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))
    } catch {
      throw new Error('Error clearing storage')
    }
  }
}
