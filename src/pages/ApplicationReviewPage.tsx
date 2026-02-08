import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useApplicantsByStatus, useProcessApplicants } from '@/features/club-leader/hooks/useClubLeader'
import { useApplicationDetail } from '@/features/application/hooks/useApplication'
import type { ApplicantStatus, Applicant } from '@/features/club-leader/domain/clubLeaderSchemas'

function ApplicantDetailContent({
  clubUUID,
  applicant,
  sectionStatus,
  onStatusChange,
  isProcessing,
}: {
  clubUUID: string
  applicant: Applicant
  sectionStatus: ApplicantStatus
  onStatusChange: (uuid: string, status: ApplicantStatus) => void
  isProcessing: boolean
}) {
  const { data, isLoading, error } = useApplicationDetail(clubUUID, applicant.aplictUUID)

  if (isLoading) {
    return (
      <div className="space-y-4 pb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        지원서를 불러오는데 실패했습니다.
      </div>
    )
  }

  const detail = data.data
  const currentStatus = sectionStatus

  return (
    <div className="space-y-4 pb-4">
      {/* 기본 정보 */}
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

      {/* 지원서 답변 */}
      <div className="space-y-3">
        {detail.qnaList.map((item, index) => (
          <div key={item.questionId} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Q{index + 1}. {item.question}
            </p>
            <p className="text-sm bg-muted/50 rounded-lg p-3">
              {item.answer || '(답변 없음)'}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* 합격/불합격 버튼 */}
      <div className="flex justify-end gap-2">
        {currentStatus === 'WAIT' && (
          <>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => onStatusChange(applicant.aplictUUID, 'FAIL')}
              disabled={isProcessing}
            >
              불합격
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onStatusChange(applicant.aplictUUID, 'PASS')}
              disabled={isProcessing}
            >
              합격
            </Button>
          </>
        )}
        {currentStatus === 'PASS' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(applicant.aplictUUID, 'WAIT')}
              disabled={isProcessing}
            >
              다시 검토
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onStatusChange(applicant.aplictUUID, 'FAIL')}
              disabled={isProcessing}
            >
              불합격으로 변경
            </Button>
          </>
        )}
        {currentStatus === 'FAIL' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(applicant.aplictUUID, 'WAIT')}
              disabled={isProcessing}
            >
              다시 검토
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onStatusChange(applicant.aplictUUID, 'PASS')}
              disabled={isProcessing}
            >
              합격으로 변경
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export function ApplicationReviewPage() {
  const clubUUID = useAuthStore((state) => state.clubUUID)
  // Fetch each status separately since API filters by status parameter
  const { data: waitingData, isLoading: waitingLoading, error: waitingError } = useApplicantsByStatus(clubUUID || '', 'WAIT')
  const { data: passedData, isLoading: passedLoading, error: passedError } = useApplicantsByStatus(clubUUID || '', 'PASS')
  const { data: failedData, isLoading: failedLoading, error: failedError } = useApplicantsByStatus(clubUUID || '', 'FAIL')

  const isLoading = waitingLoading || passedLoading || failedLoading
  const hasError = waitingError || passedError || failedError
  const waitingApplicants = waitingData?.data || []
  const passedApplicants = passedData?.data || []
  const failedApplicants = failedData?.data || []
  const allApplicants = [...waitingApplicants, ...passedApplicants, ...failedApplicants]

  const processApplicants = useProcessApplicants()

  const handleStatusChange = (aplictUUID: string, status: ApplicantStatus) => {
    if (!clubUUID) return
    processApplicants.mutate({
      clubUUID,
      updates: [{ aplictUUID, status }],
    })
  }

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case 'PASS':
        return <Badge className="bg-green-500">합격</Badge>
      case 'FAIL':
        return <Badge variant="destructive">불합격</Badge>
      default:
        return <Badge variant="secondary">검토중</Badge>
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
        <p className="text-destructive">지원자 목록을 불러오는데 실패했습니다.</p>
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

    return (
      <Accordion className="space-y-2">
        {list.map((applicant) => (
          <AccordionItem
            key={applicant.aplictUUID}
            value={applicant.aplictUUID}
            className="border rounded-lg px-4 bg-background"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-1 items-start justify-between mr-2 text-left">
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
            </AccordionTrigger>
            <AccordionContent>
              <ApplicantDetailContent
                clubUUID={clubUUID}
                applicant={applicant}
                sectionStatus={sectionStatus}
                onStatusChange={handleStatusChange}
                isProcessing={processApplicants.isPending}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">지원서 검토</h1>
        <p className="text-muted-foreground">
          총 {allApplicants.length}명 중 {waitingApplicants.length}명 검토 대기
        </p>
      </div>

      {/* 검토 대기 중인 지원서 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            검토 대기
            <Badge variant="secondary">{waitingApplicants.length}명</Badge>
          </CardTitle>
          <CardDescription>지원서가 검토를 기다리고 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplicantList(waitingApplicants, 'WAIT', '검토 대기 중인 지원서가 없습니다')}
        </CardContent>
      </Card>

      {/* 합격 지원서 */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            합격
            <Badge className="bg-green-500">{passedApplicants.length}명</Badge>
          </CardTitle>
          <CardDescription>합격 처리된 지원자입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplicantList(passedApplicants, 'PASS', '합격 처리된 지원자가 없습니다')}
        </CardContent>
      </Card>

      {/* 불합격 지원서 */}
      <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            불합격
            <Badge variant="destructive">{failedApplicants.length}명</Badge>
          </CardTitle>
          <CardDescription>불합격 처리된 지원자입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplicantList(failedApplicants, 'FAIL', '불합격 처리된 지원자가 없습니다')}
        </CardContent>
      </Card>
    </div>
  )
}
