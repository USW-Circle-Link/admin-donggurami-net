import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ArrowLeft01Icon, Notification01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  useApplicants,
  useProcessApplicants,
  useSendApplicantNotifications,
} from '@/features/club-leader/hooks/useClubLeader'
import { useApplicationDetail } from '@/features/application/hooks/useApplication'
import type { ApplicantStatus, Applicant } from '@features/club-leader/domain/clubLeaderSchemas'

function ApplicantDetailContent({
  clubUUID,
  applicant,
}: {
  clubUUID: string
  applicant: Applicant
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
          <span className="text-muted-foreground">학과: </span>
          {detail.department}
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        {detail.qnaList.slice(0, 2).map((item, index) => (
          <div key={item.questionId} className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Q{index + 1}. {item.question}
            </p>
            <p className="text-sm bg-muted/50 rounded p-2 line-clamp-2">
              {item.answer || '(답변 없음)'}
            </p>
          </div>
        ))}
        {detail.qnaList.length > 2 && (
          <p className="text-xs text-muted-foreground">
            외 {detail.qnaList.length - 2}개 질문...
          </p>
        )}
      </div>
    </div>
  )
}

export function FinalizePage() {
  const { clubUUID } = useAuthStore()
  const { data: applicantsData, isLoading, error } = useApplicants(clubUUID || '')
  const processApplicants = useProcessApplicants()
  const sendNotifications = useSendApplicantNotifications()

  const [selectedPass, setSelectedPass] = useState<Set<string>>(new Set())
  const [selectedFail, setSelectedFail] = useState<Set<string>>(new Set())

  const applicants = applicantsData?.data || []
  const passedApplicants = applicants.filter((a) => a.status === 'PASS')
  const failedApplicants = applicants.filter((a) => a.status === 'FAIL')

  const handleToggleSelect = (uuid: string, status: ApplicantStatus) => {
    if (status === 'PASS') {
      setSelectedPass((prev) => {
        const next = new Set(prev)
        if (next.has(uuid)) {
          next.delete(uuid)
        } else {
          next.add(uuid)
        }
        return next
      })
    } else {
      setSelectedFail((prev) => {
        const next = new Set(prev)
        if (next.has(uuid)) {
          next.delete(uuid)
        } else {
          next.add(uuid)
        }
        return next
      })
    }
  }

  const handleMoveToFail = () => {
    if (!clubUUID || selectedPass.size === 0) return

    const updates = Array.from(selectedPass).map((uuid) => ({
      aplictUUID: uuid,
      status: 'FAIL' as ApplicantStatus,
    }))

    processApplicants.mutate(
      { clubUUID, updates },
      {
        onSuccess: () => {
          setSelectedPass(new Set())
        },
      }
    )
  }

  const handleMoveToPass = () => {
    if (!clubUUID || selectedFail.size === 0) return

    const updates = Array.from(selectedFail).map((uuid) => ({
      aplictUUID: uuid,
      status: 'PASS' as ApplicantStatus,
    }))

    processApplicants.mutate(
      { clubUUID, updates },
      {
        onSuccess: () => {
          setSelectedFail(new Set())
        },
      }
    )
  }

  const handleSendPassNotification = () => {
    if (!clubUUID || passedApplicants.length === 0) return

    const aplictUUIDs = passedApplicants.map((a) => ({ aplictUUID: a.aplictUUID }))
    sendNotifications.mutate({ clubUUID, aplictUUIDs })
  }

  const handleSendFailNotification = () => {
    if (!clubUUID || failedApplicants.length === 0) return

    const aplictUUIDs = failedApplicants.map((a) => ({ aplictUUID: a.aplictUUID }))
    sendNotifications.mutate({ clubUUID, aplictUUIDs })
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
          <h1 className="text-2xl font-bold">합격자 확정</h1>
          <p className="text-muted-foreground">합격자와 불합격자를 최종 확정하고 알림을 보내세요</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
          <h1 className="text-2xl font-bold">합격자 확정</h1>
          <p className="text-muted-foreground">합격자와 불합격자를 최종 확정하고 알림을 보내세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">지원자를 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderApplicantList = (
    list: Applicant[],
    selectedSet: Set<string>,
    status: ApplicantStatus,
    emptyMessage: string
  ) => {
    if (list.length === 0) {
      return <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
    }

    return (
      <Accordion className="space-y-2">
        {list.map((applicant) => (
          <AccordionItem
            key={applicant.aplictUUID}
            value={applicant.aplictUUID}
            className={`border rounded-lg px-3 cursor-pointer transition-colors ${
              selectedSet.has(applicant.aplictUUID)
                ? status === 'PASS'
                  ? 'bg-green-50 border-green-300 dark:bg-green-950'
                  : 'bg-red-50 border-red-300 dark:bg-red-950'
                : ''
            }`}
          >
            <div className="flex items-center gap-2 py-3">
              <Checkbox
                checked={selectedSet.has(applicant.aplictUUID)}
                onCheckedChange={() => handleToggleSelect(applicant.aplictUUID, status)}
                onClick={(e) => e.stopPropagation()}
              />
              <AccordionTrigger className="hover:no-underline flex-1 py-0">
                <div className="flex flex-1 items-center justify-between text-left">
                  <div>
                    <p className="font-medium">{applicant.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.studentNumber} | {applicant.major}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <ApplicantDetailContent clubUUID={clubUUID} applicant={applicant} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">합격자 확정</h1>
        <p className="text-muted-foreground">
          합격자와 불합격자를 최종 확정하고 알림을 보내세요
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  합격자
                  <Badge className="bg-green-500">{passedApplicants.length}명</Badge>
                </CardTitle>
                <CardDescription>합격 처리된 지원자 목록</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedPass.size === 0 || processApplicants.isPending}
                onClick={handleMoveToFail}
              >
                불합격으로 이동
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              {renderApplicantList(passedApplicants, selectedPass, 'PASS', '합격자가 없습니다')}
            </div>

            <Separator className="my-4" />

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={passedApplicants.length === 0 || sendNotifications.isPending}
              onClick={handleSendPassNotification}
            >
              <HugeiconsIcon icon={Notification01Icon} className="mr-2" />
              합격 알림 보내기 ({passedApplicants.length}명)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  불합격자
                  <Badge variant="destructive">{failedApplicants.length}명</Badge>
                </CardTitle>
                <CardDescription>불합격 처리된 지원자 목록</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedFail.size === 0 || processApplicants.isPending}
                onClick={handleMoveToPass}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1" />
                합격으로 이동
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              {renderApplicantList(failedApplicants, selectedFail, 'FAIL', '불합격자가 없습니다')}
            </div>

            <Separator className="my-4" />

            <Button
              variant="destructive"
              className="w-full"
              disabled={failedApplicants.length === 0 || sendNotifications.isPending}
              onClick={handleSendFailNotification}
            >
              <HugeiconsIcon icon={Notification01Icon} className="mr-2" />
              불합격 알림 보내기 ({failedApplicants.length}명)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            체크박스로 선택한 후 이동 버튼을 눌러 합격/불합격 상태를 변경할 수 있습니다.
            <br />
            알림 보내기 버튼을 누르면 해당 목록의 모든 지원자에게 결과 알림이 발송됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
