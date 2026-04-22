import {
  SecureStorageAdapter,
  LocalStorageAdapter,
} from '../../Adapters/storage'
import { AuthSessionRepository } from '../../Repositories/AuthSessionRepository'
import { SidebarRepository } from '../../Repositories/SidebarRepository'

export const secureStorageAdapter = new SecureStorageAdapter()
export const localStorageAdapter = new LocalStorageAdapter('sidebar')

export const authSessionRepository = new AuthSessionRepository(
  secureStorageAdapter
)
export const sidebarRepository = new SidebarRepository(localStorageAdapter)
