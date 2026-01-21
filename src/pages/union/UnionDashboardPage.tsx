import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminClubs } from '@/features/admin/hooks/useAdmin'

export function UnionDashboardPage() {
  const { data: clubsData, isLoading, error } = useAdminClubs()
  const clubs = clubsData?.data?.content || []
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClubs = clubs.filter(
    (club) =>
      club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownloadExcel = () => {
    const headers = ['동아리명', '회장명', '분과']
    const csvContent = [
      headers.join(','),
      ...filteredClubs.map((club) =>
        [
          club.clubName,
          club.leaderName,
          club.leaderHp,
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>동아리명</TableHead>
                  <TableHead>회장</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>분과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.length > 0 ? (
                  filteredClubs.map((club) => (
                    <TableRow key={club.clubUUID}>
                      <TableCell className="font-medium">{club.clubName}</TableCell>
                      <TableCell>{club.leaderName}</TableCell>
                      <TableCell>{club.leaderHp}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {club.department || '-'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
