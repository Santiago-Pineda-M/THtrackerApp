import {
  GetCategoriesUseCase,
  GetCategoryByIdUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '../../../Application/UseCases/Category'
import {
  CategoriesListPloc,
  CategoryDetailPloc,
  CategoryCreateFormPloc,
  CategoryEditFormPloc,
  CategoryDeletePloc,
} from '../../../Controllers/Category'
import { CategoryService } from '../../../Application/Services/Category/CategoryService'
import { httpClient } from '../core/http.config'

let _categoryService: CategoryService | null = null
export const getCategoryService = (): CategoryService => {
  if (!_categoryService) _categoryService = new CategoryService(httpClient)
  return _categoryService
}

let _getCategoriesUseCase: GetCategoriesUseCase | null = null
const getGetCategoriesUseCase = (): GetCategoriesUseCase => {
  if (!_getCategoriesUseCase)
    _getCategoriesUseCase = new GetCategoriesUseCase(getCategoryService())
  return _getCategoriesUseCase
}

let _getCategoryByIdUseCase: GetCategoryByIdUseCase | null = null
const getGetCategoryByIdUseCase = (): GetCategoryByIdUseCase => {
  if (!_getCategoryByIdUseCase)
    _getCategoryByIdUseCase = new GetCategoryByIdUseCase(getCategoryService())
  return _getCategoryByIdUseCase
}

let _createCategoryUseCase: CreateCategoryUseCase | null = null
const getCreateCategoryUseCase = (): CreateCategoryUseCase => {
  if (!_createCategoryUseCase)
    _createCategoryUseCase = new CreateCategoryUseCase(getCategoryService())
  return _createCategoryUseCase
}

let _updateCategoryUseCase: UpdateCategoryUseCase | null = null
const getUpdateCategoryUseCase = (): UpdateCategoryUseCase => {
  if (!_updateCategoryUseCase)
    _updateCategoryUseCase = new UpdateCategoryUseCase(getCategoryService())
  return _updateCategoryUseCase
}

let _deleteCategoryUseCase: DeleteCategoryUseCase | null = null
const getDeleteCategoryUseCase = (): DeleteCategoryUseCase => {
  if (!_deleteCategoryUseCase)
    _deleteCategoryUseCase = new DeleteCategoryUseCase(getCategoryService())
  return _deleteCategoryUseCase
}

let _categoriesListPloc: CategoriesListPloc | null = null
export const getCategoriesListPloc = (): CategoriesListPloc => {
  if (!_categoriesListPloc)
    _categoriesListPloc = new CategoriesListPloc(getGetCategoriesUseCase())
  return _categoriesListPloc
}

let _categoryDetailPloc: CategoryDetailPloc | null = null
export const getCategoryDetailPloc = (): CategoryDetailPloc => {
  if (!_categoryDetailPloc)
    _categoryDetailPloc = new CategoryDetailPloc(getGetCategoryByIdUseCase())
  return _categoryDetailPloc
}

let _categoryCreateFormPloc: CategoryCreateFormPloc | null = null
export const getCategoryCreateFormPloc = (): CategoryCreateFormPloc => {
  if (!_categoryCreateFormPloc)
    _categoryCreateFormPloc = new CategoryCreateFormPloc(
      getCreateCategoryUseCase()
    )
  return _categoryCreateFormPloc
}

let _categoryEditFormPloc: CategoryEditFormPloc | null = null
export const getCategoryEditFormPloc = (): CategoryEditFormPloc => {
  if (!_categoryEditFormPloc)
    _categoryEditFormPloc = new CategoryEditFormPloc(
      getUpdateCategoryUseCase(),
      getGetCategoryByIdUseCase()
    )
  return _categoryEditFormPloc
}

let _categoryDeletePloc: CategoryDeletePloc | null = null
export const getCategoryDeletePloc = (): CategoryDeletePloc => {
  if (!_categoryDeletePloc)
    _categoryDeletePloc = new CategoryDeletePloc(getDeleteCategoryUseCase())
  return _categoryDeletePloc
}
