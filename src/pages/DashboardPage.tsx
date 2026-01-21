import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon, Delete01Icon, Edit01Icon, ArrowUp01Icon, ArrowDown01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import type { MemberRole } from '@/features/club-leader/domain/clubLeaderSchemas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useClubSummary, useClubMembers, useDeleteClubMembers } from '@/features/club-leader/hooks/useClubLeader'

type SortField = 'userName' | 'studentNumber' | 'major' | 'userHp' | 'role'
type SortDirection = 'asc' | 'desc'

const getRoleLabel = (role?: MemberRole) => {
  switch (role) {
    case 'LEADER':
      return '회장'
    case 'VICE_LEADER':
      return '부회장'
    default:
      return '회원'
  }
}

const getRoleOrder = (role?: MemberRole) => {
  switch (role) {
    case 'LEADER':
      return 0
    case 'VICE_LEADER':
      return 1
    default:
      return 2
  }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { clubUUID } = useAuthStore()

  const { data: clubData, isLoading: clubLoading, error: clubError } = useClubSummary(clubUUID || '')
  const { data: membersData, isLoading: membersLoading, error: membersError } = useClubMembers(clubUUID || '')

  const club = clubData?.data
  const members = useMemo(() => membersData?.data || [], [membersData?.data])

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { mutate: deleteMembers, isPending: isDeleting } = useDeleteClubMembers()

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredMembers = useMemo(() => {
    if (!debouncedSearch.trim()) return members
    const query = debouncedSearch.toLowerCase()
    return members.filter(
      (m) =>
        m.userName.toLowerCase().includes(query) ||
        m.studentNumber.toLowerCase().includes(query) ||
        m.major.toLowerCase().includes(query)
    )
  }, [members, debouncedSearch])

  const sortedMembers = useMemo(() => {
    if (!sortField) return filteredMembers
    return [...filteredMembers].sort((a, b) => {
      let comparison = 0
      if (sortField === 'role') {
        comparison = getRoleOrder(a.role) - getRoleOrder(b.role)
      } else {
        const aVal = a[sortField] || ''
        const bVal = b[sortField] || ''
        comparison = aVal.localeCompare(bVal, 'ko')
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredMembers, sortField, sortDirection])

  const handleExportExcel = () => {
    alert('명단을 엑셀로 내보냅니다.')
  }

  // Track carousel position for photo counter and indicators
  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) return
    setCurrentPhotoIndex(carouselApi.selectedScrollSnap())
  }, [carouselApi])

  // Listen to carousel selection changes
  useEffect(() => {
    if (!carouselApi) return
    onCarouselSelect()
    carouselApi.on('select', onCarouselSelect)
    return () => {
      carouselApi.off('select', onCarouselSelect)
    }
  }, [carouselApi, onCarouselSelect])

  const toggleSelectAll = () => {
    const currentIds = filteredMembers.map((m) => m.clubMemberUUID)
    const allSelected = currentIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentIds])])
    }
  }

  const toggleSelectMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0 || !club) return

    deleteMembers(
      {
        clubUUID: club.clubUUID,
        members: selectedIds.map((id) => ({ clubMemberUUID: id })),
      },
      {
        onSuccess: () => {
          setSelectedIds([])
          alert('선택한 회원이 삭제되었습니다.')
        },
        onError: () => {
          alert('회원 삭제에 실패했습니다.')
        },
      }
    )
  }

  if (clubLoading || membersLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">동아리 현황을 한눈에 확인하세요</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (clubError || membersError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">동아리 현황을 한눈에 확인하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">동아리 현황을 한눈에 확인하세요</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>동아리 정보를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">동아리 현황을 한눈에 확인하세요</p>
      </div>

      {/* 동아리 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {club.mainPhoto && (
                <img
                  src={club.mainPhoto}
                  alt={`${club.clubName} 로고`}
                  className="h-16 w-16 object-cover rounded-lg border flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/v2/circle_default_image.png'
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {club.clubName}
                  <Badge variant={club.recruitmentStatus === 'OPEN' ? 'default' : 'secondary'}>
                    {club.recruitmentStatus === 'OPEN' ? '모집중' : '모집마감'}
                  </Badge>
                </CardTitle>
                <CardDescription>{club.clubCategories.join(', ')}</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/club/basic-info')} className="flex-shrink-0">
              <HugeiconsIcon icon={Edit01Icon} className="size-4 md:mr-2" />
              <span className="hidden md:inline">기본 정보 수정</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">대표자</p>
              <p className="font-medium">{club.leaderName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">연락처</p>
              <p className="font-medium">{club.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">동아리방</p>
              <p className="font-medium">{club.clubRoomNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">인스타그램</p>
              <p className="font-medium">{club.clubInsta || '-'}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {club.clubHashtag.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 동아리 소개 사진 캐러셀 */}
          {club.introPhotos && club.introPhotos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">동아리 소개 사진</p>
              <Carousel
                setApi={setCarouselApi}
                className="relative group"
              >
                <CarouselContent className="!ml-0">
                  {club.introPhotos.map((photo, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`동아리 소개 사진 ${index + 1}`}
                          className="w-full h-80 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/v2/circle_default_image.png'
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* 이전/다음 버튼 */}
                {club.introPhotos.length > 1 && (
                  <>
                    <CarouselPrevious
                      className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0"
                    />
                    <CarouselNext
                      className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0"
                    />
                  </>
                )}

                {/* 사진 개수 표시 */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                  {currentPhotoIndex + 1} / {club.introPhotos.length}
                </div>
              </Carousel>

              {/* 도트 인디케이터 */}
              {club.introPhotos.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {club.introPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        carouselApi?.scrollTo(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPhotoIndex ? 'bg-foreground' : 'bg-muted-foreground'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 동아리 명단 */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>동아리 명단</CardTitle>
              <CardDescription>
                {debouncedSearch
                  ? `검색 결과 ${filteredMembers.length}명 / 총 ${members.length}명`
                  : `총 ${members.length}명`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="destructive" size="sm">
                        <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
                        {selectedIds.length}명 삭제
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>회원 정보를 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        선택한 {selectedIds.length}명의 회원 정보를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button onClick={handleExportExcel} variant="outline" size="sm" className="relative">
                {/* 데스크톱 */}
                <span className="hidden sm:flex items-center">
                  <HugeiconsIcon icon={FileDownloadIcon} className="mr-2 size-4" />
                  {selectedIds.length > 0
                    ? `${selectedIds.length}명 내보내기`
                    : `${members.length}명 내보내기`}
                </span>
                {/* 모바일 */}
                <span className="flex sm:hidden items-center">
                  <HugeiconsIcon icon={FileDownloadIcon} className="size-4" />
                  <Badge className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center text-xs">
                    {selectedIds.length > 0 ? selectedIds.length : members.length}
                  </Badge>
                </span>
              </Button>
            </div>
          </div>
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              placeholder="이름, 학번, 학과로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredMembers.length > 0 &&
                      filteredMembers.every((m) => selectedIds.includes(m.clubMemberUUID))
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('userName')}
                >
                  <div className="flex items-center gap-1">
                    이름
                    {sortField === 'userName' && (
                      <HugeiconsIcon
                        icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4"
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('studentNumber')}
                >
                  <div className="flex items-center gap-1">
                    학번
                    {sortField === 'studentNumber' && (
                      <HugeiconsIcon
                        icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4"
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('major')}
                >
                  <div className="flex items-center gap-1">
                    학과
                    {sortField === 'major' && (
                      <HugeiconsIcon
                        icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4"
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('userHp')}
                >
                  <div className="flex items-center gap-1">
                    연락처
                    {sortField === 'userHp' && (
                      <HugeiconsIcon
                        icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4"
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    역할
                    {sortField === 'role' && (
                      <HugeiconsIcon
                        icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4"
                      />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    {debouncedSearch
                      ? `"${debouncedSearch}" 검색 결과가 없습니다.`
                      : '등록된 회원이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedMembers.map((member) => (
                  <TableRow
                    key={member.clubMemberUUID}
                    className={selectedIds.includes(member.clubMemberUUID) ? 'bg-muted/50' : ''}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(member.clubMemberUUID)}
                        onCheckedChange={() => toggleSelectMember(member.clubMemberUUID)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{member.userName}</TableCell>
                    <TableCell>{member.studentNumber}</TableCell>
                    <TableCell>{member.major}</TableCell>
                    <TableCell>{member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === 'LEADER'
                            ? 'default'
                            : member.role === 'VICE_LEADER'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {getRoleLabel(member.role)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
