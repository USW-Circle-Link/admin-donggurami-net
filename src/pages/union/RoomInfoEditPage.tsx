import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, Delete01Icon, Add01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
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
import { useFloorPhoto, useUploadFloorPhoto, useDeleteFloorPhoto } from '@/features/admin/hooks/useAdmin'
import type { FloorType } from '@/features/admin/domain/adminSchemas'

const FLOOR_TYPES: FloorType[] = ['B1', 'F1', 'F2']

function FloorPhotoCard({ floor }: { floor: FloorType }) {
  const { data: floorPhotoData, isLoading, error } = useFloorPhoto(floor)
  const { mutate: uploadFloorPhoto, isPending: isUploading } = useUploadFloorPhoto()
  const { mutate: deleteFloorPhoto, isPending: isDeleting } = useDeleteFloorPhoto()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const floorData = floorPhotoData?.data
  const imageUrl = floorData?.presignedUrl

  const getFloorLabel = (floor: FloorType) => {
    switch (floor) {
      case 'B1':
        return '지하층'
      case 'F1':
        return '1층'
      case 'F2':
        return '2층'
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFloorPhoto(
        { floor, photo: file },
        {
          onSuccess: () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          },
          onError: () => {
            toast.error('층면도 이미지 업로드에 실패했습니다.')
          },
        }
      )
    }
  }

  const handleRemoveImage = () => {
    if (imageUrl) {
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    deleteFloorPhoto(floor, {
      onSuccess: () => {
        toast.success('층면도 이미지가 삭제되었습니다.')
        setDeleteDialogOpen(false)
      },
      onError: () => {
        toast.error('층면도 이미지 삭제에 실패했습니다.')
        setDeleteDialogOpen(false)
      },
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle>{getFloorLabel(floor)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">층면도 정보를 불러오는 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{getFloorLabel(floor)}</CardTitle>
            <CardDescription>
              동아리방 배치도 이미지를 업로드하세요
              {imageUrl && ` (현재 이미지 있음)`}
            </CardDescription>
          </div>
          {imageUrl && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRemoveImage}
              disabled={isDeleting}
            >
              <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`floor-image-${floor}`}>배치도 이미지</Label>
            <input
              type="file"
              id={`floor-image-${floor}`}
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <div className="relative mt-2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${getFloorLabel(floor)} 배치도`}
                  className="max-w-full h-auto rounded-lg border"
                />
              ) : (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon icon={Image01Icon} className="size-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {isUploading ? '업로드 중...' : '클릭하여 이미지를 업로드하세요'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF 지원</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>층면도 이미지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {getFloorLabel(floor)}의 층면도 이미지를 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export function RoomInfoEditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">동아리방 정보 수정</h1>
        <p className="text-muted-foreground">층별 동아리방 배치도를 관리하세요</p>
      </div>

      {/* 층 추가 */}
      <Card>
        <CardHeader>
          <CardTitle>새 층 추가</CardTitle>
          <CardDescription>새로운 층 정보를 추가합니다 (지하층은 음수로 입력)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="층 번호 (예: 3, -1)"
              className="max-w-xs"
            />
            <Button onClick={() => toast.info('기능 개발 중입니다.')}>
              <HugeiconsIcon icon={Add01Icon} className="mr-1" />
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 층별 정보 */}
      {FLOOR_TYPES.map((floor) => (
        <FloorPhotoCard key={floor} floor={floor} />
      ))}

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={() => toast.success('층면도 정보가 저장되었습니다.')}>저장</Button>
      </div>
    </div>
  )
}
