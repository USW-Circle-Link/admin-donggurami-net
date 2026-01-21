import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete01Icon, Add01Icon, Edit02Icon, Cancel01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { useAdminCategories, useCreateCategory, useDeleteCategory } from '@/features/admin/hooks/useAdmin'
import type { AdminCategory } from '@/features/admin/domain/adminSchemas'

export function CategoryEditPage() {
  const { data: categoriesData, isLoading, error } = useAdminCategories()
  const categories: AdminCategory[] = categoriesData?.data || []
  const { mutate: createCategory } = useCreateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()

  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null)

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    createCategory(
      { clubCategoryName: newCategoryName.trim() },
      {
        onSuccess: () => {
          toast.success('카테고리가 추가되었습니다.')
          setNewCategoryName('')
        },
        onError: () => {
          toast.error('카테고리 추가에 실패했습니다.')
        },
      }
    )
  }

  const handleRemoveCategory = (clubCategoryUUID: string) => {
    const category = categories.find((cat: AdminCategory) => cat.clubCategoryUUID === clubCategoryUUID)
    if (!category) return

    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!categoryToDelete) return

    deleteCategory(categoryToDelete.clubCategoryUUID, {
      onSuccess: () => {
        toast.success('카테고리가 삭제되었습니다.')
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      },
      onError: () => {
        toast.error('카테고리 삭제에 실패했습니다.')
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      },
    })
  }

  const handleStartEdit = (category: AdminCategory) => {
    setEditingId(category.clubCategoryUUID)
    setEditingName(category.clubCategoryName)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleSaveEdit = (clubCategoryUUID: string) => {
    if (!editingName.trim()) return

    const exists = categories.some(
      (cat: AdminCategory) => cat.clubCategoryUUID !== clubCategoryUUID && cat.clubCategoryName.toLowerCase() === editingName.trim().toLowerCase()
    )

    if (exists) {
      toast.error('이미 존재하는 카테고리 이름입니다.')
      return
    }

    createCategory(
      { clubCategoryName: editingName.trim() },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditingName('')
          toast.success('카테고리 이름이 수정되었습니다.')
        },
        onError: () => {
          toast.error('카테고리 이름 수정에 실패했습니다.')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">동아리 카테고리 수정</h1>
          <p className="text-muted-foreground">동아리 회장이 선택할 수 있는 카테고리를 관리하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>카테고리 목록</CardTitle>
            <CardDescription>총 {0}개의 카테고리가 등록되어 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">동아리 카테고리 수정</h1>
          <p className="text-muted-foreground">동아리 회장이 선택할 수 있는 카테고리를 관리하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">카테고리를 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">동아리 카테고리 수정</h1>
        <p className="text-muted-foreground">동아리 회장이 선택할 수 있는 카테고리를 관리하세요</p>
      </div>

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
              className="max-w-xs"
            />
            <Button onClick={handleAddCategory}>
              <HugeiconsIcon icon={Add01Icon} className="mr-1" />
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>카테고리 목록</CardTitle>
          <CardDescription>총 {categories.length}개의 카테고리가 등록되어 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category: AdminCategory) => (
                <div
                  key={category.clubCategoryUUID}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  {editingId === category.clubCategoryUUID ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(category.clubCategoryUUID)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="max-w-xs"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon-sm" onClick={() => handleSaveEdit(category.clubCategoryUUID)}>
                        <HugeiconsIcon icon={Tick01Icon} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={handleCancelEdit}>
                        <HugeiconsIcon icon={Cancel01Icon} className="text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{category.clubCategoryName}</span>
                      <Badge variant="secondary">0개 동아리</Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleStartEdit(category)}>
                          <HugeiconsIcon icon={Edit02Icon} className="text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveCategory(category.clubCategoryUUID)}
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

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button onClick={() => toast.success('카테고리 정보가 저장되었습니다.')}>저장</Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 카테고리에 {categoryToDelete?.clubCategoryName} 동아리가 있습니다. 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
