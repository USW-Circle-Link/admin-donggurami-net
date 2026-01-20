import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete01Icon, Add01Icon, ArrowUp01Icon, ArrowDown01Icon, DragDropVerticalIcon } from '@hugeicons/core-free-icons'
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
import { ApplicationPreviewModal } from './components/ApplicationPreviewModal'

interface SortableQuestionItemProps {
  question: ApplicationQuestion
  index: number
  totalCount: number
  onRemove: (id: number) => void
  onToggleRequired: (id: number) => void
  onMoveUp: (id: number) => void
  onMoveDown: (id: number) => void
  getQuestionTypeLabel: (type: QuestionType) => string
}

function SortableQuestionItem({
  question,
  index,
  totalCount,
  onRemove,
  onToggleRequired,
  onMoveUp,
  onMoveDown,
  getQuestionTypeLabel,
}: SortableQuestionItemProps) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-start gap-3 rounded-lg border p-4 bg-card select-none"
    >
      {/* 드래그 핸들 */}
      <div
        className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center py-2"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} className="size-5 text-muted-foreground" />
      </div>
      {/* 위/아래 버튼 */}
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={index === 0}
          onClick={() => onMoveUp(question.id)}
        >
          <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={index === totalCount - 1}
          onClick={() => onMoveDown(question.id)}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">Q{index + 1}.</span>
              <Badge variant="outline" className="text-xs">
                {getQuestionTypeLabel(question.type)}
              </Badge>
            </div>
            <p className="text-sm font-medium">{question.question}</p>
            {question.options && (
              <div className="mt-2 flex flex-wrap gap-1">
                {question.options.map((opt, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {opt}
                  </Badge>
                ))}
              </div>
            )}
            {question.type === 'text' && question.maxLength && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  최대 {question.maxLength}자
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={`required-${question.id}`} className="text-xs text-muted-foreground">
            필수
          </Label>
          <Switch
            id={`required-${question.id}`}
            checked={question.required}
            onCheckedChange={() => onToggleRequired(question.id)}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(question.id)}
        >
          <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
        </Button>
      </div>
    </Reorder.Item>
  )
}

interface QuestionPreset {
  label: string
  question: string
  type: QuestionType
  options?: string[]
  maxLength?: number
}

const QUESTION_PRESETS: QuestionPreset[] = [
  {
    label: '지원동기',
    question: '지원 동기를 작성해주세요.',
    type: 'text',
    maxLength: 500,
  },
  {
    label: '자기소개',
    question: '간단한 자기소개를 해주세요.',
    type: 'text',
    maxLength: 300,
  },
  {
    label: '성별',
    question: '성별을 선택해주세요.',
    type: 'radio',
    options: ['남성', '여성', '기타'],
  },
  {
    label: '학년',
    question: '현재 학년을 선택해주세요.',
    type: 'dropdown',
    options: ['1학년', '2학년', '3학년', '4학년'],
  },
]

export function RecruitmentEditPage() {
  const [isRecruiting, setIsRecruiting] = useState(dummyClubSummary.recruitmentStatus === 'OPEN')
  const [recruitmentContent, setRecruitmentContent] = useState(dummyClubSummary.clubRecruitment || '')
  const [questions, setQuestions] = useState<ApplicationQuestion[]>(dummyApplicationQuestions)
  const [newQuestion, setNewQuestion] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('text')
  const [newOptions, setNewOptions] = useState('')
  const [newMaxLength, setNewMaxLength] = useState(300)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePresetSelect = (preset: QuestionPreset) => {
    setNewQuestion(preset.question)
    setNewQuestionType(preset.type)
    setNewOptions(preset.options?.join(', ') || '')
    setNewMaxLength(preset.maxLength || 300)
  }

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
          maxLength: newQuestionType === 'text' ? newMaxLength : undefined,
        },
      ])
      setNewQuestion('')
      setNewOptions('')
      setNewQuestionType('text')
      setNewMaxLength(300)
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

  const handleMoveUp = (id: number) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id)
      if (index <= 0) return prev
      const newQuestions = [...prev]
      ;[newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]]
      return newQuestions
    })
  }

  const handleMoveDown = (id: number) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id)
      if (index >= prev.length - 1) return prev
      const newQuestions = [...prev]
      ;[newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]]
      return newQuestions
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('모집 정보가 저장되었습니다.')
  }

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'text':
        return '서술형'
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
                <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-3">
                  {questions.map((q, index) => (
                    <SortableQuestionItem
                      key={q.id}
                      question={q}
                      index={index}
                      totalCount={questions.length}
                      onRemove={handleRemoveQuestion}
                      onToggleRequired={handleToggleRequired}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      getQuestionTypeLabel={getQuestionTypeLabel}
                    />
                  ))}
                </Reorder.Group>
              </div>

              <Separator />

              {/* 새 질문 추가 */}
              <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                <h4 className="text-sm font-medium">새 질문 추가</h4>

                {/* 퀵 버튼 */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">빠른 추가</p>
                  <div className="flex flex-wrap gap-2">
                    {QUESTION_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">질문 유형</Label>
                      <Select value={newQuestionType} onValueChange={(value) => setNewQuestionType(value as QuestionType)}>
                        <SelectTrigger id="questionType">
                          <SelectValue>
                            {getQuestionTypeLabel(newQuestionType)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">{getQuestionTypeLabel('text')}</SelectItem>
                          <SelectItem value="radio">{getQuestionTypeLabel('radio')}</SelectItem>
                          <SelectItem value="checkbox">{getQuestionTypeLabel('checkbox')}</SelectItem>
                          <SelectItem value="dropdown">{getQuestionTypeLabel('dropdown')}</SelectItem>
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

                  {newQuestionType === 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor="maxLength">최대 글자수</Label>
                      <Input
                        id="maxLength"
                        type="number"
                        value={newMaxLength}
                        onChange={(e) => setNewMaxLength(Number(e.target.value) || 300)}
                        placeholder="300"
                        min={50}
                        max={3000}
                      />
                      <p className="text-xs text-muted-foreground">
                        기본값: 300자 (최소 50자, 최대 3000자)
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
        {isRecruiting && (
          <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
            미리보기
          </Button>
        )}
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>

      {/* 미리보기 모달 */}
      <ApplicationPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        questions={questions}
        clubName={dummyClubSummary.clubName}
      />
    </div>
  )
}
