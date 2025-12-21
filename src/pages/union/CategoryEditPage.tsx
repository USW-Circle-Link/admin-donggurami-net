import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete01Icon, Add01Icon, Edit02Icon, Cancel01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { dummyCategories, type ClubCategory } from '@/data/dummyData'

export function CategoryEditPage() {
  const [categories, setCategories] = useState<ClubCategory[]>(dummyCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const exists = categories.some(
        (cat) => cat.categoryName.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
      if (exists) {
        alert('이미 존재하는 카테고리입니다.')
        return
      }
      setCategories((prev) => [
        ...prev,
        {
          categoryUUID: `cat-${Date.now()}`,
          categoryName: newCategoryName.trim(),
          clubCount: 0,
        },
      ])
      setNewCategoryName('')
    }
  }

  const handleRemoveCategory = (categoryUUID: string) => {
    const category = categories.find((cat) => cat.categoryUUID === categoryUUID)
    if (category && category.clubCount > 0) {
      if (!confirm(`이 카테고리에 ${category.clubCount}개의 동아리가 있습니다. 삭제하시겠습니까?`)) {
        return
      }
    }
    setCategories((prev) => prev.filter((cat) => cat.categoryUUID !== categoryUUID))
  }

  const handleStartEdit = (category: ClubCategory) => {
    setEditingId(category.categoryUUID)
    setEditingName(category.categoryName)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleSaveEdit = (categoryUUID: string) => {
    if (editingName.trim()) {
      const exists = categories.some(
        (cat) => cat.categoryUUID !== categoryUUID && cat.categoryName.toLowerCase() === editingName.trim().toLowerCase()
      )
      if (exists) {
        alert('이미 존재하는 카테고리 이름입니다.')
        return
      }
      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryUUID === categoryUUID ? { ...cat, categoryName: editingName.trim() } : cat
        )
      )
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleSubmit = () => {
    alert('카테고리 정보가 저장되었습니다.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">동아리 카테고리 수정</h1>
        <p className="text-muted-foreground">동아리 회장이 선택할 수 있는 카테고리를 관리하세요</p>
      </div>

      {/* 카테고리 추가 */}
      <Card>
        <CardHeader>
          <CardTitle>새 카테고리 추가</CardTitle>
          <CardDescription>새로운 카테고리를 추가합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="카테고리 이름 (예: 음악, 스포츠)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className="max-w-xs"
            />
            <Button onClick={handleAddCategory}>
              <HugeiconsIcon icon={Add01Icon} className="mr-1" />
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리 목록</CardTitle>
          <CardDescription>총 {categories.length}개의 카테고리가 등록되어 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.categoryUUID}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  {editingId === category.categoryUUID ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(category.categoryUUID)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="max-w-xs"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleSaveEdit(category.categoryUUID)}
                      >
                        <HugeiconsIcon icon={Tick01Icon} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={handleCancelEdit}>
                        <HugeiconsIcon icon={Cancel01Icon} className="text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.categoryName}</span>
                        <Badge variant="secondary">{category.clubCount}개 동아리</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleStartEdit(category)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} className="text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveCategory(category.categoryUUID)}
                        >
                          <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              등록된 카테고리가 없습니다. 새 카테고리를 추가해주세요.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>
    </div>
  )
}
