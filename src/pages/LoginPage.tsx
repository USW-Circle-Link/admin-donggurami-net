import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/features/auth/hooks/useLogin'

export function LoginPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { mutate: login, isPending } = useLogin()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!account.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    login(
      { account, password },
      {
        onSuccess: (response) => {
          const { role } = response.data
          if (role === 'ADMIN') {
            navigate('/union/dashboard')
          } else if (role === 'LEADER') {
            navigate('/club/dashboard')
          } else {
            navigate('/club/dashboard')
          }
        },
        onError: (err) => {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.')
          console.error('Login failed:', err)
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-[Juache,sans-serif] text-[hsl(var(--primary))]">
            동구라미
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            동아리 관리 시스템
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="account">아이디</Label>
              <Input
                id="account"
                type="text"
                placeholder="아이디를 입력하세요"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
            <a href="/privacy" className="hover:underline">
              개인정보처리방침
            </a>
            <span>|</span>
            <a href="/terms" className="hover:underline">
              이용약관
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
