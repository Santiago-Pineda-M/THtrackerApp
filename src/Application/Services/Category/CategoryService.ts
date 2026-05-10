import type { IHttpClient } from '../../../Domain'
import type { ICategoryService } from './ICategoryService'
import type { ApiCategoriesTypes } from '../../../Domain'

type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
type CategoryPaginatedResponse = ApiCategoriesTypes['CategoryPaginatedResponse']
type UpdateCategoryCommand = ApiCategoriesTypes['UpdateCategoryCommand']
type CreateCategoryCommand = ApiCategoriesTypes['CreateCategoryCommand']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

type GetCategoriesFilters = ApiCategoriesTypes['GetCategoriesFilters']
type GetCategoryIdPath = ApiCategoriesTypes['GetCategoryIdPath']
type DeleteCategoryIdPath = ApiCategoriesTypes['DeleteCategoryIdPath']
type UpdateCategoryIdPath = ApiCategoriesTypes['UpdateCategoryIdPath']

export class CategoryService implements ICategoryService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/categories'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getCategories(
    filters?: GetCategoriesFilters
  ): Promise<CategoryPaginatedResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        CategoryPaginatedResponse | ProblemDetails
      >(this.baseUrl, { cacheTtl: 5 * 60 * 1000, params: filters })
      if (response.status === 200)
        return response.data as CategoryPaginatedResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getCategoryById(
    id: GetCategoryIdPath
  ): Promise<CategoryResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        CategoryResponse | ProblemDetails
      >(`${this.baseUrl}/${id}`, { cacheTtl: 5 * 60 * 1000 })
      if (response.status === 200) return response.data as CategoryResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createCategory(
    request: CreateCategoryCommand
  ): Promise<CategoryResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        CategoryResponse | ProblemDetails
      >(this.baseUrl, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as CategoryResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateCategory(
    id: UpdateCategoryIdPath,
    request: UpdateCategoryCommand
  ): Promise<CategoryResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<
        CategoryResponse | ProblemDetails
      >(`${this.baseUrl}/${id}`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as CategoryResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteCategory(
    id: DeleteCategoryIdPath
  ): Promise<void | ProblemDetails> {
    try {
      const response = await this.httpClient.delete<void | ProblemDetails>(
        `${this.baseUrl}/${id}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(this.baseUrl)
        return
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toNetworkError(error: unknown): ProblemDetails {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
