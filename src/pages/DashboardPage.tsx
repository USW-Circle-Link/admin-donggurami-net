import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon, Delete01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { dummyClubSummary, dummyClubMembers } from '@/data/dummyData'
import { useDeleteClubMembers } from '@/features/club-leader/hooks/useClubLeader'

export function DashboardPage() {
  const club = dummyClubSummary
  const [members, setMembers] = useState(dummyClubMembers)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { mutate: deleteMembers, isPending: isDeleting } = useDeleteClubMembers()

  const handleExportExcel = () => {
    alert('명단을 엑셀로 내보냅니다.')
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(members.map((m) => m.clubMemberUUID))
    }
  }

  const toggleSelectMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return

    deleteMembers(
      {
        clubUUID: club.clubUUID,
        members: selectedIds.map((id) => ({ clubMemberUUID: id })),
      },
      {
        onSuccess: () => {
          setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.clubMemberUUID)))
          setSelectedIds([])
          alert('선택한 회원이 삭제되었습니다.')
        },
        onError: () => {
          alert('회원 삭제에 실패했습니다.')
        },
      }
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {club.clubName}
                <Badge variant={club.recruitmentStatus === 'OPEN' ? 'default' : 'secondary'}>
                  {club.recruitmentStatus === 'OPEN' ? '모집중' : '모집마감'}
                </Badge>
              </CardTitle>
              <CardDescription>{club.clubCategories.join(', ')}</CardDescription>
            </div>
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

          {club.clubIntro && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">동아리 소개</p>
              <p className="mt-1 text-sm">{club.clubIntro}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 동아리 명단 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>동아리 명단</CardTitle>
              <CardDescription>총 {members.length}명</CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
                      {selectedIds.length}명 삭제
                    </Button>
                  </AlertDialogTrigger>
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
              <Button onClick={handleExportExcel} variant="outline" size="sm">
                <HugeiconsIcon icon={FileDownloadIcon} className="mr-2 size-4" />
                내보내기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={members.length > 0 && selectedIds.length === members.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>이름</TableHead>
                <TableHead>학번</TableHead>
                <TableHead>학과</TableHead>
                <TableHead>연락처</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    등록된 회원이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow
                    key={member.clubMemberUUID}
                    className={selectedIds.includes(member.clubMemberUUID) ? 'bg-muted/50' : ''}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(member.clubMemberUUID)}
                        onChange={() => toggleSelectMember(member.clubMemberUUID)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{member.userName}</TableCell>
                    <TableCell>{member.studentNumber}</TableCell>
                    <TableCell>{member.major}</TableCell>
                    <TableCell>{member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</TableCell>
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
