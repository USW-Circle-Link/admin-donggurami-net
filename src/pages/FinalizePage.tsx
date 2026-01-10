import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ArrowLeft01Icon, Notification01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { dummyApplicants, type ApplicantWithStatus } from '@/data/dummyData'
import type { ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'

export function FinalizePage() {
  const [applicants, setApplicants] = useState<ApplicantWithStatus[]>(
    dummyApplicants.filter((a) => a.aplictStatus !== 'WAIT')
  )
  const [selectedPass, setSelectedPass] = useState<Set<string>>(new Set())
  const [selectedFail, setSelectedFail] = useState<Set<string>>(new Set())

  const passedApplicants = applicants.filter((a) => a.aplictStatus === 'PASS')
  const failedApplicants = applicants.filter((a) => a.aplictStatus === 'FAIL')

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
    setApplicants((prev) =>
      prev.map((a) =>
        selectedPass.has(a.aplictUUID) ? { ...a, aplictStatus: 'FAIL' as ApplicantStatus } : a
      )
    )
    setSelectedPass(new Set())
  }

  const handleMoveToPass = () => {
    setApplicants((prev) =>
      prev.map((a) =>
        selectedFail.has(a.aplictUUID) ? { ...a, aplictStatus: 'PASS' as ApplicantStatus } : a
      )
    )
    setSelectedFail(new Set())
  }

  const handleSendPassNotification = () => {
    alert(`${passedApplicants.length}명에게 합격 알림을 보냅니다.`)
  }

  const handleSendFailNotification = () => {
    alert(`${failedApplicants.length}명에게 불합격 알림을 보냅니다.`)
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
        {/* 합격자 목록 */}
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
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={passedApplicants.length === 0}
              onClick={handleSendPassNotification}
            >
              <HugeiconsIcon icon={Notification01Icon} className="mr-2" />
              합격 알림 보내기 ({passedApplicants.length}명)
            </Button>
          </CardContent>
        </Card>

        {/* 불합격자 목록 */}
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
                disabled={selectedFail.size === 0}
                onClick={handleMoveToPass}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1" />
                합격으로 이동
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {failedApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">불합격자가 없습니다</p>
              ) : (
                failedApplicants.map((applicant) => (
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
              disabled={failedApplicants.length === 0}
              onClick={handleSendFailNotification}
            >
              <HugeiconsIcon icon={Notification01Icon} className="mr-2" />
              불합격 알림 보내기 ({failedApplicants.length}명)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 안내 문구 */}
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
