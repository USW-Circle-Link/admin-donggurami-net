import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, ReloadIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useClubDetail, useUpdateClubInfo } from '@/features/club-leader/hooks/useClubLeader'

export function BasicInfoEditPage() {
  const navigate = useNavigate()
  const { clubUUID } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 파일 크기 제한: 단일 파일 20MB, 전체 50MB
  const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB

  const { data: clubInfoData, isLoading, error } = useClubDetail(clubUUID || '')
  const clubInfo = clubInfoData?.data

  const { mutate: updateClubInfo, isPending: isUpdatingInfo } = useUpdateClubInfo()

  const initialFormData = useMemo(() => {
    if (clubInfo) {
      return {
        leaderName: clubInfo.leaderName,
        leaderHp: clubInfo.leaderHp,
        clubRoomNumber: clubInfo.clubRoomNumber,
        clubInsta: clubInfo.clubInsta || '',
        clubHashtag: clubInfo.clubHashtags,
      }
    }
    return {
      leaderName: '',
      leaderHp: '',
      clubRoomNumber: '',
      clubInsta: '',
      clubHashtag: [] as string[],
    }
  }, [clubInfo])

  const [formData, setFormData] = useState(initialFormData)
  const [newHashtag, setNewHashtag] = useState('')
  const [clubInfoText, setClubInfoText] = useState(clubInfo?.clubInfo || '')
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null)
  const [mainPhotoPreview, setMainPhotoPreview] = useState(clubInfo?.mainPhoto || '')
  const [infoPhotoFiles, setInfoPhotoFiles] = useState<(File | null)[]>(Array(5).fill(null))
  const [infoPhotoPreviews, setInfoPhotoPreviews] = useState<(string | null)[]>(Array(5).fill(null))

  useEffect(() => {
    if (clubInfo) {
      setFormData({
        leaderName: clubInfo.leaderName,
        leaderHp: clubInfo.leaderHp,
        clubRoomNumber: clubInfo.clubRoomNumber,
        clubInsta: clubInfo.clubInsta || '',
        clubHashtag: clubInfo.clubHashtags,
      })
      setMainPhotoPreview(clubInfo.mainPhoto || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubUUID, clubInfo])

  useEffect(() => {
    if (clubInfo) {
      setClubInfoText((clubInfo.clubInfo || '').replace(/<br\s*\/?>/g, '\n'))
      // Initialize 5 slots with existing photos
      const photos = clubInfo.infoPhotos || []
      const initialPhotos: (string | null)[] = Array(5).fill(null)
      photos.slice(0, 5).forEach((photo, index) => {
        initialPhotos[index] = photo
      })
      setInfoPhotoPreviews(initialPhotos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubInfo])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddHashtag = () => {
    if (newHashtag.trim() && formData.clubHashtag.length < 2) {
      setFormData((prev) => ({
        ...prev,
        clubHashtag: [...prev.clubHashtag, `#${newHashtag.replace('#', '')}`],
      }))
      setNewHashtag('')
    }
  }

  const handleRemoveHashtag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      clubHashtag: prev.clubHashtag.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setMainPhotoFile(null)
    setMainPhotoPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleInfoPhotosUpload = (index: number, file: File | null) => {
    if (!file) {
      // Clear the slot
      setInfoPhotoFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index] = null
        return newFiles
      })
      setInfoPhotoPreviews((prev) => {
        const newPreviews = [...prev]
        newPreviews[index] = null
        return newPreviews
      })
      return
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`이미지 파일이 너무 큽니다. (최대 ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB)`)
      return
    }

    // 전체 크기 검증 (기존 파일들 + 새 파일)
    const currentTotalSize = infoPhotoFiles.reduce((total, f) => total + (f?.size || 0), 0)
    if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
      toast.error(`전체 파일 크기가 너무 큽니다. (최대 ${Math.floor(MAX_TOTAL_SIZE / 1024 / 1024)}MB)`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setInfoPhotoPreviews((prev) => {
        const newPreviews = [...prev]
        newPreviews[index] = reader.result as string
        return newPreviews
      })
    }
    reader.readAsDataURL(file)

    // Store file
    setInfoPhotoFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index] = file
      return newFiles
    })
  }

  const handleRemoveInfoPhoto = (index: number) => {
    setInfoPhotoFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index] = null
      return newFiles
    })
    setInfoPhotoPreviews((prev) => {
      const newPreviews = [...prev]
      newPreviews[index] = null
      return newPreviews
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clubUUID) return

    // Build orders and deletedOrders for infoPhotos
    const existingPhotos = clubInfo?.infoPhotos || []
    const orders: number[] = []
    const deletedOrders: number[] = []
    const newPhotoFiles: File[] = []

    for (let i = 0; i < 5; i++) {
      const hasNewFile = infoPhotoFiles[i] !== null
      const hadExistingPhoto = i < existingPhotos.length && !!existingPhotos[i]
      const currentPreviewExists = infoPhotoPreviews[i] !== null && infoPhotoPreviews[i] !== ''

      if (hasNewFile) {
        orders.push(i + 1) // 1-indexed
        newPhotoFiles.push(infoPhotoFiles[i]!)
        if (hadExistingPhoto) {
          deletedOrders.push(i + 1)
        }
      } else if (hadExistingPhoto && !currentPreviewExists) {
        deletedOrders.push(i + 1)
      }
    }

    // Update club profile, main photo, club info, and intro photos in a single request
    updateClubInfo(
      {
        clubUUID,
        clubProfileRequest: {
          leaderName: formData.leaderName,
          leaderHp: formData.leaderHp,
          clubRoomNumber: formData.clubRoomNumber,
          clubInsta: formData.clubInsta || undefined,
          clubHashtag: formData.clubHashtag,
        },
        mainPhoto: mainPhotoFile || undefined,
        clubInfoRequest: {
          clubInfo: clubInfoText.trim().replace(/\n/g, '<br>') || undefined,
          recruitmentStatus: clubInfo?.recruitmentStatus || 'OPEN',
          clubRecruitment: clubInfo?.clubRecruitment || undefined,
          googleFormUrl: clubInfo?.googleFormUrl || undefined,
          orders: orders.length > 0 ? orders : undefined,
          deletedOrders: deletedOrders.length > 0 ? deletedOrders : undefined,
        },
        infoPhotos: newPhotoFiles.length > 0 ? newPhotoFiles : undefined,
      },
      {
        onSuccess: () => {
          toast.success('기본정보가 저장되었습니다.')
          navigate('/club/dashboard')
        },
        onError: () => {
          toast.error('기본정보 저장에 실패했습니다.')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">기본정보 수정</h1>
          <p className="text-muted-foreground">동아리의 기본 정보를 수정하세요</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !clubInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">기본정보 수정</h1>
          <p className="text-muted-foreground">동아리의 기본 정보를 수정하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error ? '동아리 정보를 불러오는 중 오류가 발생했습니다.' : '동아리 정보를 찾을 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">기본정보 수정</h1>
        <p className="text-muted-foreground">동아리의 기본 정보를 수정하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{clubInfo.clubName}</CardTitle>
          <CardDescription>동아리 정보를 수정할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="leaderName">대표자 이름</Label>
                <Input
                  id="leaderName"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  placeholder="대표자 이름"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaderHp">연락처</Label>
                <Input
                  id="leaderHp"
                  name="leaderHp"
                  value={formData.leaderHp}
                  onChange={handleChange}
                  placeholder="01012345678"
                  required
                />
                <p className="text-xs text-muted-foreground">하이픈(-) 없이 입력하세요</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clubRoomNumber">동아리방 호수</Label>
                <Input
                  id="clubRoomNumber"
                  name="clubRoomNumber"
                  value={formData.clubRoomNumber}
                  onChange={handleChange}
                  placeholder="301호"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clubInsta">인스타그램</Label>
                <Input
                  id="clubInsta"
                  name="clubInsta"
                  value={formData.clubInsta}
                  onChange={handleChange}
                  placeholder="@instagram_id"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainPhoto">동아리 로고</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  id="mainPhoto"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUpdatingInfo}
                />
                <div className="relative">
                  {mainPhotoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={mainPhotoPreview}
                        alt="동아리 로고"
                        className="max-w-32 h-auto rounded-lg border mb-2"
                        onError={(e) => {
                          e.currentTarget.src = '/circle_default_image.png'
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isUpdatingInfo}
                      >
                        <HugeiconsIcon icon={ReloadIcon} className="md:mr-2" /> <span className="hidden md:inline">재설정</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => !isUpdatingInfo && fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center w-full h-auto border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                      disabled={isUpdatingInfo}
                    >
                      <HugeiconsIcon icon={Image01Icon} className="size-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {isUpdatingInfo ? '업로드 중...' : '클릭하여 로고를 업로드하세요'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF 지원</p>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clubInfo">동아리 소개</Label>
              <Textarea
                id="clubInfo"
                value={clubInfoText}
                onChange={(e) => setClubInfoText(e.target.value)}
                placeholder="동아리를 소개하는 글을 작성하세요"
                maxLength={3000}
                rows={6}
                disabled={isUpdatingInfo}
              />
              <p className="text-xs text-muted-foreground">
                {clubInfoText.length}/3000자
              </p>
            </div>

            <div className="space-y-3">
              <Label>동아리 소개 사진</Label>

              {/* 5개 고정 슬롯 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const photo = infoPhotoPreviews[index]
                  const hasPhoto = photo !== null && photo !== ''

                  return (
                    <div key={index} className="relative group">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`info-photo-${index}`}
                        onChange={(e) => handleInfoPhotosUpload(index, e.target.files?.[0] || null)}
                        disabled={isUpdatingInfo}
                      />
                      {hasPhoto ? (
                        // 사진이 있는 경우
                        <div className="relative">
                          <img
                            src={photo}
                            alt={`소개 사진 ${index + 1}`}
                            className="w-full h-32 object-cover bg-muted rounded-lg border"
                            onError={() => {
                              // 유효하지 않은 이미지 처리
                              handleRemoveInfoPhoto(index)
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveInfoPhoto(index)}
                            disabled={isUpdatingInfo}
                          >
                            <HugeiconsIcon icon={ReloadIcon} className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        // 빈 슬롯
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            const input = document.getElementById(`info-photo-${index}`) as HTMLInputElement
                            input?.click()
                          }}
                          disabled={isUpdatingInfo}
                        >
                          <HugeiconsIcon icon={Upload01Icon} className="size-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">
                            {index + 1}번 사진
                          </span>
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF 지원 (최대 5장, 각 파일 최대 {Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label>해시태그 (최대 2개)</Label>
              <div className="flex gap-2">
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="해시태그 입력"
                  disabled={formData.clubHashtag.length >= 2}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddHashtag}
                  disabled={formData.clubHashtag.length >= 2}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {formData.clubHashtag.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer px-3 py-1.5 h-8 text-sm gap-2"
                    onClick={() => handleRemoveHashtag(index)}
                  >
                    {tag}
                    <span className="text-muted-foreground hover:text-foreground">
                      &times;
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/club/dashboard')} disabled={isUpdatingInfo}>
                취소
              </Button>
              <Button type="submit" disabled={isUpdatingInfo}>
                {isUpdatingInfo ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
