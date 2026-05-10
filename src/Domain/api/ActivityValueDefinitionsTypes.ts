import type { components, paths } from './api'

type ActivityValueDefinitionResponse =
  components['schemas']['ActivityValueDefinitionResponse']
type ActivityValueDefinitionResponsePaginated =
  components['schemas']['ActivityValueDefinitionResponsePaginatedResponse']
type CreateValueDefinitionCommand =
  components['schemas']['CreateValueDefinitionCommand']
type UpdateValueDefinitionCommand =
  components['schemas']['UpdateValueDefinitionCommand']
type ProblemDetails = components['schemas']['ProblemDetails']
type DefinitionsPath =
  paths['/api/v1/activities/{activityId}/definitions']['get']['parameters']['path']

type DefinitionFilterPath =
  paths['/api/v1/activities/{activityId}/definitions']['get']['parameters']['query']

type DefinitionByIdPath =
  paths['/api/v1/activities/{activityId}/definitions/{definitionId}']['get']['parameters']['path']

type ApiActivityValueDefinitionTypes = {
  ActivityValueDefinitionResponse: ActivityValueDefinitionResponse
  ActivityValueDefinitionResponsePaginated: ActivityValueDefinitionResponsePaginated
  CreateValueDefinitionCommand: CreateValueDefinitionCommand
  UpdateValueDefinitionCommand: UpdateValueDefinitionCommand
  ProblemDetails: ProblemDetails
  DefinitionsPath: DefinitionsPath
  DefinitionFilterPath: DefinitionFilterPath
  DefinitionByIdPath: DefinitionByIdPath
}

export { type ApiActivityValueDefinitionTypes }
