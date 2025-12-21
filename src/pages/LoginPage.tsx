import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import logoIcon from '@/assets/icons/logo.png'

export function LoginPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 로그인 API 호출
    // 여기서는 바로 대시보드로 이동
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center">
            <img src={logoIcon} alt="동구라미 로고" className="w-full h-full object-contain" />
          </div> */}
          <CardTitle className="text-3xl" style={{ fontFamily: 'Juache, sans-serif', color: '#FFC01D' }}>
            동구라미
          </CardTitle>
          {/* <CardDescription>동아리 관리 시스템에 로그인하세요</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">아이디</Label>
              <Input
                id="account"
                type="text"
                placeholder="아이디를 입력하세요"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
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
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
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
