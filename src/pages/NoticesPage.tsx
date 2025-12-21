import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dummyNoticeDetails, type NoticeDetail } from '@/data/dummyData'

export function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null)
  const notices = dummyNoticeDetails

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // 상세 보기
  if (selectedNotice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedNotice(null)} className="gap-2">
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          목록으로 돌아가기
        </Button>

        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-xl">{selectedNotice.noticeTitle}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{selectedNotice.adminName}</span>
                <span>{formatDate(selectedNotice.noticeCreatedAt)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedNotice.noticeContent}
            </div>

            {selectedNotice.noticePhotos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">첨부 이미지</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedNotice.noticePhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`첨부 이미지 ${index + 1}`}
                      className="rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // 목록 보기
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
                  onClick={() => setSelectedNotice(notice)}
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
