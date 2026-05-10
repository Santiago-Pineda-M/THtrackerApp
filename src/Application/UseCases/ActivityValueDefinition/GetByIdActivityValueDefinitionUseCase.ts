/**
 * APPLICATION LAYER - GetByIdActivityValueDefinitionUseCase
 * Obtiene una definición de valor específica por su ID.
 */

import type { IUseCase, ApiActivityValueDefinitionTypes } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'

type GetByIdActivityValueDefinitionInput =
  ApiActivityValueDefinitionTypes['DefinitionByIdPath']

type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
type GetByIdActivityValueDefinitionResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponse']

export class GetByIdActivityValueDefinitionUseCase implements IUseCase<
  GetByIdActivityValueDefinitionInput,
  GetByIdActivityValueDefinitionResponse | ProblemDetails
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    input: GetByIdActivityValueDefinitionInput
  ): Promise<GetByIdActivityValueDefinitionResponse | ProblemDetails> {
    return await this.activityValueDefinitionService.getValueDefinitionById(
      input
    )
  }
}
