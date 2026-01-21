import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { dummyApplicants, type ApplicantWithStatus } from '@/data/dummyData'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useApplicants, useProcessApplicants } from '@/features/club-leader/hooks/useClubLeader'
import type { ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'

interface SwipeableApplicantRowProps {
  applicant: ApplicantWithStatus
  onStatusChange: (uuid: string, status: ApplicantStatus) => void
  getStatusBadge: (status: ApplicantStatus) => React.ReactNode
}

function SwipeableApplicantRow({ applicant, onStatusChange, getStatusBadge }: SwipeableApplicantRowProps) {
  return (
    <AccordionItem
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
            {getStatusBadge('WAIT' as ApplicantStatus)}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-4">
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div>
              <span className="text-muted-foreground">연락처: </span>
              {applicant.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
            </div>
            <div>
              <span className="text-muted-foreground">학번: </span>
              {applicant.studentNumber}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange(applicant.aplictUUID, 'FAIL')
              }}
            >
              불합격
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange(applicant.aplictUUID, 'PASS')
              }}
            >
              합격
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function ApplicationReviewPage() {
  const { clubUUID } = useAuthStore()
  const { data: applicantsData, isLoading, error } = useApplicants(clubUUID || '')
  const { mutate: processApplicants } = useProcessApplicants()

  const applicants = applicantsData?.data || []
  const [localApplicants, setLocalApplicants] = useState<ApplicantWithStatus[]>(dummyApplicants)

  const [waitingOpen, setWaitingOpen] = useState(true)
  const [passedOpen, setPassedOpen] = useState(false)
  const [failedOpen, setFailedOpen] = useState(false)

  const waitingApplicants = useMemo(() => localApplicants.filter((a) => a.aplictStatus === 'WAIT'), [localApplicants])
  const passedApplicants = useMemo(() => localApplicants.filter((a) => a.aplictStatus === 'PASS'), [localApplicants])
  const failedApplicants = useMemo(() => localApplicants.filter((a) => a.aplictStatus === 'FAIL'), [localApplicants])

  const handleStatusChange = (uuid: string, status: ApplicantStatus) => {
    if (!clubUUID) return

    processApplicants(
      {
        clubUUID,
        updates: [{ aplictUUID: uuid, aplictStatus: status }],
      },
      {
        onSuccess: () => {
          setLocalApplicants((prev) =>
            prev.map((a) => (a.aplictUUID === uuid ? { ...a, aplictStatus: status } : a))
          )
          toast.success(`지원자가 ${status === 'PASS' ? '합격' : '불합격'} 처리되었습니다.`)
        },
        onError: () => {
          toast.error('지원자 상태 변경에 실패했습니다.')
        },
      }
    )
  }

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case 'PASS':
        return <Badge variant="success">합격</Badge>
      case 'FAIL':
        return <Badge variant="destructive">불합격</Badge>
      default:
        return <Badge variant="secondary">검토중</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">지원서 검토</h1>
          <p className="text-muted-foreground">지원서를 검토하세요</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
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
          <h1 className="text-2xl font-bold">지원서 검토</h1>
          <p className="text-muted-foreground">지원서를 검토하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">지원서를 불러오는 중 오류가 발생했습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">지원서 검토</h1>
        <p className="text-muted-foreground">
          총 {applicants.length}명 중 {waitingApplicants.length}명 검토 대기
        </p>
      </div>

      <Collapsible open={waitingOpen} onOpenChange={setWaitingOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle className="flex items-center gap-2">
                    검토 대기
                    <Badge variant="secondary">{waitingApplicants.length}명</Badge>
                  </CardTitle>
                  <CardDescription>지원서가 검토를 기다리고 있습니다</CardDescription>
                </div>
                <HugeiconsIcon
                  icon={waitingOpen ? ArrowUp01Icon : ArrowDown01Icon}
                  className="size-5 text-muted-foreground"
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {waitingApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">검토 대기 중인 지원서가 없습니다</p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-green-600">← 합격</span>
                    </span>
                    <span className="text-muted-foreground/50">|</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-red-600">불합격 →</span>
                    </span>
                    <span className="text-muted-foreground/50">(스와이프)</span>
                  </p>
                  <Accordion className="space-y-2">
                    {waitingApplicants.map((applicant) => (
                      <SwipeableApplicantRow
                        key={applicant.aplictUUID}
                        applicant={applicant}
                        onStatusChange={handleStatusChange}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </Accordion>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={passedOpen} onOpenChange={setPassedOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle className="flex items-center gap-2">
                    합격
                    <Badge variant="success">{passedApplicants.length}명</Badge>
                  </CardTitle>
                  <CardDescription>합격 처리된 지원자 목록</CardDescription>
                </div>
                <HugeiconsIcon
                  icon={passedOpen ? ArrowUp01Icon : ArrowDown01Icon}
                  className="size-5 text-muted-foreground"
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {passedApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">합격 처리된 지원자가 없습니다</p>
              ) : (
                <Accordion className="space-y-2">
                  {passedApplicants.map((applicant) => (
                    <AccordionItem
                      key={applicant.aplictUUID}
                      value={applicant.aplictUUID}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-1 items-start justify-between mr-2 text-left">
                          <div>
                            <p className="font-medium">{applicant.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {applicant.studentNumber} | {applicant.major}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pb-4">
                          <div className="grid gap-2 md:grid-cols-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">연락처: </span>
                              {applicant.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                            </div>
                            <div>
                              <span className="text-muted-foreground">학번: </span>
                              {applicant.studentNumber}
                            </div>
                          </div>

                          <Separator />

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.aplictUUID, 'WAIT')}
                            >
                              다시 검토
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.aplictUUID, 'FAIL')}
                            >
                              불합격으로 변경
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible open={failedOpen} onOpenChange={setFailedOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle className="flex items-center gap-2">
                    불합격
                    <Badge variant="destructive">{failedApplicants.length}명</Badge>
                  </CardTitle>
                  <CardDescription>불합격 처리된 지원자 목록</CardDescription>
                </div>
                <HugeiconsIcon
                  icon={failedOpen ? ArrowUp01Icon : ArrowDown01Icon}
                  className="size-5 text-muted-foreground"
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {failedApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">불합격 처리된 지원자가 없습니다</p>
              ) : (
                <Accordion className="space-y-2">
                  {failedApplicants.map((applicant) => (
                    <AccordionItem
                      key={applicant.aplictUUID}
                      value={applicant.aplictUUID}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-1 items-start justify-between mr-2 text-left">
                          <div>
                            <p className="font-medium">{applicant.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {applicant.studentNumber} | {applicant.major}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pb-4">
                          <div className="grid gap-2 md:grid-cols-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">연락처: </span>
                              {applicant.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                            </div>
                            <div>
                              <span className="text-muted-foreground">학번: </span>
                              {applicant.studentNumber}
                            </div>
                          </div>

                          <Separator />

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(applicant.aplictUUID, 'WAIT')}
                            >
                              다시 검토
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(applicant.aplictUUID, 'PASS')}
                            >
                              합격으로 변경
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
