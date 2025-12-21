import { useState } from 'react'
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
import { dummyApplicants, type ApplicantWithStatus } from '@/data/dummyData'
import type { ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'

export function ApplicationReviewPage() {
  const [applicants, setApplicants] = useState<ApplicantWithStatus[]>(dummyApplicants)

  const handleStatusChange = (uuid: string, status: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.aplictUUID === uuid ? { ...a, aplictStatus: status } : a))
    )
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

  const waitingApplicants = applicants.filter((a) => a.aplictStatus === 'WAIT')
  const reviewedApplicants = applicants.filter((a) => a.aplictStatus !== 'WAIT')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">지원서 검토</h1>
        <p className="text-muted-foreground">
          총 {applicants.length}명 중 {waitingApplicants.length}명 검토 대기
        </p>
      </div>

      {/* 검토 대기 중인 지원서 */}
      <Card>
        <CardHeader>
          <CardTitle>검토 대기</CardTitle>
          <CardDescription>{waitingApplicants.length}명의 지원서가 검토를 기다리고 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {waitingApplicants.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">검토 대기 중인 지원서가 없습니다</p>
          ) : (
            <Accordion className="space-y-2">
              {waitingApplicants.map((applicant) => (
                <AccordionItem
                  key={applicant.aplictUUID}
                  value={applicant.aplictUUID}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="font-medium">{applicant.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {applicant.studentNumber} | {applicant.major}
                        </p>
                      </div>
                      {getStatusBadge(applicant.aplictStatus)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
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
                      </div>

                      <Separator />

                      {/* 지원서 답변 */}
                      <div className="space-y-3">
                        {applicant.answers.map((item, index) => (
                          <div key={index} className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Q{index + 1}. {item.question}
                            </p>
                            <p className="text-sm bg-muted/50 rounded-lg p-3">{item.answer}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* 합격/불합격 버튼 */}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleStatusChange(applicant.aplictUUID, 'FAIL')}
                        >
                          불합격
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(applicant.aplictUUID, 'PASS')}
                        >
                          합격
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* 검토 완료된 지원서 */}
      {reviewedApplicants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>검토 완료</CardTitle>
            <CardDescription>{reviewedApplicants.length}명의 지원서가 검토되었습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="space-y-2">
              {reviewedApplicants.map((applicant) => (
                <AccordionItem
                  key={applicant.aplictUUID}
                  value={applicant.aplictUUID}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="font-medium">{applicant.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {applicant.studentNumber} | {applicant.major}
                        </p>
                      </div>
                      {getStatusBadge(applicant.aplictStatus)}
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

                      <div className="space-y-3">
                        {applicant.answers.map((item, index) => (
                          <div key={index} className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Q{index + 1}. {item.question}
                            </p>
                            <p className="text-sm bg-muted/50 rounded-lg p-3">{item.answer}</p>
                          </div>
                        ))}
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
                        {applicant.aplictStatus === 'PASS' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleStatusChange(applicant.aplictUUID, 'FAIL')}
                          >
                            불합격으로 변경
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(applicant.aplictUUID, 'PASS')}
                          >
                            합격으로 변경
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
