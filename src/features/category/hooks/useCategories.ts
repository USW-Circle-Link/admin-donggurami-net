import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, deleteCategory } from '../api/categoryApi'
import type { CreateCategoryRequest } from '../domain/categorySchemas'

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clubCategoryUUID: string) => deleteCategory(clubCategoryUUID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    },
  })
}
