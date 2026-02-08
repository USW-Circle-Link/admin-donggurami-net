import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFloorPhoto,
  uploadFloorPhotos,
  deleteFloorPhoto,
} from '../api/adminApi'
import type {
  FloorType,
} from '../domain/adminSchemas'

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  floorPhotos: () => [...adminKeys.all, 'floorPhotos'] as const,
  floorPhoto: (floor: FloorType) => [...adminKeys.floorPhotos(), floor] as const,
}

// ===== Admin Floor Photo Hooks =====

export function useFloorPhoto(floor?: FloorType) {
  return useQuery({
    queryKey: adminKeys.floorPhoto(floor!),
    queryFn: () => getFloorPhoto(floor),
    enabled: !!floor,
  })
}

export function useUploadFloorPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: { B1?: File; F1?: File; F2?: File }) =>
      uploadFloorPhotos(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.floorPhotos() })
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
