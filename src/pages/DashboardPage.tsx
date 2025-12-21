import { HugeiconsIcon } from '@hugeicons/react'
import { FileDownloadIcon } from '@hugeicons/core-free-icons'
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
import { dummyClubSummary, dummyClubMembers } from '@/data/dummyData'

export function DashboardPage() {
  const club = dummyClubSummary
  const members = dummyClubMembers

  const handleExportExcel = () => {
    // 실제로는 엑셀 파일 생성 로직
    alert('명단을 엑셀로 내보냅니다.')
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

          {/* 해시태그 */}
          <div className="mt-4 flex gap-2">
            {club.clubHashtag.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 동아리 소개 */}
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
            <Button onClick={handleExportExcel} variant="outline">
              <HugeiconsIcon icon={FileDownloadIcon} className="mr-2" />
              엑셀로 내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>학번</TableHead>
                <TableHead>학과</TableHead>
                <TableHead>연락처</TableHead>
                {/* <TableHead>구분</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.clubMemberUUID}>
                  <TableCell className="font-medium">{member.userName}</TableCell>
                  <TableCell>{member.studentNumber}</TableCell>
                  <TableCell>{member.major}</TableCell>
                  <TableCell>{member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</TableCell>
                  {/* <TableCell>
                    <Badge variant={member.memberType === 'REGULARMEMBER' ? 'default' : 'secondary'}>
                      {member.memberType === 'REGULARMEMBER' ? '정회원' : '비회원'}
                    </Badge>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
