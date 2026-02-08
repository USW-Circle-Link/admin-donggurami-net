import { useQuery } from '@tanstack/react-query'
import { getAllClubs } from '../../club/api/clubApi'
import type { MergedClubItem } from '../domain/adminSchemas'
import type { ClubListResponse } from '../../club/domain/clubSchemas'

export const mergedClubKeys = {
  all: ['admin', 'mergedClubs'] as const,
  list: () => [...mergedClubKeys.all, 'list'] as const,
}

function mergeClubData(
  allClubs: ClubListResponse[],
  openClubs: ClubListResponse[]
): MergedClubItem[] {
  const openClubsSet = new Set(openClubs.map((club) => club.clubUUID))

  return allClubs.map((club) => ({
    clubUUID: club.clubUUID,
    clubName: club.clubName,
    leaderName: club.leaderName,
    department: club.department as MergedClubItem['department'],
    leaderHp: undefined,
    numberOfClubMembers: club.memberCount,
    mainPhoto: club.mainPhotoUrl,
    clubHashtags: club.hashtags,
    isRecruiting: openClubsSet.has(club.clubUUID),
  }))
}

export function useMergedClubList() {
  return useQuery({
    queryKey: mergedClubKeys.list(),
    queryFn: async () => {
      const [allClubsResponse, openClubsResponse] = await Promise.all([
        getAllClubs(),
        getAllClubs({ open: true }),
      ])

      const allClubs = allClubsResponse.data || []
      const openClubs = openClubsResponse.data || []

      const mergedClubs = mergeClubData(allClubs, openClubs)

      return {
        data: mergedClubs,
      }
    },
  })
}
