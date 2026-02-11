import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useAgreeTerms } from '@/features/club-leader/hooks/useClubLeader'
import { useAuthStore } from '@/features/auth/store/authStore'

const TERMS = [
  {
    id: 'terms-of-service',
    label: '이용약관 동의',
    url: 'https://donggurami.net/assets/assets/html/terms_of_service.html',
    required: true,
  },
  {
    id: 'privacy-policy',
    label: '개인정보처리방침 동의',
    url: 'https://donggurami.net/assets/assets/html/privacy_policy.html',
    required: true,
  },
  {
    id: 'personal-info',
    label: '개인정보 수집 및 이용 동의',
    url: 'https://donggurami.net/assets/assets/html/personal_information_collection_and_usage_agreement.html',
    required: true,
  },
] as const

export function TermsAgreementPage() {
  const navigate = useNavigate()
  const setAgreedTerms = useAuthStore((state) => state.setAgreedTerms)
  const { mutate: agreeTerms, isPending } = useAgreeTerms()

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'terms-of-service': false,
    'privacy-policy': false,
    'personal-info': false,
  })

  const allChecked = TERMS.every((term) => checkedItems[term.id])

  const handleCheckAll = (checked: boolean) => {
    const next: Record<string, boolean> = {}
    for (const term of TERMS) {
      next[term.id] = checked
    }
    setCheckedItems(next)
  }

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = () => {
    if (!allChecked) return

    agreeTerms(undefined, {
      onSuccess: () => {
        setAgreedTerms()
        toast.success('약관에 동의하셨습니다.')
        navigate('/club/dashboard', { replace: true })
      },
      onError: (error) => {
        toast.error('약관 동의 처리에 실패했습니다. 다시 시도해주세요.')
        console.error('Terms agreement failed:', error)
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">약관 동의</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            서비스 이용을 위해 아래 약관에 동의해주세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 전체 동의 */}
          <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/50">
            <Checkbox
              id="check-all"
              checked={allChecked}
              onCheckedChange={(checked) => handleCheckAll(checked === true)}
            />
            <label htmlFor="check-all" className="text-sm font-semibold cursor-pointer select-none">
              전체 동의
            </label>
          </div>

          {/* 개별 약관 */}
          <div className="space-y-3">
            {TERMS.map((term) => (
              <div key={term.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={term.id}
                    checked={checkedItems[term.id]}
                    onCheckedChange={(checked) => handleCheck(term.id, checked === true)}
                  />
                  <label htmlFor={term.id} className="text-sm cursor-pointer select-none">
                    {term.required && <span className="text-destructive mr-1">[필수]</span>}
                    {term.label}
                  </label>
                </div>
                <a
                  href={term.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground underline hover:text-foreground transition-colors flex-shrink-0"
                >
                  보기
                </a>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!allChecked || isPending}
            className="w-full"
          >
            {isPending ? '처리 중...' : '동의하고 시작하기'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
