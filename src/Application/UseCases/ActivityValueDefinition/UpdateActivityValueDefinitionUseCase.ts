/**
 * APPLICATION LAYER - UpdateActivityValueDefinitionUseCase
 * Actualiza una definición de valor existente para una actividad.
 */

import type { IUseCase, ApiActivityValueDefinitionTypes } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'

type UpdateActivityValueDefinitionPath =
  ApiActivityValueDefinitionTypes['DefinitionByIdPath']

type UpdateValueDefinitionRequest =
  ApiActivityValueDefinitionTypes['UpdateValueDefinitionCommand']

type ActivityValueDefinitionResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponse']

type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']

export class UpdateActivityValueDefinitionUseCase implements IUseCase<
  UpdateValueDefinitionRequest,
  ActivityValueDefinitionResponse | ProblemDetails
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    request: UpdateValueDefinitionRequest
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails> {
    const path: UpdateActivityValueDefinitionPath = {
      activityId: request.activityId!,
      definitionId: request.definitionId!,
    }
    return await this.activityValueDefinitionService.updateValueDefinition(
      path,
      request
    )
  }
}
