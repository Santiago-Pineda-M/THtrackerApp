/**
 * APPLICATION LAYER - GetListActivityValueDefinitionUseCase
 * Lista las definiciones de valor de una actividad.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'
import type {
  ActivityValueDefinitionResponse,
  ApiErrorResponse,
} from '../../../Domain'

export interface GetListActivityValueDefinitionInput {
  activityId: string
}

export type GetListActivityValueDefinitionOutput =
  | { success: true; definitions: ActivityValueDefinitionResponse[] }
  | { success: false; error: ApiErrorResponse }

export class GetListActivityValueDefinitionUseCase implements IUseCase<
  GetListActivityValueDefinitionInput,
  GetListActivityValueDefinitionOutput
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    input: GetListActivityValueDefinitionInput
  ): Promise<GetListActivityValueDefinitionOutput> {
    const result =
      await this.activityValueDefinitionService.getValueDefinitions(
        input.activityId
      )

    if (Array.isArray(result)) {
      return { success: true, definitions: result }
    }

    return { success: false, error: result as ApiErrorResponse }
  }
}
