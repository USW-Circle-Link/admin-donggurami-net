import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getAllClubs,
  getClubsByCategory,
  getOpenClubs,
  getOpenClubsByCategory,
  getCategories,
  getClubDetail,
  getClubForm,
  checkDuplication,
  createClub,
  deleteClub,
} from '../api/clubApi'
import type { ClubCreateRequest } from '../domain/clubSchemas'

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
  forms: () => [...clubKeys.all, 'forms'] as const,
  form: (clubUUID: string) => [...clubKeys.forms(), clubUUID] as const,
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
    queryFn: getAllClubs,
  })
}

// 카테고리별 전체 동아리
export function useClubsByCategory() {
  return useQuery({
    queryKey: clubKeys.byCategory(),
    queryFn: () => getClubsByCategory(),
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
    queryFn: () => getOpenClubsByCategory(),
  })
}

// 카테고리 목록
export function useCategories() {
  return useQuery({
    queryKey: clubKeys.categories(),
    queryFn: getCategories,
  })
}

// 동아리 상세 조회
export function useClubDetail(clubUUID: string) {
  return useQuery({
    queryKey: clubKeys.intro(clubUUID),
    queryFn: () => getClubDetail(clubUUID),
    enabled: !!clubUUID,
  })
}

// 중복 확인 (name: 동아리명, leader: 회장 아이디)
export function useCheckDuplication() {
  return useMutation({
    mutationFn: ({ type, val }: { type: 'name' | 'leader'; val: string }) =>
      checkDuplication(type, val),
  })
}

// 동아리 생성
export function useCreateClub() {
  return useMutation({
    mutationFn: (request: ClubCreateRequest) => createClub(request),
  })
}

// 동아리 삭제
export function useDeleteClub() {
  return useMutation({
    mutationFn: ({ clubUUID, adminPw }: { clubUUID: string; adminPw: string }) =>
      deleteClub(clubUUID, { adminPw }),
  })
}

// 동아리 지원서 조회
export function useClubForm(clubUUID: string) {
  return useQuery({
    queryKey: clubKeys.form(clubUUID),
    queryFn: () => getClubForm(clubUUID),
    enabled: !!clubUUID,
  })
}
