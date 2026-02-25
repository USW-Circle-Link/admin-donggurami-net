import { useState, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, Add01Icon, Image01Icon, Delete01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
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
import { useNotices, useNotice, useCreateNotice, useDeleteNotice } from '@/features/notice/hooks/useNotices'
import type { NoticeListItem } from '@/features/notice/domain/noticeSchemas'
import { convertToWebP } from '@/shared/utils/convertToWebP'

type ViewMode = 'list' | 'detail' | 'create'

export function UnionNoticesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedNoticeUUID, setSelectedNoticeUUID] = useState<string | null>(null)

  const { data: noticesData, isLoading: listLoading, error: listError } = useNotices()
  const notices: NoticeListItem[] = noticesData?.data?.content || []

  const { data: noticeDetailData, isLoading: detailLoading, error: detailError } = useNotice(selectedNoticeUUID || '')
  const noticeDetail = noticeDetailData?.data

  const { mutate: createNotice, isPending: isCreating } = useCreateNotice()
  const { mutate: deleteNoticeMutation, isPending: isDeleting } = useDeleteNotice()

  // 새 공지 작성 상태
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setSelectedNoticeUUID(null)
    setViewMode('list')
    // Reset create form
    setNewTitle('')
    setNewContent('')
    setNewPhotos([])
    setPreviewPhotos([])
  }

  const handleDeleteNotice = () => {
    if (!selectedNoticeUUID) return
    deleteNoticeMutation(selectedNoticeUUID, {
      onSuccess: () => {
        handleBackToList()
        toast.success('공지사항이 삭제되었습니다.')
      },
      onError: () => {
        toast.error('공지사항 삭제에 실패했습니다.')
      },
    })
  }

  const handleStartCreate = () => {
    setNewTitle('')
    setNewContent('')
    setNewPhotos([])
    setPreviewPhotos([])
    setViewMode('create')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const webpFiles = await Promise.all(fileArray.map((file) => convertToWebP(file)))
      setNewPhotos((prev) => [...prev, ...webpFiles])

      webpFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewPhotos((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
    setPreviewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateNotice = () => {
    if (!newTitle.trim()) {
      toast.error('제목을 입력해주세요.')
      return
    }
    if (!newContent.trim()) {
      toast.error('내용을 입력해주세요.')
      return
    }

    createNotice(
      {
        request: {
          noticeTitle: newTitle.trim(),
          noticeContent: newContent.trim().replace(/\n/g, '<br>'),
          photoOrders: newPhotos.map((_, index) => index + 1),
        },
        photos: newPhotos.length > 0 ? newPhotos : undefined,
      },
      {
        onSuccess: () => {
          handleBackToList()
          toast.success('공지사항이 등록되었습니다.')
        },
        onError: () => {
          toast.error('공지사항 등록에 실패했습니다.')
        },
      }
    )
  }

  // 로딩 상태
  if (listLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">공지사항</h1>
            <p className="text-muted-foreground">공지사항을 관리하세요</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>공지사항 목록</CardTitle>
            <CardDescription>총 0개의 공지사항</CardDescription>
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

  // 에러 상태
  if (listError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">공지사항</h1>
            <p className="text-muted-foreground">공지사항을 관리하세요</p>
          </div>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">공지사항을 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 작성 화면
  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList} className="gap-2">
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          목록으로 돌아가기
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>새 공지사항 작성</CardTitle>
            <CardDescription>동아리들에게 전달할 공지사항을 작성하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="noticeTitle">제목</Label>
              <Input
                id="noticeTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noticeContent">내용</Label>
              <Textarea
                id="noticeContent"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                rows={10}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label>이미지 첨부</Label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCreating}
              >
                <HugeiconsIcon icon={Image01Icon} className="mr-2" />
                이미지 추가
              </Button>

              {previewPhotos.length > 0 && (
                <div className="grid gap-2 md:grid-cols-3 mt-4">
                  {previewPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`첨부 이미지 ${index + 1}`}
                        className="rounded-lg border w-full h-32 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemovePhoto(index)}
                        disabled={isCreating}
                      >
                        <HugeiconsIcon icon={Delete01Icon} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleBackToList} disabled={isCreating}>
                취소
              </Button>
              <Button onClick={handleCreateNotice} disabled={isCreating}>
                {isCreating ? '등록 중...' : '등록'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 상세 보기
  if (viewMode === 'detail' && selectedNoticeUUID) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToList} className="gap-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            목록으로 돌아가기
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
                  {isDeleting ? '삭제 중...' : '삭제'}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>공지사항을 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 공지사항을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteNotice}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {detailLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : detailError ? (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive">공지사항을 불러오는 중 오류가 발생했습니다.</p>
            </CardContent>
          </Card>
        ) : noticeDetail ? (
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-xl">{noticeDetail.noticeTitle}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{noticeDetail.authorName}</span>
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
                          e.currentTarget.src = '/circle_default_image.png'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  // 목록 보기
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">공지사항</h1>
          <p className="text-muted-foreground">공지사항을 관리하세요</p>
        </div>
        <Button onClick={handleStartCreate}>
          <HugeiconsIcon icon={Add01Icon} className="mr-2" />
          새 공지 작성
        </Button>
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
                    <TableCell>{notice.authorName}</TableCell>
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
