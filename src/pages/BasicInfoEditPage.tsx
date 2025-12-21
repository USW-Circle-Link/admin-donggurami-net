import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { dummyClubSummary } from '@/data/dummyData'

export function BasicInfoEditPage() {
  const [formData, setFormData] = useState({
    leaderName: dummyClubSummary.leaderName,
    leaderHp: dummyClubSummary.leaderHp,
    clubRoomNumber: dummyClubSummary.clubRoomNumber,
    clubInsta: dummyClubSummary.clubInsta || '',
    clubIntro: dummyClubSummary.clubIntro || '',
    clubHashtag: dummyClubSummary.clubHashtag,
  })

  const [newHashtag, setNewHashtag] = useState('')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 API 호출
    alert('기본정보가 저장되었습니다.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">기본정보 수정</h1>
        <p className="text-muted-foreground">동아리의 기본 정보를 수정하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dummyClubSummary.clubName}</CardTitle>
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

            <div className="space-y-2">
              <Label htmlFor="clubIntro">동아리 소개</Label>
              <Textarea
                id="clubIntro"
                name="clubIntro"
                value={formData.clubIntro}
                onChange={handleChange}
                placeholder="동아리 소개를 입력하세요"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">최대 3000자까지 입력 가능합니다</p>
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
              <div className="flex gap-2 mt-2">
                {formData.clubHashtag.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveHashtag(index)}
                  >
                    {tag} &times;
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                취소
              </Button>
              <Button type="submit">저장</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
