import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { dummyApplicants, type ApplicantWithStatus } from '@/data/dummyData'
import type { ApplicantStatus } from '@features/club-leader/domain/clubLeaderSchemas'
import { motion, useMotionValue, useTransform, type PanInfo, useAnimation } from 'framer-motion'

interface SwipeableApplicantRowProps {
  applicant: ApplicantWithStatus
  onStatusChange: (uuid: string, status: ApplicantStatus) => void
  getStatusBadge: (status: ApplicantStatus) => React.ReactNode
}

function SwipeableApplicantRow({ applicant, onStatusChange, getStatusBadge }: SwipeableApplicantRowProps) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  
  // Transform x to background opacity or color
  const bgOpacityLeft = useTransform(x, [0, 200], [0, 1]) // Reveal Left (Reject) when moving Right
  const bgOpacityRight = useTransform(x, [-200, 0], [1, 0]) // Reveal Right (Approve) when moving Left

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = 200
    const velocityThreshold = 800
    
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swiped Right -> Fail
      onStatusChange(applicant.aplictUUID, 'FAIL')
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swiped Left -> Pass
      onStatusChange(applicant.aplictUUID, 'PASS')
    }
    
    // Always snap back
    controls.start({ x: 0 })
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background Indicators */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
        {/* Left Side (Revealed when dragging Right -> Reject) */}
        <motion.div 
          style={{ opacity: bgOpacityLeft }}
          className="absolute inset-0 bg-red-100 dark:bg-red-950 flex items-center justify-start px-6"
        >
          <span className="font-bold text-red-600">불합격</span>
        </motion.div>

        {/* Right Side (Revealed when dragging Left -> Approve) */}
        <motion.div 
          style={{ opacity: bgOpacityRight }}
          className="absolute inset-0 bg-green-100 dark:bg-green-950 flex items-center justify-end px-6"
        >
          <span className="font-bold text-green-600">합격</span>
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5} // Increased elasticity (decreased tension)
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, touchAction: 'pan-y' }}
        className="bg-background relative z-10"
      >
        <AccordionItem
          value={applicant.aplictUUID}
          className="border rounded-lg px-4 bg-background" // Ensure bg-background to cover indicators
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
                {getStatusBadge(applicant.aplictStatus)}
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent>
            <div className="space-y-4 pb-4 select-text cursor-auto" onPointerDownCapture={e => e.stopPropagation()}>
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
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(applicant.aplictUUID, 'FAIL')
                  }}
                >
                  불합격
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
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
      </motion.div>
    </div>
  )
}

export function ApplicationReviewPage() {
  const [applicants, setApplicants] = useState<ApplicantWithStatus[]>(dummyApplicants)
  const [waitingOpen, setWaitingOpen] = useState(true)
  const [passedOpen, setPassedOpen] = useState(false)
  const [failedOpen, setFailedOpen] = useState(false)

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
  const passedApplicants = applicants.filter((a) => a.aplictStatus === 'PASS')
  const failedApplicants = applicants.filter((a) => a.aplictStatus === 'FAIL')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">지원서 검토</h1>
        <p className="text-muted-foreground">
          총 {applicants.length}명 중 {waitingApplicants.length}명 검토 대기
        </p>
      </div>

      {/* 검토 대기 중인 지원서 */}
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

      {/* 합격 섹션 */}
      <Collapsible open={passedOpen} onOpenChange={setPassedOpen}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle className="flex items-center gap-2">
                    합격
                    <Badge className="bg-green-500">{passedApplicants.length}명</Badge>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
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

      {/* 불합격 섹션 */}
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
                            <Button
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
