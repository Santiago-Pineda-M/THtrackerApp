/**
 * APPLICATION LAYER - ActivityValueDefinition Service Interface
 * Puerto para el servicio de gestión de definiciones de valor de actividades.
 * Refleja los endpoints de /api/v1/activities/{activityId}/definitions
 */

import type { ApiActivityValueDefinitionTypes } from '../../../Domain'

type ActivityValueDefinitionResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponse']
type ActivityValueDefinitionResponsePaginated =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponsePaginated']
type CreateValueDefinitionCommand =
  ApiActivityValueDefinitionTypes['CreateValueDefinitionCommand']
type UpdateValueDefinitionCommand =
  ApiActivityValueDefinitionTypes['UpdateValueDefinitionCommand']
type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
type DefinitionsPath = ApiActivityValueDefinitionTypes['DefinitionsPath']

type DefinitionFilterPath =
  ApiActivityValueDefinitionTypes['DefinitionFilterPath']

type DefinitionByIdPath = ApiActivityValueDefinitionTypes['DefinitionByIdPath']

export interface IActivityValueDefinitionService {
  /**
   * Lista las definiciones de valor de una actividad.
   * GET /api/v1/activities/{activityId}/definitions
   */
  getValueDefinitions(
    path: DefinitionsPath,
    filters: DefinitionFilterPath
  ): Promise<ActivityValueDefinitionResponsePaginated | ProblemDetails>

  /**
   * Obtiene una definición de valor por su ID.
   * GET /api/v1/activities/{activityId}/definitions/{definitionId}
   */
  getValueDefinitionById(
    path: DefinitionByIdPath
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails>

  /**
   * Crea una nueva definición de valor para una actividad.
   * POST /api/v1/activities/{activityId}/definitions
   */
  createValueDefinition(
    path: DefinitionsPath,
    request: CreateValueDefinitionCommand
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails>

  /**
   * Actualiza una definición de valor existente para una actividad.
   * PUT /api/v1/activities/{activityId}/definitions/{definitionId}
   */
  updateValueDefinition(
    path: DefinitionByIdPath,
    request: UpdateValueDefinitionCommand
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails>

  /**
   * Elimina una definición de valor existente para una actividad.
   * DELETE /api/v1/activities/{activityId}/definitions/{definitionId}
   */
  deleteValueDefinition(
    path: DefinitionByIdPath
  ): Promise<void | ProblemDetails>
}
