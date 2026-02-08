import { useState, useEffect, useMemo } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApplicationPreviewModal } from './components/ApplicationPreviewModal'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useClubDetail, useToggleRecruitment, useUpdateClubInfo, clubLeaderKeys } from '@/features/club-leader/hooks/useClubLeader'
import { useCreateForm } from '@/features/form-management'
import { useClubForm, clubKeys } from '@/features/club'
import type { CreateFormRequest, QuestionType as ApiQuestionType } from '@/features/form-management/domain/formSchemas'
import { useNavigate } from 'react-router'

type QuestionType = 'text' | 'radio' | 'checkbox' | 'dropdown'

interface ApplicationQuestion {
  id: number
  question: string
  type: QuestionType
  required: boolean
  options?: string[]
  maxLength?: number
  order?: number
}

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
      <div
        className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center py-2"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} className="size-5 text-muted-foreground" />
      </div>
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
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { clubUUID } = useAuthStore()
  const { data: clubInfoData, isLoading, error } = useClubDetail(clubUUID || '')
  const clubInfo = clubInfoData?.data
  const { data: clubFormData } = useClubForm(clubUUID || '')
  const clubForm = clubFormData?.data

  const { mutate: toggleRecruitment, isPending: isToggling } = useToggleRecruitment()
  const { mutateAsync: updateClubInfo, isPending: isUpdatingInfo } = useUpdateClubInfo()

  // Transform API form type to UI question type
  const transformApiQuestionTypeToUi = (apiType: string): QuestionType => {
    switch (apiType) {
      case 'RADIO':
        return 'radio'
      case 'CHECKBOX':
        return 'checkbox'
      case 'DROPDOWN':
        return 'dropdown'
      case 'SHORT_TEXT':
      case 'LONG_TEXT':
        return 'text'
      default:
        return 'text'
    }
  }

  // Transform API form data to UI questions format
  const transformFormToUiQuestions = useMemo(() => {
    if (!clubForm?.questions) return []

    return clubForm.questions.map((q) => ({
      id: q.questionId,
      question: q.content,
      type: transformApiQuestionTypeToUi(q.type),
      required: q.required,
      options: q.options?.map((opt) => opt.content),
      maxLength: q.type === 'SHORT_TEXT' ? 300 : q.type === 'LONG_TEXT' ? 3000 : undefined,
      order: q.sequence,
    }))
  }, [clubForm])

  const initialFormData = useMemo(() => {
    if (clubInfo) {
      return {
        recruitmentStatus: clubInfo.recruitmentStatus || 'CLOSE',
        recruitmentContent: clubInfo.clubRecruitment || '',
        questions: transformFormToUiQuestions,
      }
    }
    return {
      recruitmentStatus: 'CLOSE',
      recruitmentContent: '',
      questions: [],
    }
  }, [clubInfo, transformFormToUiQuestions])

  const [isRecruiting, setIsRecruiting] = useState(initialFormData.recruitmentStatus === 'OPEN')
  const [recruitmentContent, setRecruitmentContent] = useState(initialFormData.recruitmentContent)
  const [questions, setQuestions] = useState<ApplicationQuestion[]>(initialFormData.questions)
  const [newQuestion, setNewQuestion] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('text')
  const [newOptions, setNewOptions] = useState('')
  const [newMaxLength, setNewMaxLength] = useState(300)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (clubInfo) {
      setIsRecruiting(clubInfo.recruitmentStatus === 'OPEN')
      setRecruitmentContent(clubInfo.clubRecruitment || '')
      // Load existing form questions if available
      if (transformFormToUiQuestions.length > 0) {
        setQuestions(transformFormToUiQuestions)
      } else {
        setQuestions([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubUUID, clubInfo, transformFormToUiQuestions])

  const handleRecruitmentToggle = (checked: boolean) => {
    setIsRecruiting(checked)
    if (clubUUID) {
      toggleRecruitment(clubUUID, {
        onSuccess: () => {
          toast.success(`모집이 ${checked ? '시작되었습니다.' : '마감되었습니다.'}`)
        },
        onError: () => {
          toast.error('모집 상태 변경에 실패했습니다.')
          setIsRecruiting(!checked)
        },
      })
    }
  }

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
          order: prev.length + 1,
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
      newQuestions[index - 1].order = index
      newQuestions[index].order = index + 1
      return newQuestions
    })
  }

  const handleMoveDown = (id: number) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id)
      if (index >= prev.length - 1) return prev
      const newQuestions = [...prev]
      ;[newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]]
      newQuestions[index].order = index + 1
      newQuestions[index + 1].order = index
      return newQuestions
    })
  }

  // Transform UI question type to API question type
  const transformQuestionType = (uiType: QuestionType): ApiQuestionType => {
    switch (uiType) {
      case 'text':
        return 'LONG_TEXT'
      case 'radio':
        return 'RADIO'
      case 'checkbox':
        return 'CHECKBOX'
      case 'dropdown':
        return 'DROPDOWN'
      default:
        return 'LONG_TEXT'
    }
  }

  // Transform local questions to API format
  const transformQuestionsToApiFormat = (localQuestions: ApplicationQuestion[]): CreateFormRequest['questions'] => {
    return localQuestions.map((q, index) => ({
      sequence: index + 1,
      type: transformQuestionType(q.type),
      content: q.question,
      required: q.required,
      options: q.options?.map((opt, optIndex) => ({
        sequence: optIndex + 1,
        content: opt,
        value: opt.toUpperCase().replace(/\s+/g, '_'), // Generate value from content
      })),
    }))
  }

  const createFormMutation = useCreateForm(clubUUID || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clubUUID) return

    // Validate questions
    if (questions.length === 0) {
      toast.error('최소 1개 이상의 질문을 추가해주세요.')
      return
    }

    // Validate all questions have content
    const emptyQuestion = questions.find(q => !q.question.trim())
    if (emptyQuestion) {
      toast.error('모든 질문에 내용을 입력해주세요.')
      return
    }

    // Validate select-type questions have options
    const invalidQuestion = questions.find(
      q => (q.type === 'radio' || q.type === 'checkbox' || q.type === 'dropdown') && (!q.options || q.options.length === 0)
    )
    if (invalidQuestion) {
      toast.error('객관식/체크박스/드롭다운 질문은 선택지가 필요합니다.')
      return
    }

    try {
      // Update club info with recruitment content
      await updateClubInfo({
        clubUUID,
        clubInfoRequest: {
          clubRecruitment: recruitmentContent || '',
          recruitmentStatus: isRecruiting ? 'OPEN' : 'CLOSE',
        },
      })

      // Create/update form
      const formRequest: CreateFormRequest = {
        description: recruitmentContent || undefined,
        questions: transformQuestionsToApiFormat(questions),
      }

      await new Promise((resolve, reject) => {
        createFormMutation.mutate(formRequest, {
          onSuccess: () => resolve(undefined),
          onError: (error) => reject(error),
        })
      })

      toast.success('모집 정보가 성공적으로 저장되었습니다.')

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: clubLeaderKeys.detail(clubUUID) })
      queryClient.invalidateQueries({ queryKey: clubKeys.form(clubUUID) })

      // Reset form questions to trigger reload from server
      setQuestions([])
    } catch (error) {
      console.error('Failed to save recruitment info:', error)
      toast.error('모집 정보 저장에 실패했습니다.')
    }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">모집 정보 수정</h1>
          <p className="text-muted-foreground">모집 상태와 지원서 양식을 관리하세요</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !clubInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">모집 정보 수정</h1>
          <p className="text-muted-foreground">모집 상태와 지원서 양식을 관리하세요</p>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error ? '모집 정보를 불러오는 중 오류가 발생했습니다.' : '모집 정보를 찾을 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">모집 정보 수정</h1>
        <p className="text-muted-foreground">모집 상태와 지원서 양식을 관리하세요</p>
      </div>

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
              <Switch
                checked={isRecruiting}
                onCheckedChange={handleRecruitmentToggle}
                disabled={isToggling}
              />
            </div>
          </div>
        </CardHeader>
      </Card>


      {isRecruiting && (
        <>
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
                    disabled={createFormMutation.isPending}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">최대 3000자까지 입력 가능합니다</p>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>지원서 양식</CardTitle>
              <CardDescription>지원서에 포함될 질문들을 구성하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                <h4 className="text-sm font-medium">새 질문 추가</h4>

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

      <div className="flex justify-end gap-2">
        {isRecruiting && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            disabled={createFormMutation.isPending || isUpdatingInfo}
          >
            미리보기
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={createFormMutation.isPending || isUpdatingInfo}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createFormMutation.isPending || isUpdatingInfo || !isRecruiting}
        >
          {(createFormMutation.isPending || isUpdatingInfo) && <Spinner className="mr-2" />}
          {(createFormMutation.isPending || isUpdatingInfo) ? '저장 중...' : '저장'}
        </Button>
      </div>

      <ApplicationPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        questions={questions}
        clubName={clubInfo?.clubName || ''}
      />
    </div>
  )
}
