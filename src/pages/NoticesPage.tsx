import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dummyNotices } from '@/data/dummyData'

export function NoticesPage() {
  const notices = dummyNotices

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공지사항</h1>
        <p className="text-muted-foreground">동아리 공지사항을 확인하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공지사항 목록</CardTitle>
          <CardDescription>총 {notices.length}개의 공지사항</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">번호</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-32">작성자</TableHead>
                <TableHead className="w-40">작성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice, index) => (
                <TableRow
                  key={notice.noticeUUID}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="text-muted-foreground">{notices.length - index}</TableCell>
                  <TableCell className="font-medium">{notice.noticeTitle}</TableCell>
                  <TableCell>{notice.adminName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(notice.noticeCreatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {notices.length === 0 && (
            <p className="text-center text-muted-foreground py-8">공지사항이 없습니다</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
