/**
 * Request para el endpoint PUT /api/v1/users/me
 * Solicitud para actualizar los datos del usuario autenticado
 */
export interface UpdateUserProfileRequest {
  name?: string | null;
  email?: string | null;
}
