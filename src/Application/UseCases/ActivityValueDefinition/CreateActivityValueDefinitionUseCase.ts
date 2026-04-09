/**
 * APPLICATION LAYER - CreateActivityValueDefinitionUseCase
 * Crea una nueva definición de valor para una actividad.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'
import type {
  ActivityValueDefinitionResponse,
  CreateValueDefinitionRequest,
  ApiErrorResponse,
} from '../../../Domain'

export interface CreateActivityValueDefinitionInput {
  activityId: string
  name: string | null
  valueType: string | null
  isRequired: boolean
  unit: string | null
  minValue: string | null
  maxValue: string | null
}

export type CreateActivityValueDefinitionOutput =
  | { success: true; definition: ActivityValueDefinitionResponse }
  | { success: false; error: ApiErrorResponse }

export class CreateActivityValueDefinitionUseCase implements IUseCase<
  CreateActivityValueDefinitionInput,
  CreateActivityValueDefinitionOutput
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(
    input: CreateActivityValueDefinitionInput
  ): Promise<CreateActivityValueDefinitionOutput> {
    const request: CreateValueDefinitionRequest = {
      name: input.name,
      valueType: input.valueType,
      isRequired: input.isRequired,
      unit: input.unit,
      minValue: input.minValue,
      maxValue: input.maxValue,
    }

    const result =
      await this.activityValueDefinitionService.createValueDefinition(
        input.activityId,
        request
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
