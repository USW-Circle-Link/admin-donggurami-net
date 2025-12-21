import { useState, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, Add01Icon, Image01Icon, Delete01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dummyNoticeDetails, type NoticeDetail } from '@/data/dummyData'

type ViewMode = 'list' | 'detail' | 'create'

export function UnionNoticesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null)
  const [notices, setNotices] = useState<NoticeDetail[]>(dummyNoticeDetails)

  // 새 공지 작성 상태
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newPhotos, setNewPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleViewDetail = (notice: NoticeDetail) => {
    setSelectedNotice(notice)
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setSelectedNotice(null)
    setViewMode('list')
  }

  const handleStartCreate = () => {
    setNewTitle('')
    setNewContent('')
    setNewPhotos([])
    setViewMode('create')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setNewPhotos((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateNotice = () => {
    if (!newTitle.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!newContent.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    const newNotice: NoticeDetail = {
      noticeUUID: `notice-${Date.now()}`,
      noticeTitle: newTitle.trim(),
      noticeContent: newContent.trim(),
      noticePhotos: newPhotos,
      noticeCreatedAt: new Date().toISOString(),
      adminName: '동아리 연합회',
    }

    setNotices((prev) => [newNotice, ...prev])
    setViewMode('list')
    alert('공지사항이 등록되었습니다.')
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
              >
                <HugeiconsIcon icon={Image01Icon} className="mr-2" />
                이미지 추가
              </Button>

              {newPhotos.length > 0 && (
                <div className="grid gap-2 md:grid-cols-3 mt-4">
                  {newPhotos.map((photo, index) => (
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
                      >
                        <HugeiconsIcon icon={Delete01Icon} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleBackToList}>
                취소
              </Button>
              <Button onClick={handleCreateNotice}>등록</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 상세 보기
  if (viewMode === 'detail' && selectedNotice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList} className="gap-2">
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
              {notices.map((notice, index) => (
                <TableRow
                  key={notice.noticeUUID}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetail(notice)}
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
