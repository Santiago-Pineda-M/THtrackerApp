/**
 * APPLICATION LAYER - GetByIdActivityValueDefinitionUseCase
 * Obtiene una definición de valor específica por su ID.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'
import type {
  ActivityValueDefinitionResponse,
  ApiErrorResponse,
} from '../../../Domain'

export interface GetByIdActivityValueDefinitionInput {
  activityId: string
  id: string
}

export type GetByIdActivityValueDefinitionOutput =
  | { success: true; definition: ActivityValueDefinitionResponse }
  | { success: false; error: ApiErrorResponse }

export class GetByIdActivityValueDefinitionUseCase implements IUseCase<
  GetByIdActivityValueDefinitionInput,
  GetByIdActivityValueDefinitionOutput
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    input: GetByIdActivityValueDefinitionInput
  ): Promise<GetByIdActivityValueDefinitionOutput> {
    const result =
      await this.activityValueDefinitionService.getValueDefinitionById(
        input.activityId,
        input.id
      )

    if (this.isDefinition(result)) {
      return { success: true, definition: result }
    }

    return { success: false, error: result as ApiErrorResponse }
  }

  private isDefinition(
    result: ActivityValueDefinitionResponse | ApiErrorResponse
  ): result is ActivityValueDefinitionResponse {
    return 'activityId' in result
  }
}
