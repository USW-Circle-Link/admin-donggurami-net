import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationQuestion } from '@/data/dummyData'

interface ApplicationPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questions: ApplicationQuestion[]
  clubName: string
}

export function ApplicationPreviewModal({
  open,
  onOpenChange,
  questions,
  clubName,
}: ApplicationPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clubName} 지원서 미리보기</DialogTitle>
          <DialogDescription>
            실제 지원자가 보게 될 지원서 양식입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {questions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              등록된 질문이 없습니다.
            </p>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  Q{index + 1}. {q.question}
                  {q.required && <span className="text-destructive">*</span>}
                </Label>

                {q.type === 'text' && (
                  <div className="space-y-1">
                    <Textarea
                      placeholder="답변을 입력하세요..."
                      maxLength={q.maxLength}
                      disabled
                      className="resize-none"
                      rows={4}
                    />
                    {q.maxLength && (
                      <p className="text-xs text-muted-foreground text-right">
                        0 / {q.maxLength}자
                      </p>
                    )}
                  </div>
                )}

                {q.type === 'radio' && q.options && (
                  <div className="space-y-2 pl-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          disabled
                          className="size-4"
                        />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && q.options && (
                  <div className="space-y-2 pl-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox disabled />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'dropdown' && q.options && (
                  <Select disabled>
                    <SelectTrigger className="w-full">
                      <SelectValue>선택하세요</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt, i) => (
                        <SelectItem key={i} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
