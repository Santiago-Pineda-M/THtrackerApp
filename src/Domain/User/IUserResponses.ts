/**
 * DOMAIN LAYER - User Response Interfaces
 */

import type { ProblemDetails } from '../Common/ProblemDetails'

/**
 * Respuesta del endpoint GET /api/v1/users/me
 */
export interface UserProfileResponse {
  id: string
  name: string | null
  email: string | null
}

export type { ProblemDetails }
