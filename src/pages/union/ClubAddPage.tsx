import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, ViewOffIcon, CheckmarkCircle01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClubRequestSchema, type Department } from '@/features/admin/domain/adminSchemas'
import {
  useCheckLeaderAccount,
  useCheckClubName,
  useCreateClub,
} from '@/features/admin/hooks/useAdmin'

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: '학술', label: '학술' },
  { value: '체육', label: '체육' },
  { value: '문화예술', label: '문화예술' },
  { value: '종교', label: '종교' },
  { value: '사회봉사', label: '사회봉사' },
]

interface FormData {
  leaderAccount: string
  leaderPw: string
  leaderPwConfirm: string
  clubName: string
  department: Department | ''
  adminPw: string
  clubRoomNumber: string
}

interface ValidationState {
  leaderAccount: 'idle' | 'checking' | 'valid' | 'invalid'
  clubName: 'idle' | 'checking' | 'valid' | 'invalid'
}

export function ClubAddPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    leaderAccount: '',
    leaderPw: '',
    leaderPwConfirm: '',
    clubName: '',
    department: '',
    adminPw: '',
    clubRoomNumber: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validation, setValidation] = useState<ValidationState>({
    leaderAccount: 'idle',
    clubName: 'idle',
  })

  const { mutate: checkLeaderAccount, isPending: isCheckingAccount } = useCheckLeaderAccount()
  const { mutate: checkClubName, isPending: isCheckingName } = useCheckClubName()
  const { mutate: createClub, isPending: isCreating } = useCreateClub()

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    // Reset validation state when user modifies the field
    if (field === 'leaderAccount') {
      setValidation((prev) => ({ ...prev, leaderAccount: 'idle' }))
    }
    if (field === 'clubName') {
      setValidation((prev) => ({ ...prev, clubName: 'idle' }))
    }
  }

  const handleCheckLeaderAccount = () => {
    if (!formData.leaderAccount) {
      setErrors((prev) => ({ ...prev, leaderAccount: '아이디를 입력해주세요.' }))
      return
    }
    setValidation((prev) => ({ ...prev, leaderAccount: 'checking' }))
    checkLeaderAccount(formData.leaderAccount, {
      onSuccess: () => {
        setValidation((prev) => ({ ...prev, leaderAccount: 'valid' }))
      },
      onError: () => {
        setValidation((prev) => ({ ...prev, leaderAccount: 'invalid' }))
        setErrors((prev) => ({ ...prev, leaderAccount: '이미 사용중인 아이디입니다.' }))
      },
    })
  }

  const handleCheckClubName = () => {
    if (!formData.clubName) {
      setErrors((prev) => ({ ...prev, clubName: '동아리명을 입력해주세요.' }))
      return
    }
    setValidation((prev) => ({ ...prev, clubName: 'checking' }))
    checkClubName(formData.clubName, {
      onSuccess: () => {
        setValidation((prev) => ({ ...prev, clubName: 'valid' }))
      },
      onError: () => {
        setValidation((prev) => ({ ...prev, clubName: 'invalid' }))
        setErrors((prev) => ({ ...prev, clubName: '이미 사용중인 동아리명입니다.' }))
      },
    })
  }

  const handleSubmit = () => {
    // Validate form data using Zod schema
    const result = createClubRequestSchema.safeParse({
      ...formData,
      department: formData.department || undefined,
    })

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        newErrors[field] = issue.message
      })
      setErrors(newErrors)
      return
    }

    // Check if validations passed
    if (validation.leaderAccount !== 'valid') {
      setErrors((prev) => ({ ...prev, leaderAccount: '아이디 중복 확인을 해주세요.' }))
      return
    }
    if (validation.clubName !== 'valid') {
      setErrors((prev) => ({ ...prev, clubName: '동아리명 중복 확인을 해주세요.' }))
      return
    }

    createClub(result.data, {
      onSuccess: () => {
        toast.success('동아리가 성공적으로 추가되었습니다.')
        navigate('/union/dashboard')
      },
      onError: () => {
        toast.error('동아리 추가에 실패했습니다.')
      },
    })
  }

  const getValidationIcon = (state: 'idle' | 'checking' | 'valid' | 'invalid') => {
    switch (state) {
      case 'checking':
        return <span className="text-muted-foreground text-sm">확인 중...</span>
      case 'valid':
        return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5 text-green-600" />
      case 'invalid':
        return <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-destructive" />
      default:
        return null
    }
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">동아리 추가</h1>
        <p className="text-muted-foreground">새로운 동아리를 등록합니다</p>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>동아리 회장 계정</CardTitle>
            <CardDescription>동아리 회장이 사용할 계정 정보를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 아이디 */}
            <div className="space-y-2">
              <Label htmlFor="leaderAccount">아이디</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="leaderAccount"
                    placeholder="5-20자, 영문/숫자"
                    value={formData.leaderAccount}
                    onChange={(e) => handleChange('leaderAccount', e.target.value)}
                    className={errors.leaderAccount ? 'border-destructive' : ''}
                    autoComplete="username"
                    disabled={isCreating}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCheckLeaderAccount}
                  disabled={isCheckingAccount || isCreating}
                >
                  중복 확인
                </Button>
                <span className="w-20 flex justify-center">
                  {getValidationIcon(validation.leaderAccount)}
                </span>
              </div>
              {errors.leaderAccount && (
                <p className="text-sm text-destructive">{errors.leaderAccount}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="leaderPw">비밀번호</Label>
              <div className="relative">
                <Input
                  id="leaderPw"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8-20자, 영문/숫자/특수문자 포함"
                  value={formData.leaderPw}
                  onChange={(e) => handleChange('leaderPw', e.target.value)}
                  className={errors.leaderPw ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="new-password"
                  disabled={isCreating}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} className="size-5" />
                </Button>
              </div>
              {errors.leaderPw && <p className="text-sm text-destructive">{errors.leaderPw}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="leaderPwConfirm">비밀번호 확인</Label>
              <div className="relative">
                <Input
                  id="leaderPwConfirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.leaderPwConfirm}
                  onChange={(e) => handleChange('leaderPwConfirm', e.target.value)}
                  className={errors.leaderPwConfirm ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="new-password"
                  disabled={isCreating}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                    className="size-5"
                  />
                </Button>
              </div>
              {errors.leaderPwConfirm && (
                <p className="text-sm text-destructive">{errors.leaderPwConfirm}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>동아리 정보</CardTitle>
            <CardDescription>동아리 기본 정보를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 동아리명 */}
            <div className="space-y-2">
              <Label htmlFor="clubName">동아리명</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="clubName"
                    placeholder="최대 10자"
                    value={formData.clubName}
                    onChange={(e) => handleChange('clubName', e.target.value)}
                    className={errors.clubName ? 'border-destructive' : ''}
                    maxLength={10}
                    disabled={isCreating}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCheckClubName}
                  disabled={isCheckingName || isCreating}
                >
                  중복 확인
                </Button>
                <span className="w-20 flex justify-center">
                  {getValidationIcon(validation.clubName)}
                </span>
              </div>
              {errors.clubName && <p className="text-sm text-destructive">{errors.clubName}</p>}
            </div>

            {/* 분과 */}
            <div className="space-y-2">
              <Label htmlFor="department">분과</Label>
              <Select
                value={formData.department || undefined}
                onValueChange={(value) => handleChange('department', value as Department)}
                disabled={isCreating}
              >
                <SelectTrigger className={`w-full ${errors.department ? 'border-destructive' : ''}`}>
                  <SelectValue>
                    {formData.department
                      ? DEPARTMENTS.find((d) => d.value === formData.department)?.label
                      : '분과를 선택하세요'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
            </div>

            {/* 동아리방 호수 */}
            <div className="space-y-2">
              <Label htmlFor="clubRoomNumber">동아리방 호수</Label>
              <Input
                id="clubRoomNumber"
                placeholder="예: B101, 201"
                value={formData.clubRoomNumber}
                onChange={(e) => handleChange('clubRoomNumber', e.target.value)}
                className={errors.clubRoomNumber ? 'border-destructive' : ''}
                disabled={isCreating}
              />
              {errors.clubRoomNumber && (
                <p className="text-sm text-destructive">{errors.clubRoomNumber}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>관리자 인증</CardTitle>
            <CardDescription>동아리 추가를 위해 관리자 비밀번호를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="adminPw">관리자 비밀번호</Label>
              <div className="relative">
                <Input
                  id="adminPw"
                  type={showAdminPassword ? 'text' : 'password'}
                  placeholder="관리자 비밀번호를 입력하세요"
                  value={formData.adminPw}
                  onChange={(e) => handleChange('adminPw', e.target.value)}
                  className={errors.adminPw ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="off"
                  disabled={isCreating}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                >
                  <HugeiconsIcon
                    icon={showAdminPassword ? ViewOffIcon : ViewIcon}
                    className="size-5"
                  />
                </Button>
              </div>
              {errors.adminPw && <p className="text-sm text-destructive">{errors.adminPw}</p>}
            </div>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/union/dashboard')} disabled={isCreating}>
            취소
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? '추가 중...' : '동아리 추가'}
          </Button>
        </div>
      </form>
    </div>
  )
}
