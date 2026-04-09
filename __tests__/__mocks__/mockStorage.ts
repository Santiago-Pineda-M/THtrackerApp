import { vi } from 'vitest'
import type { IStorage } from '../../src/Domain/IPatterns'

/**
 * Fábrica de mock para IStorage.
 * Uso: const storage = createMockStorage();
 */
export const createMockStorage = (): IStorage => ({
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
})
