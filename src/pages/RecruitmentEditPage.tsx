import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete01Icon, Add01Icon, DragDropVerticalIcon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { dummyClubSummary, dummyApplicationQuestions } from '@/data/dummyData'

interface Question {
  id: number
  question: string
  required: boolean
}

export function RecruitmentEditPage() {
  const [isRecruiting, setIsRecruiting] = useState(dummyClubSummary.recruitmentStatus === 'OPEN')
  const [recruitmentContent, setRecruitmentContent] = useState(dummyClubSummary.clubRecruitment || '')
  const [googleFormUrl, setGoogleFormUrl] = useState(dummyClubSummary.googleFormUrl || '')
  const [questions, setQuestions] = useState<Question[]>(dummyApplicationQuestions)
  const [newQuestion, setNewQuestion] = useState('')

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prev) => [
        ...prev,
        { id: Date.now(), question: newQuestion.trim(), required: false },
      ])
      setNewQuestion('')
    }
  }

  const handleRemoveQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleToggleRequired = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('모집 정보가 저장되었습니다.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">모집 정보 수정</h1>
        <p className="text-muted-foreground">모집 상태와 지원서 양식을 관리하세요</p>
      </div>

      {/* 모집 상태 토글 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>모집 상태</CardTitle>
              <CardDescription>모집 중 여부를 설정합니다</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isRecruiting ? 'default' : 'secondary'}>
                {isRecruiting ? '모집중' : '모집마감'}
              </Badge>
              <Switch checked={isRecruiting} onCheckedChange={setIsRecruiting} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 모집 중일 때만 표시되는 내용 */}
      {isRecruiting && (
        <>
          {/* 모집 공고 */}
          <Card>
            <CardHeader>
              <CardTitle>모집 공고</CardTitle>
              <CardDescription>지원자들에게 보여질 모집 공고를 작성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recruitmentContent">모집 공고 내용</Label>
                  <Textarea
                    id="recruitmentContent"
                    value={recruitmentContent}
                    onChange={(e) => setRecruitmentContent(e.target.value)}
                    placeholder="모집 공고 내용을 입력하세요"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">최대 3000자까지 입력 가능합니다</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleFormUrl">Google Form URL (선택)</Label>
                  <Input
                    id="googleFormUrl"
                    value={googleFormUrl}
                    onChange={(e) => setGoogleFormUrl(e.target.value)}
                    placeholder="https://forms.google.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    외부 Google Form을 사용하는 경우 URL을 입력하세요
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 지원서 양식 */}
          <Card>
            <CardHeader>
              <CardTitle>지원서 양식</CardTitle>
              <CardDescription>지원서에 포함될 질문들을 구성하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 기본 항목 */}
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">기본 항목 (필수)</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">이름</Badge>
                  <Badge variant="outline">학번</Badge>
                  <Badge variant="outline">학과</Badge>
                  <Badge variant="outline">연락처</Badge>
                </div>
              </div>

              <Separator />

              {/* 추가 질문 목록 */}
              <div className="space-y-3">
                <p className="text-sm font-medium">추가 질문</p>
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      className="text-muted-foreground cursor-grab"
                    />
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <span className="flex-1 text-sm">{q.question}</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`required-${q.id}`} className="text-xs text-muted-foreground">
                        필수
                      </Label>
                      <Switch
                        id={`required-${q.id}`}
                        checked={q.required}
                        onCheckedChange={() => handleToggleRequired(q.id)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveQuestion(q.id)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* 새 질문 추가 */}
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="새 질문을 입력하세요"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                />
                <Button type="button" variant="outline" onClick={handleAddQuestion}>
                  <HugeiconsIcon icon={Add01Icon} className="mr-1" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>
    </div>
  )
}
