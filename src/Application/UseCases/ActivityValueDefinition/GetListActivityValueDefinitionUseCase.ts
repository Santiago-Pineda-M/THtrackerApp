/**
 * APPLICATION LAYER - GetListActivityValueDefinitionUseCase
 * Lista las definiciones de valor de una actividad.
 */

import type { IUseCase, ApiActivityValueDefinitionTypes } from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService'

export type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
export type GetListActivityValueDefinitionPath =
  ApiActivityValueDefinitionTypes['DefinitionsPath']
export type GetListActivityValueDefinitionFilters =
  ApiActivityValueDefinitionTypes['DefinitionFilterPath']
export type GetListActivityValueDefinitionPaginatedResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponsePaginated']

export class GetListActivityValueDefinitionUseCase implements IUseCase<
  {
    path: GetListActivityValueDefinitionPath
    filters: GetListActivityValueDefinitionFilters
  },
  GetListActivityValueDefinitionPaginatedResponse | ProblemDetails
> {
  private readonly activityValueDefinitionService: IActivityValueDefinitionService

  constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
    this.activityValueDefinitionService = activityValueDefinitionService
  }

  async execute(input: {
    path: GetListActivityValueDefinitionPath
    filters: GetListActivityValueDefinitionFilters
  }): Promise<
    GetListActivityValueDefinitionPaginatedResponse | ProblemDetails
  > {
    return await this.activityValueDefinitionService.getValueDefinitions(
      input.path,
      input.filters
    )
  }
}
