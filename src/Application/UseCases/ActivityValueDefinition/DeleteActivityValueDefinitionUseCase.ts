/**
 * APPLICATION LAYER - DeleteActivityValueDefinitionUseCase
 * Elimina una definición de valor existente para una actividad.
 */

import type { IUseCase, ApiActivityValueDefinitionTypes } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'

export type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
export type DeleteValueDefinitionParams =
  ApiActivityValueDefinitionTypes['DefinitionByIdPath']

export class DeleteActivityValueDefinitionUseCase implements IUseCase<
  DeleteValueDefinitionParams,
  void | ProblemDetails
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    input: DeleteValueDefinitionParams
  ): Promise<void | ProblemDetails> {
    return await this.activityValueDefinitionService.deleteValueDefinition(
      input
    )
  }
}
