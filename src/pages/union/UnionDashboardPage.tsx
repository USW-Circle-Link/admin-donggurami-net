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
import { dummyClubList, type ClubListItem } from '@/data/dummyData'

export function UnionDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clubs] = useState<ClubListItem[]>(dummyClubList)

  const filteredClubs = clubs.filter(
    (club) =>
      club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDownloadExcel = () => {
    const headers = ['동아리명', '회장명', '연락처', '동아리방', '회원수', '카테고리', '모집상태']
    const csvContent = [
      headers.join(','),
      ...filteredClubs.map((club) =>
        [
          club.clubName,
          club.leaderName,
          club.leaderHp,
          club.clubRoomNumber || '-',
          club.memberCount,
          club.categories.join('/'),
          club.recruitmentStatus === 'OPEN' ? '모집중' : '모집마감',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `동아리_목록_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">동아리 연합회 관리 시스템</p>
      </div>

      {/* 통계 카드 */}
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
            <CardTitle className="text-3xl">
              {clubs.filter((c) => c.recruitmentStatus === 'OPEN').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 회원수</CardDescription>
            <CardTitle className="text-3xl">
              {clubs.reduce((sum, c) => sum + c.memberCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 동아리 목록 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>동아리 목록</CardTitle>
              <CardDescription>전체 동아리 현황을 확인하세요</CardDescription>
            </div>
            <Button onClick={handleDownloadExcel} variant="outline">
              <HugeiconsIcon icon={FileDownloadIcon} className="mr-2" />
              엑셀로 내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 검색 */}
          <div className="mb-4 relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
            />
            <Input
              placeholder="동아리명, 회장명, 카테고리로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* 테이블 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>동아리명</TableHead>
                  <TableHead>회장</TableHead>
                  <TableHead className="hidden md:table-cell">연락처</TableHead>
                  <TableHead className="hidden sm:table-cell">동아리방</TableHead>
                  <TableHead className="hidden lg:table-cell">회원수</TableHead>
                  <TableHead className="hidden lg:table-cell">카테고리</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.length > 0 ? (
                  filteredClubs.map((club) => (
                    <TableRow key={club.clubUUID}>
                      <TableCell className="font-medium">{club.clubName}</TableCell>
                      <TableCell>{club.leaderName}</TableCell>
                      <TableCell className="hidden md:table-cell">{club.leaderHp}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {club.clubRoomNumber || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{club.memberCount}명</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {club.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={club.recruitmentStatus === 'OPEN' ? 'default' : 'secondary'}>
                          {club.recruitmentStatus === 'OPEN' ? '모집중' : '마감'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
