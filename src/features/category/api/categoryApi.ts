import { apiClient } from '@shared/api/apiClient'
import type { ApiResponse } from '@shared/types/api'
import type { Category, CreateCategoryRequest } from '../domain/categorySchemas'

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
  return response.data
}

export async function createCategory(
  request: CreateCategoryRequest
): Promise<ApiResponse<Category>> {
  const response = await apiClient.post<ApiResponse<Category>>('/categories', request)
  return response.data
}

export async function deleteCategory(clubCategoryUUID: string): Promise<ApiResponse<Category>> {
  const response = await apiClient.delete<ApiResponse<Category>>(`/categories/${clubCategoryUUID}`)
  return response.data
}
