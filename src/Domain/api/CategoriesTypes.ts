import type { components, paths } from './api'

type CategoryResponse = components['schemas']['CategoryResponse']
type CategoryPaginatedResponse =
  components['schemas']['CategoryResponsePaginatedResponse']
type UpdateCategoryCommand = components['schemas']['UpdateCategoryCommand']
type CreateCategoryCommand = components['schemas']['CreateCategoryCommand']
type ProblemDetails = components['schemas']['ProblemDetails']

type GetCategoriesFilters =
  paths['/api/v1/categories']['get']['parameters']['query']
type GetCategoryIdPath =
  paths['/api/v1/categories/{id}']['get']['parameters']['path']
type DeleteCategoryIdPath =
  paths['/api/v1/categories/{id}']['delete']['parameters']['path']
type UpdateCategoryIdPath =
  paths['/api/v1/categories/{id}']['put']['parameters']['path']

export type ApiCategoriesTypes = {
  CategoryResponse: CategoryResponse
  CategoryPaginatedResponse: CategoryPaginatedResponse
  UpdateCategoryCommand: UpdateCategoryCommand
  CreateCategoryCommand: CreateCategoryCommand
  ProblemDetails: ProblemDetails
  GetCategoriesFilters: GetCategoriesFilters
  GetCategoryIdPath: GetCategoryIdPath
  DeleteCategoryIdPath: DeleteCategoryIdPath
  UpdateCategoryIdPath: UpdateCategoryIdPath
}
