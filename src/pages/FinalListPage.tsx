import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete01Icon } from '@hugeicons/core-free-icons'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useApplicantsByStatus, useDeleteApplicants } from '@/features/club-leader/hooks/useClubLeader'
import { useApplicationDetail } from '@/features/application/hooks/useApplication'
import { useActiveForm } from '@/features/form-management/hooks'
import type { ApplicantStatus, Applicant } from '@/features/club-leader/domain/clubLeaderSchemas'
import type { FormDetailResponse } from '@/features/form-management/domain/formSchemas'

function buildOptionContentMap(formData: FormDetailResponse | undefined): Map<number, string> {
  const map = new Map<number, string>()
  if (!formData) return map
  for (const question of formData.questions) {
    for (const option of question.options) {
      map.set(option.optionId, option.content)
    }
  }
  return map
}

function ApplicantDetailContent({
  clubUUID,
  applicant,
  optionContentMap,
}: {
  clubUUID: string
  applicant: Applicant
  optionContentMap: Map<number, string>
}) {
  const { data, isLoading, error } = useApplicationDetail(clubUUID, applicant.aplictUUID)

  if (isLoading) {
    return (
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="py-2 text-sm text-muted-foreground">
        지원서를 불러오는데 실패했습니다.
      </div>
    )
  }

  const detail = data.data

  return (
    <div className="space-y-3 py-2">
      <div className="grid gap-2 md:grid-cols-2 text-sm">
        <div>
          <span className="text-muted-foreground">연락처: </span>
          {applicant.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
        </div>
        <div>
          <span className="text-muted-foreground">학번: </span>
          {applicant.studentNumber}
        </div>
        <div>
          <span className="text-muted-foreground">학과: </span>
          {detail.department}
        </div>
        <div>
          <span className="text-muted-foreground">제출일: </span>
          {new Date(detail.submittedAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        {detail.qnaList.map((item, index) => {
          const resolvedAnswer = item.answer
            ?? (item.optionId != null ? optionContentMap.get(item.optionId) : undefined)
            ?? null

          return (
            <div key={item.questionId} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Q{index + 1}. {item.question}
              </p>
              <p className="text-sm bg-muted/50 rounded p-2">
                {resolvedAnswer || '(답변 없음)'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FinalListPage() {
  const clubUUID = useAuthStore((state) => state.clubUUID)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Fetch active form to resolve optionId → content
  const { data: formData } = useActiveForm(clubUUID || '')
  const optionContentMap = useMemo(() => buildOptionContentMap(formData), [formData])

  // Fetch only finalized applicants (isResultPublished=true)
  const { data: passedData, isLoading: passedLoading, error: passedError } = useApplicantsByStatus(clubUUID || '', 'PASS', true)
  const { data: failedData, isLoading: failedLoading, error: failedError } = useApplicantsByStatus(clubUUID || '', 'FAIL', true)

  const isLoading = passedLoading || failedLoading
  const hasError = passedError || failedError
  const passedApplicants = passedData?.data || []
  const failedApplicants = failedData?.data || []
  const allApplicants = [...passedApplicants, ...failedApplicants]

  const deleteApplicants = useDeleteApplicants()

  const toggleSelectApplicant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAllInSection = (list: Applicant[]) => {
    const ids = list.map((a) => a.aplictUUID)
    const allSelected = ids.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0 || !clubUUID) return
    deleteApplicants.mutate(
      { clubUUID, aplictUUIDs: selectedIds },
      { onSuccess: () => setSelectedIds([]) }
    )
  }

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case 'PASS':
        return <Badge className="bg-green-500">합격</Badge>
      case 'FAIL':
        return <Badge variant="destructive">불합격</Badge>
      default:
        return <Badge variant="secondary">대기</Badge>
    }
  }

  if (!clubUUID) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">동아리 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">최종 명단을 불러오는데 실패했습니다.</p>
      </div>
    )
  }

  const renderApplicantList = (
    list: Applicant[],
    sectionStatus: ApplicantStatus,
    emptyMessage: string
  ) => {
    if (list.length === 0) {
      return <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
    }

    const sectionIds = list.map((a) => a.aplictUUID)
    const allChecked = sectionIds.length > 0 && sectionIds.every((id) => selectedIds.includes(id))

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1 pb-1">
          <Checkbox
            checked={allChecked}
            onCheckedChange={() => toggleSelectAllInSection(list)}
          />
          <span className="text-sm text-muted-foreground">전체 선택</span>
        </div>
        <Accordion className="space-y-2">
          {list.map((applicant) => (
            <AccordionItem
              key={applicant.aplictUUID}
              value={applicant.aplictUUID}
              className="border rounded-lg px-4 bg-background"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-1 items-center gap-3 mr-2 text-left">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.includes(applicant.aplictUUID)}
                      onCheckedChange={() => toggleSelectApplicant(applicant.aplictUUID)}
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between">
                    <div>
                      <p className="font-medium">{applicant.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {applicant.studentNumber} | {applicant.major}
                      </p>
                    </div>
                    <div className="mr-2 mt-0.5">
                      {getStatusBadge(applicant.status ?? sectionStatus)}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApplicantDetailContent
                  clubUUID={clubUUID}
                  applicant={applicant}
                  optionContentMap={optionContentMap}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">최종 명단</h1>
          <p className="text-muted-foreground">
            확정된 지원자 {allApplicants.length}명 (합격 {passedApplicants.length}명 / 불합격 {failedApplicants.length}명)
          </p>
        </div>
        {selectedIds.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm">
                  <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
                  {selectedIds.length}명 삭제
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>지원서를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  선택한 {selectedIds.length}명의 지원서를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteApplicants.isPending}
                >
                  {deleteApplicants.isPending ? '삭제 중...' : '삭제'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* 합격자 명단 */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            합격
            <Badge className="bg-green-500">{passedApplicants.length}명</Badge>
          </CardTitle>
          <CardDescription>결과가 확정된 합격자 명단입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplicantList(passedApplicants, 'PASS', '확정된 합격자가 없습니다')}
        </CardContent>
      </Card>

      {/* 불합격자 명단 */}
      <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            불합격
            <Badge variant="destructive">{failedApplicants.length}명</Badge>
          </CardTitle>
          <CardDescription>결과가 확정된 불합격자 명단입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplicantList(failedApplicants, 'FAIL', '확정된 불합격자가 없습니다')}
        </CardContent>
      </Card>
    </div>
  )
}
