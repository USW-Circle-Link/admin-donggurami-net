import { useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon, Search01Icon, Group01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminClubs } from '@/features/admin/hooks/useAdmin'
import { apiClient } from '@/shared/api/apiClient'

export function UnionDashboardPage() {
  const { data: clubsData, isLoading, error } = useAdminClubs()
  const clubs = clubsData?.data?.content || []
  const [searchTerm, setSearchTerm] = useState('')
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({})
  const [loadingMembers, setLoadingMembers] = useState(false)

  // Fetch member counts for all clubs
  useEffect(() => {
    if (clubs.length === 0) return

    const fetchMemberCounts = async () => {
      setLoadingMembers(true)
      try {
        const counts: Record<string, number> = {}
        for (const club of clubs) {
          try {
            const response = await apiClient.get(`/clubs/${club.clubUUID}/members`)
            counts[club.clubUUID] = response.data?.data?.length || 0
          } catch {
            counts[club.clubUUID] = 0
          }
        }
        setMemberCounts(counts)
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchMemberCounts()
  }, [clubs])

  const filteredClubs = clubs.filter(
    (club) =>
      club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownloadExcel = () => {
    const headers = ['동아리명', '회장명', '회원수', '분과']
    const csvContent = [
      headers.join(','),
      ...filteredClubs.map((club) =>
        [
          club.clubName,
          club.leaderName,
          memberCounts[club.clubUUID] || 0,
          club.department || '-',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `동아리_목록_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">동아리 연합회 관리 시스템</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 동아리</CardDescription>
              <CardTitle className="text-3xl"><Skeleton className="h-8 w-12 inline-block" /></CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>모집중인 동아리</CardDescription>
              <CardTitle className="text-3xl"><Skeleton className="h-8 w-12 inline-block" /></CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 회원수</CardDescription>
              <CardTitle className="text-3xl"><Skeleton className="h-8 w-12 inline-block" /></CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>동아리 목록</CardTitle>
            <CardDescription>전체 동아리 현황을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">동아리 연합회 관리 시스템</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">동아리 목록을 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">동아리 연합회 관리 시스템</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 동아리</CardDescription>
            <CardTitle className="text-3xl">{clubs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>모집중인 동아리</CardDescription>
            <CardTitle className="text-3xl">-</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 회원수</CardDescription>
            <CardTitle className="text-3xl">-</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>동아리 목록</CardTitle>
              <CardDescription>전체 동아리 현황을 확인하세요</CardDescription>
            </div>
            <Button onClick={handleDownloadExcel} variant="outline">
              <HugeiconsIcon icon={FileDownloadIcon} className="mr-2" />
              내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
            />
            <Input
              placeholder="동아리명, 회장명, 분과로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-3">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <div
                  key={club.clubUUID}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-sm">{club.clubName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{club.leaderName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <HugeiconsIcon icon={Group01Icon} className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {loadingMembers ? <Skeleton className="h-4 w-8 inline-block" /> : memberCounts[club.clubUUID] || 0}
                      </span>
                      <span className="text-muted-foreground">명</span>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      {club.department || '-'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <HugeiconsIcon icon={Group01Icon} className="size-8 mb-2 opacity-50" />
                <p className="text-sm">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
