import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ArrowLeft01Icon, Notification01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { dummyApplicants } from '@/data/dummyData'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useFailedApplicants, useProcessFailedApplicants } from '@/features/club-leader/hooks/useClubLeader'
import type { ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'

export function FinalizePage() {
  const { clubUUID } = useAuthStore()
  const { isLoading, error } = useFailedApplicants(clubUUID || '')
  const { mutate: processFailedApplicants } = useProcessFailedApplicants()

  const failedApplicants = dummyApplicants.filter((a) => a.aplictStatus !== 'WAIT')
  const [selectedPass, setSelectedPass] = useState<Set<string>>(new Set())
  const [selectedFail, setSelectedFail] = useState<Set<string>>(new Set())

  const passedApplicants = failedApplicants.filter((a) => a.aplictStatus === 'PASS')
  const failedApplicantsList = failedApplicants.filter((a) => a.aplictStatus === 'FAIL')

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
      aplictStatus: 'FAIL' as ApplicantStatus,
    }))

    processFailedApplicants(
      {
        clubUUID,
        updates,
      },
      {
        onSuccess: () => {
          setSelectedPass(new Set())
          toast.success(`${updates.length}명이 불합격으로 변경되었습니다.`)
        },
        onError: () => {
          toast.error('불합격으로 변경에 실패했습니다.')
        },
      }
    )
  }

  const handleMoveToPass = () => {
    if (!clubUUID || selectedFail.size === 0) return

    const updates = Array.from(selectedFail).map((uuid) => ({
      aplictUUID: uuid,
      aplictStatus: 'PASS' as ApplicantStatus,
    }))

    processFailedApplicants(
      {
        clubUUID,
        updates,
      },
      {
        onSuccess: () => {
          setSelectedFail(new Set())
          toast.success(`${updates.length}명이 합격으로 변경되었습니다.`)
        },
        onError: () => {
          toast.error('합격으로 변경에 실패했습니다.')
        },
      }
    )
  }

  const handleSendPassNotification = () => {
    toast.success(`${passedApplicants.length}명에게 합격 알림을 보냅니다.`)
  }

  const handleSendFailNotification = () => {
    toast.success(`${failedApplicantsList.length}명에게 불합격 알림을 보냅니다.`)
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
                  <Badge variant="success">{passedApplicants.length}명</Badge>
                </CardTitle>
                <CardDescription>합격 처리된 지원자 목록</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedPass.size === 0}
                onClick={handleMoveToFail}
              >
                불합격으로 이동
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {passedApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">합격자가 없습니다</p>
              ) : (
                passedApplicants.map((applicant) => (
                  <div
                    key={applicant.aplictUUID}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedPass.has(applicant.aplictUUID)
                        ? 'bg-green-50 border-green-300 dark:bg-green-950'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleToggleSelect(applicant.aplictUUID, 'PASS')}
                  >
                    <div>
                      <p className="font-medium">{applicant.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {applicant.studentNumber} | {applicant.major}
                      </p>
                    </div>
                    <Checkbox
                      checked={selectedPass.has(applicant.aplictUUID)}
                      onCheckedChange={() => {}}
                    />
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <Button
              variant="success"
              className="w-full"
              disabled={passedApplicants.length === 0}
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
                  <Badge variant="destructive">{failedApplicantsList.length}명</Badge>
                </CardTitle>
                <CardDescription>불합격 처리된 지원자 목록</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedFail.size === 0}
                onClick={handleMoveToPass}
              >
                합격으로 이동
                <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {failedApplicantsList.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">불합격자가 없습니다</p>
              ) : (
                failedApplicantsList.map((applicant) => (
                  <div
                    key={applicant.aplictUUID}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedFail.has(applicant.aplictUUID)
                        ? 'bg-red-50 border-red-300 dark:bg-red-950'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleToggleSelect(applicant.aplictUUID, 'FAIL')}
                  >
                    <div>
                      <p className="font-medium">{applicant.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {applicant.studentNumber} | {applicant.major}
                      </p>
                    </div>
                    <Checkbox
                      checked={selectedFail.has(applicant.aplictUUID)}
                      onCheckedChange={() => {}}
                    />
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <Button
              variant="destructive"
              className="w-full"
              disabled={failedApplicantsList.length === 0}
              onClick={handleSendFailNotification}
            >
              <HugeiconsIcon icon={Notification01Icon} className="mr-2" />
              불합격 알림 보내기 ({failedApplicantsList.length}명)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            카드를 클릭하여 선택한 후, 이동 버튼을 눌러 합격/불합격 상태를 변경할 수 있습니다.
            <br />
            알림 보내기 버튼을 누르면 해당 목록의 모든 지원자에게 결과 알림이 발송됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
