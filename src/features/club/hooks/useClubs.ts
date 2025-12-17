import { useQuery } from '@tanstack/react-query'
import {
  getAllClubs,
  getClubList,
  getClubsByCategory,
  getOpenClubs,
  getOpenClubsByCategory,
  getCategories,
  getClubIntro,
} from '../api/clubApi'

// Query keys
export const clubKeys = {
  all: ['clubs'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (filters?: string) => [...clubKeys.lists(), filters] as const,
  simple: () => [...clubKeys.all, 'simple'] as const,
  byCategory: () => [...clubKeys.all, 'byCategory'] as const,
  open: () => [...clubKeys.all, 'open'] as const,
  openByCategory: () => [...clubKeys.all, 'openByCategory'] as const,
  categories: () => [...clubKeys.all, 'categories'] as const,
  intros: () => [...clubKeys.all, 'intro'] as const,
  intro: (clubUUID: string) => [...clubKeys.intros(), clubUUID] as const,
}

// 전체 동아리 조회
export function useAllClubs() {
  return useQuery({
    queryKey: clubKeys.lists(),
    queryFn: getAllClubs,
  })
}

// 동아리 리스트 (심플)
export function useClubList() {
  return useQuery({
    queryKey: clubKeys.simple(),
    queryFn: getClubList,
  })
}

// 카테고리별 전체 동아리
export function useClubsByCategory() {
  return useQuery({
    queryKey: clubKeys.byCategory(),
    queryFn: getClubsByCategory,
  })
}

// 모집 중인 동아리
export function useOpenClubs() {
  return useQuery({
    queryKey: clubKeys.open(),
    queryFn: getOpenClubs,
  })
}

// 카테고리별 모집 중인 동아리
export function useOpenClubsByCategory() {
  return useQuery({
    queryKey: clubKeys.openByCategory(),
    queryFn: getOpenClubsByCategory,
  })
}

// 카테고리 목록
export function useCategories() {
  return useQuery({
    queryKey: clubKeys.categories(),
    queryFn: getCategories,
  })
}

// 동아리 소개 조회
export function useClubIntro(clubUUID: string) {
  return useQuery({
    queryKey: clubKeys.intro(clubUUID),
    queryFn: () => getClubIntro(clubUUID),
    enabled: !!clubUUID,
  })
}
