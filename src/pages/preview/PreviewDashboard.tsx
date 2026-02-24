import { HugeiconsIcon } from '@hugeicons/react'
import { InstagramIcon } from '@hugeicons/core-free-icons'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { AppSidebar } from '@/components/layout/AppSidebar'

const DUMMY_MEMBERS = [
  { id: '1', name: '이민수', studentNumber: '20231001', major: '컴퓨터학부', phone: '010-2345-6789', memberType: '정회원' },
  { id: '2', name: '박서연', studentNumber: '20231042', major: '정보통신학과', phone: '010-3456-7890', memberType: '정회원' },
  { id: '3', name: '최현우', studentNumber: '20241015', major: '컴퓨터학부', phone: '010-4567-8901', memberType: '정회원' },
  { id: '4', name: '정하은', studentNumber: '20241033', major: '데이터과학부', phone: '010-5678-9012', memberType: '비회원' },
  { id: '5', name: '한지호', studentNumber: '20251008', major: '소프트웨어학과', phone: '010-6789-0123', memberType: '비회원' },
]

const HASHTAGS = ['코딩', '개발', 'IT', '프로그래밍']

export function PreviewDashboard() {
  return (
    <div className="pointer-events-none select-none w-full h-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">대시보드</h1>
                <p className="text-muted-foreground">동아리 현황을 한눈에 확인하세요</p>
              </div>

              {/* 동아리 기본 정보 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src="/circle_default_image.png" alt="코딩 동아리 로고" />
                      <AvatarFallback>
                        <img src="/circle_default_image.png" alt="Default Image" className="h-16 w-16 rounded-full" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 flex-wrap">
                        코딩 동아리
                        <Badge variant="default">모집중</Badge>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">대표자</p>
                      <p className="font-medium">김동구</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">연락처</p>
                      <p className="font-medium">010-1234-5678</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">동아리방</p>
                      <p className="font-medium">미래혁신관 301호</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">인스타그램</p>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <HugeiconsIcon icon={InstagramIcon} className="size-4" aria-hidden="true" />
                        @coding_club
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {HASHTAGS.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 동아리 명단 */}
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>동아리 명단</CardTitle>
                      <CardDescription>총 5명</CardDescription>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="이름, 학번, 학과로 검색..."
                      className="pl-10"
                      readOnly
                    />
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
                        <TableHead>회원유형</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DUMMY_MEMBERS.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.studentNumber}</TableCell>
                          <TableCell>{member.major}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>
                            <Badge variant={member.memberType === '정회원' ? 'default' : 'outline'}>
                              {member.memberType}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
