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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { dummyClubSummary, dummyApplicationQuestions, type ApplicationQuestion, type QuestionType } from '@/data/dummyData'

export function RecruitmentEditPage() {
  const [isRecruiting, setIsRecruiting] = useState(dummyClubSummary.recruitmentStatus === 'OPEN')
  const [recruitmentContent, setRecruitmentContent] = useState(dummyClubSummary.clubRecruitment || '')
  const [questions, setQuestions] = useState<ApplicationQuestion[]>(dummyApplicationQuestions)
  const [newQuestion, setNewQuestion] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('text')
  const [newOptions, setNewOptions] = useState('')

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const optionsArray = newQuestionType !== 'text' && newOptions.trim()
        ? newOptions.split(',').map(opt => opt.trim()).filter(Boolean)
        : undefined

      setQuestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: newQuestion.trim(),
          type: newQuestionType,
          required: false,
          options: optionsArray,
        },
      ])
      setNewQuestion('')
      setNewOptions('')
      setNewQuestionType('text')
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

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'text':
        return '텍스트'
      case 'radio':
        return '객관식'
      case 'checkbox':
        return '체크박스'
      case 'dropdown':
        return '드롭다운'
    }
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
              {/* 질문 목록 */}
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      className="text-muted-foreground cursor-grab mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">Q{index + 1}.</span>
                            <Badge variant="outline" className="text-xs">
                              {getQuestionTypeLabel(q.type)}
                            </Badge>
                            {q.required && (
                              <Badge variant="destructive" className="text-xs">
                                필수
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{q.question}</p>
                          {q.options && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {q.options.map((opt, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {opt}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </div>
                ))}
              </div>

              <Separator />

              {/* 새 질문 추가 */}
              <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                <h4 className="text-sm font-medium">새 질문 추가</h4>
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">질문 유형</Label>
                      <Select value={newQuestionType} onValueChange={(value) => setNewQuestionType(value as QuestionType)}>
                        <SelectTrigger id="questionType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">텍스트</SelectItem>
                          <SelectItem value="radio">객관식</SelectItem>
                          <SelectItem value="checkbox">체크박스</SelectItem>
                          <SelectItem value="dropdown">드롭다운</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newQuestion">질문 내용</Label>
                    <Input
                      id="newQuestion"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="질문을 입력하세요"
                    />
                  </div>

                  {newQuestionType !== 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor="options">선택지 (쉼표로 구분)</Label>
                      <Input
                        id="options"
                        value={newOptions}
                        onChange={(e) => setNewOptions(e.target.value)}
                        placeholder="예: 옵션1, 옵션2, 옵션3"
                      />
                      <p className="text-xs text-muted-foreground">
                        쉼표(,)로 구분하여 여러 선택지를 입력하세요
                      </p>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddQuestion}
                    className="w-full"
                  >
                    <HugeiconsIcon icon={Add01Icon} className="mr-1" />
                    질문 추가
                  </Button>
                </div>
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
