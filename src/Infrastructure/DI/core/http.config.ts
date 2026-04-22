import { FetchHttpClient } from '../../Adapters/http/FetchHttpClient'
import { TokenRefreshStrategy } from '../../Adapters/http/TokenRefreshStrategy'
import { RequestCache } from '../../Adapters/http/RequestCache'
import { InflightDeduplicator } from '../../Adapters/http/InflightDeduplicator'
import { authSessionRepository } from './storage.config'
import { isoToExpiresInSeconds } from '../../../Domain'
import type { IRefreshTokenResponse } from '../../../Domain'

const API_URL =
  import.meta.env.VITE_API_URL || 'https://thtracker-api.onrender.com'

const getAccessToken = () =>
  authSessionRepository.getSession().then((s) => s?.accessToken ?? null)
const getRefreshToken = () =>
  authSessionRepository.getSession().then((s) => s?.refreshToken ?? null)

const onSessionRefreshed = async (
  newAccessToken: string,
  response: IRefreshTokenResponse
) => {
  const currentSession = await authSessionRepository.getSession()
  if (!currentSession) return
  const updatedSession = currentSession.updateTokens(
    newAccessToken,
    response.refreshToken,
    isoToExpiresInSeconds(response.refreshTokenExpiry)
  )
  await authSessionRepository.saveSession(updatedSession)
}

const refreshStrategy = new TokenRefreshStrategy(
  API_URL,
  getRefreshToken,
  onSessionRefreshed
)
const requestCache = new RequestCache()
const inflightDeduplicator = new InflightDeduplicator()

export const httpClient = new FetchHttpClient(
  API_URL,
  getAccessToken,
  refreshStrategy,
  requestCache,
  inflightDeduplicator
)
