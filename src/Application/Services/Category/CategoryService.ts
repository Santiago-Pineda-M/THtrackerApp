import type {
  IHttpClient,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiErrorResponse,
} from '../../../Domain'
import type { ICategoryService } from './ICategoryService'

export class CategoryService implements ICategoryService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/categories'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getCategories(): Promise<CategoryResponse[] | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        CategoryResponse[] | ApiErrorResponse
      >(this.baseUrl, { cacheTtl: 5 * 60 * 1000 })
      if (response.status === 200) return response.data as CategoryResponse[]
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getCategoryById(
    id: string
  ): Promise<CategoryResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        CategoryResponse | ApiErrorResponse
      >(`${this.baseUrl}/${id}`, { cacheTtl: 5 * 60 * 1000 })
      if (response.status === 200) return response.data as CategoryResponse
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createCategory(
    request: CreateCategoryRequest
  ): Promise<CategoryResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<
        CategoryResponse | ApiErrorResponse
      >(this.baseUrl, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as CategoryResponse
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateCategory(
    id: string,
    request: UpdateCategoryRequest
  ): Promise<CategoryResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.put<
        CategoryResponse | ApiErrorResponse
      >(`${this.baseUrl}/${id}`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as CategoryResponse
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteCategory(id: string): Promise<void | ApiErrorResponse> {
    try {
      const response = await this.httpClient.delete<void | ApiErrorResponse>(
        `${this.baseUrl}/${id}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(this.baseUrl)
        return
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toNetworkError(error: unknown): ApiErrorResponse {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
