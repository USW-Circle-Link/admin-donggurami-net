import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon, Search01Icon, Delete01Icon, ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMergedClubList } from '@/features/admin'
import { mergedClubKeys } from '@/features/admin/hooks/useMergedClubList'
import { useDeleteClub } from '@/features/club'
import { DEPARTMENT_LABELS, type Department } from '@/features/club/domain/clubSchemas'
import type { MergedClubItem } from '@/features/admin'
import { toast } from 'sonner'

type SortField = 'clubName' | 'leaderName' | 'numberOfClubMembers' | 'department'
type SortDirection = 'asc' | 'desc'

export function UnionDashboardPage() {
  const queryClient = useQueryClient()
  const { data: mergedData, isLoading, error } = useMergedClubList()
  const clubs = mergedData?.data || []
  const recruitingCount = clubs.filter((club) => club.isRecruiting).length
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('clubName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [adminPasswordDialog, setAdminPasswordDialog] = useState<string | null>(null)
  const [adminPassword, setAdminPassword] = useState('')

  const deleteClubMutation = useDeleteClub()

  const filteredClubs = useMemo(
    () =>
      clubs.filter((club: MergedClubItem) =>
        club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.department?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [clubs, searchTerm]
  )

  const sortedClubs = useMemo(() => {
    const sorted = [...filteredClubs].sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredClubs, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDeleteClub = async () => {
    const clubUUID = deleteConfirm
    if (!clubUUID) return

    setDeleteConfirm(null)
    setAdminPasswordDialog(clubUUID)
  }

  const handleConfirmDelete = async () => {
    const clubUUID = adminPasswordDialog
    if (!clubUUID || !adminPassword.trim()) {
      toast.error('관리자 비밀번호를 입력해주세요.')
      return
    }

    try {
      await deleteClubMutation.mutateAsync(
        { clubUUID, adminPw: adminPassword },
        {
          onSuccess: () => {
            toast.success('동아리가 삭제되었습니다.')
            setAdminPasswordDialog(null)
            setAdminPassword('')
            // Invalidate and refetch club list
            queryClient.invalidateQueries({ queryKey: mergedClubKeys.list() })
          },
          onError: (error) => {
            console.error('Delete club error:', error)
            toast.error('동아리 삭제에 실패했습니다. 관리자 비밀번호를 확인해주세요.')
          },
        }
      )
    } catch {
      toast.error('동아리 삭제에 실패했습니다.')
    }
  }

  const handlePasswordDialogClose = () => {
    setAdminPasswordDialog(null)
    setAdminPassword('')
  }

  const handleDownloadExcel = () => {
    const headers = ['동아리명', '회장명', '회원수', '분과']
    const csvContent = [
      headers.join(','),
      ...sortedClubs.map((club) =>
        [
          club.clubName,
          club.leaderName,
          club.numberOfClubMembers || 0,
          DEPARTMENT_LABELS[club.department as Department] || club.department || '-',
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
            <CardTitle className="text-3xl">{recruitingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 회원수</CardDescription>
            <CardTitle className="text-3xl">{clubs.reduce((sum: number, club) => sum + (club.numberOfClubMembers || 0), 0)}</CardTitle>
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
                  <TableHead></TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('clubName')}
                  >
                    <div className="flex items-center gap-1">
                      동아리명
                      {sortField === 'clubName' && (
                        <HugeiconsIcon
                          icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                          className="size-4"
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('leaderName')}
                  >
                    <div className="flex items-center gap-1">
                      회장명
                      {sortField === 'leaderName' && (
                        <HugeiconsIcon
                          icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                          className="size-4"
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('numberOfClubMembers')}
                  >
                    <div className="flex items-center gap-1">
                      회원수
                      {sortField === 'numberOfClubMembers' && (
                        <HugeiconsIcon
                          icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                          className="size-4"
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center gap-1">
                      분과
                      {sortField === 'department' && (
                        <HugeiconsIcon
                          icon={sortDirection === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                          className="size-4"
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClubs.length > 0 ? (
                  sortedClubs.map((club) => (
                    <TableRow key={club.clubUUID}>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={(club.mainPhoto && club.mainPhoto !== '') ? club.mainPhoto : '/circle_default_image.png'}
                            alt={club.clubName}
                          />
                          <AvatarFallback>
                            <img src="/circle_default_image.png" alt="Default Image" className="h-8 w-8 rounded-full" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{club.clubName}</TableCell>
                      <TableCell>{club.leaderName || '-'}</TableCell>
                      <TableCell>{club.numberOfClubMembers || 0}명</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {DEPARTMENT_LABELS[club.department as Department] || club.department || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(club.clubUUID)}
                          className="h-8 w-8"
                        >
                          <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>동아리를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 선택한 동아리와 그 모든 데이터가 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteClub}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  계속
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={adminPasswordDialog !== null} onOpenChange={handlePasswordDialogClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>관리자 비밀번호 확인</DialogTitle>
                <DialogDescription>
                  동아리를 삭제하기 위해 관리자 비밀번호를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">관리자 비밀번호</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="관리자 비밀번호를 입력하세요"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleConfirmDelete()
                      }
                    }}
                    autoFocus
                    disabled={deleteClubMutation.isPending}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handlePasswordDialogClose}
                  disabled={deleteClubMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={deleteClubMutation.isPending || !adminPassword.trim()}
                  variant="destructive"
                >
                  {deleteClubMutation.isPending ? '삭제 중...' : '삭제'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
