import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAdminClubs,
  getAdminClub,
  createClub,
  deleteClub,
  checkLeaderAccount,
  checkClubName,
  getAdminCategories,
  createCategory,
  deleteCategory,
  getFloorPhoto,
  uploadFloorPhoto,
  deleteFloorPhoto,
  type GetAdminClubsParams,
} from '../api/adminApi'
import type {
  CreateClubRequest,
  DeleteClubRequest,
  CreateCategoryRequest,
  FloorType,
} from '../domain/adminSchemas'

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  clubs: () => [...adminKeys.all, 'clubs'] as const,
  clubList: (params?: GetAdminClubsParams) => [...adminKeys.clubs(), 'list', params] as const,
  clubDetail: (clubUUID: string) => [...adminKeys.clubs(), 'detail', clubUUID] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
  floorPhotos: () => [...adminKeys.all, 'floorPhotos'] as const,
  floorPhoto: (floor: FloorType) => [...adminKeys.floorPhotos(), floor] as const,
}

// ===== Admin Club Hooks =====

export function useAdminClubs(params?: GetAdminClubsParams) {
  return useQuery({
    queryKey: adminKeys.clubList(params),
    queryFn: () => getAdminClubs(params),
  })
}

export function useAdminClub(clubUUID: string) {
  return useQuery({
    queryKey: adminKeys.clubDetail(clubUUID),
    queryFn: () => getAdminClub(clubUUID),
    enabled: !!clubUUID,
  })
}

export function useCreateClub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateClubRequest) => createClub(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clubs() })
    },
  })
}

export function useDeleteClub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubUUID, request }: { clubUUID: string; request: DeleteClubRequest }) =>
      deleteClub(clubUUID, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clubs() })
    },
  })
}

export function useCheckLeaderAccount() {
  return useMutation({
    mutationFn: (leaderAccount: string) => checkLeaderAccount(leaderAccount),
  })
}

export function useCheckClubName() {
  return useMutation({
    mutationFn: (clubName: string) => checkClubName(clubName),
  })
}

// ===== Admin Category Hooks =====

export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories(),
    queryFn: getAdminCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clubCategoryUUID: string) => deleteCategory(clubCategoryUUID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() })
    },
  })
}

// ===== Admin Floor Photo Hooks =====

export function useFloorPhoto(floor: FloorType) {
  return useQuery({
    queryKey: adminKeys.floorPhoto(floor),
    queryFn: () => getFloorPhoto(floor),
  })
}

export function useUploadFloorPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ floor, photo }: { floor: FloorType; photo: File }) =>
      uploadFloorPhoto(floor, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.floorPhoto(variables.floor) })
    },
  })
}

export function useDeleteFloorPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (floor: FloorType) => deleteFloorPhoto(floor),
    onSuccess: (_, floor) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.floorPhoto(floor) })
    },
  })
}
