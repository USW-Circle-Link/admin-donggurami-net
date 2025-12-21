import { useState, useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon, Delete01Icon, Add01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { dummyFloorRoomInfo, type FloorRoomInfo } from '@/data/dummyData'

export function RoomInfoEditPage() {
  const [floors, setFloors] = useState<FloorRoomInfo[]>(dummyFloorRoomInfo)
  const [newFloorNumber, setNewFloorNumber] = useState('')
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const handleImageUpload = (floorNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFloors((prev) =>
          prev.map((floor) =>
            floor.floor === floorNumber ? { ...floor, imageUrl: reader.result as string } : floor
          )
        )
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (floorNumber: number) => {
    setFloors((prev) =>
      prev.map((floor) =>
        floor.floor === floorNumber ? { ...floor, imageUrl: null } : floor
      )
    )
  }

  const handleAddFloor = () => {
    const floorNum = parseInt(newFloorNumber)
    if (!isNaN(floorNum)) {
      const exists = floors.some((f) => f.floor === floorNum)
      if (exists) {
        alert('이미 존재하는 층입니다.')
        return
      }
      setFloors((prev) => [
        ...prev,
        {
          floor: floorNum,
          imageUrl: null,
          rooms: [],
        },
      ].sort((a, b) => a.floor - b.floor))
      setNewFloorNumber('')
    }
  }

  const handleRemoveFloor = (floorNumber: number) => {
    setFloors((prev) => prev.filter((floor) => floor.floor !== floorNumber))
  }

  const getFloorName = (floorNum: number) => {
    if (floorNum < 0) return `지하${Math.abs(floorNum)}층`
    return `${floorNum}층`
  }

  const handleSubmit = () => {
    alert('동아리방 정보가 저장되었습니다.')
  }

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
              value={newFloorNumber}
              onChange={(e) => setNewFloorNumber(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleAddFloor}>
              <HugeiconsIcon icon={Add01Icon} className="mr-1" />
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 층별 정보 */}
      {floors.map((floor) => (
        <Card key={floor.floor}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{getFloorName(floor.floor)}</CardTitle>
                <CardDescription>
                  동아리방 배치도 이미지를 업로드하세요
                  {floor.rooms.length > 0 && ` (${floor.rooms.join(', ')})`}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveFloor(floor.floor)}
              >
                <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`floor-image-${floor.floor}`}>배치도 이미지</Label>
                <input
                  type="file"
                  id={`floor-image-${floor.floor}`}
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[floor.floor] = el }}
                  onChange={(e) => handleImageUpload(floor.floor, e)}
                />
              </div>

              {floor.imageUrl ? (
                <div className="relative">
                  <img
                    src={floor.imageUrl}
                    alt={`${getFloorName(floor.floor)} 배치도`}
                    className="max-w-full h-auto rounded-lg border"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[floor.floor]?.click()}
                    >
                      <HugeiconsIcon icon={Image01Icon} className="mr-1" />
                      이미지 변경
                    </Button>
                    <Button variant="destructive" onClick={() => handleRemoveImage(floor.floor)}>
                      <HugeiconsIcon icon={Delete01Icon} className="mr-1" />
                      이미지 삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRefs.current[floor.floor]?.click()}
                >
                  <HugeiconsIcon icon={Image01Icon} className="size-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">클릭하여 이미지를 업로드하세요</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF 지원</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {floors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            등록된 층 정보가 없습니다. 위에서 새 층을 추가해주세요.
          </CardContent>
        </Card>
      )}

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>
    </div>
  )
}
