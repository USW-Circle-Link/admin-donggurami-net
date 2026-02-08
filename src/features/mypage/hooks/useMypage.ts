import { useQuery } from '@tanstack/react-query'
import { getMyClubs, getAppliedClubs, getFloorPhoto } from '../api/mypageApi'

export const mypageKeys = {
  all: ['mypage'] as const,
  myClubs: () => [...mypageKeys.all, 'myClubs'] as const,
  appliedClubs: () => [...mypageKeys.all, 'appliedClubs'] as const,
  floorPhotos: () => [...mypageKeys.all, 'floorPhotos'] as const,
  floorPhoto: (floor: string) => [...mypageKeys.floorPhotos(), floor] as const,
}

export function useMyClubs() {
  return useQuery({
    queryKey: mypageKeys.myClubs(),
    queryFn: getMyClubs,
  })
}

export function useAppliedClubs() {
  return useQuery({
    queryKey: mypageKeys.appliedClubs(),
    queryFn: getAppliedClubs,
  })
}

export function useFloorPhoto(floor: 'B1' | 'F1' | 'F2') {
  return useQuery({
    queryKey: mypageKeys.floorPhoto(floor),
    queryFn: () => getFloorPhoto(floor),
  })
}
