/**
 * APPLICATION LAYER - CreateActivityValueDefinitionUseCase
 * Crea una nueva definición de valor para una actividad.
 */

import type { IUseCase, ApiActivityValueDefinitionTypes } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'

export type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
export type CreateValueDefinitionCommand =
  ApiActivityValueDefinitionTypes['CreateValueDefinitionCommand']
export type ActivityValueDefinitionResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponse']

export class CreateActivityValueDefinitionUseCase implements IUseCase<
  CreateValueDefinitionCommand,
  ActivityValueDefinitionResponse | ProblemDetails
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    request: CreateValueDefinitionCommand
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails> {
    const result =
      await this.activityValueDefinitionService.createValueDefinition(
        { activityId: request.activityId || '' },
        request
      )
    return result
  }
}
