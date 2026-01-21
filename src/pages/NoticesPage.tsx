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
import { Skeleton } from '@/components/ui/skeleton'
import { useNotices, useNotice } from '@/features/notice/hooks/useNotices'
import type { NoticeListItem } from '@/features/notice/domain/noticeSchemas'

export function NoticesPage() {
  const { data: noticesData, isLoading: listLoading, error: listError } = useNotices()
  const notices: NoticeListItem[] = noticesData?.data?.content || []
  const [selectedNoticeUUID, setSelectedNoticeUUID] = useState<string | null>(null)

  const { data: noticeDetailData, isLoading: detailLoading, error: detailError } = useNotice(selectedNoticeUUID || '')
  const noticeDetail = noticeDetailData?.data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleViewDetail = (noticeUUID: string) => {
    setSelectedNoticeUUID(noticeUUID)
  }

  const handleBackToList = () => {
    setSelectedNoticeUUID(null)
  }

  if (listLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">공지사항</h1>
          <p className="text-muted-foreground">동아리 공지사항을 확인하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>공지사항 목록</CardTitle>
            <CardDescription>총 {0}개의 공지사항</CardDescription>
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

  if (listError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">공지사항</h1>
          <p className="text-muted-foreground">동아리 공지사항을 확인하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">공지사항을 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedNoticeUUID && noticeDetail) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList} className="gap-2">
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          목록으로 돌아가기
        </Button>

        {detailLoading ? (
          <Card>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : detailError ? (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive">공지사항 상세를 불러오는 중 오류가 발생했습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-xl">{noticeDetail.noticeTitle}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{noticeDetail.adminName}</span>
                  <span>{formatDate(noticeDetail.noticeCreatedAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="text-sm leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_img]:max-w-full [&_img]:rounded [&_a]:text-blue-600 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: noticeDetail.noticeContent }}
              />

              {noticeDetail.noticePhotos && noticeDetail.noticePhotos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">첨부 이미지</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {noticeDetail.noticePhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`첨부 이미지 ${index + 1}`}
                        className="rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/v2/circle_default_image.png'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
              {notices.length > 0 ? (
                notices.map((notice: NoticeListItem, index: number) => (
                  <TableRow
                    key={notice.noticeUUID}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetail(notice.noticeUUID)}
                  >
                    <TableCell className="text-muted-foreground">{notices.length - index}</TableCell>
                    <TableCell className="font-medium">{notice.noticeTitle}</TableCell>
                    <TableCell>{notice.adminName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(notice.noticeCreatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    공지사항이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
