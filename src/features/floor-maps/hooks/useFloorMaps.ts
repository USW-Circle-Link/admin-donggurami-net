import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFloorMap, uploadFloorMaps, deleteFloorMap, type GetFloorMapParams } from '../api/floorMapApi'
import type { FloorEnum, UploadFloorMapsRequest } from '../domain/floorMapSchemas'

export const floorMapKeys = {
  all: ['floor-maps'] as const,
  detail: (floor?: FloorEnum) => [...floorMapKeys.all, floor] as const,
}

export function useFloorMap(params?: GetFloorMapParams) {
  return useQuery({
    queryKey: floorMapKeys.detail(params?.floor),
    queryFn: () => getFloorMap(params),
  })
}

export function useUploadFloorMaps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (files: UploadFloorMapsRequest) => uploadFloorMaps(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: floorMapKeys.all })
    },
  })
}

export function useDeleteFloorMap() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (floor: FloorEnum) => deleteFloorMap(floor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: floorMapKeys.all })
    },
  })
}
