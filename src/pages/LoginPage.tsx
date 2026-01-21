import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClubLeaderLogin, useAdminLogin } from '@/features/auth/hooks/useLogin'

export function LoginPage() {
  const navigate = useNavigate()
  const [clubAccount, setClubAccount] = useState('')
  const [clubPassword, setClubPassword] = useState('')
  const [unionAccount, setUnionAccount] = useState('')
  const [unionPassword, setUnionPassword] = useState('')
  const [error, setError] = useState('')

  const { mutate: clubLeaderLogin, isPending: isClubLoading } = useClubLeaderLogin()
  const { mutate: adminLogin, isPending: isAdminLoading } = useAdminLogin()

  const handleClubLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!clubAccount.trim() || !clubPassword.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    clubLeaderLogin(
      { leaderAccount: clubAccount, leaderPw: clubPassword },
      {
        onSuccess: () => {
          navigate('/dashboard')
        },
        onError: (err) => {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.')
          console.error('Club leader login failed:', err)
        },
      }
    )
  }

  const handleUnionLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!unionAccount.trim() || !unionPassword.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    adminLogin(
      { adminAccount: unionAccount, adminPw: unionPassword },
      {
        onSuccess: () => {
          navigate('/union/dashboard')
        },
        onError: (err) => {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.')
          console.error('Admin login failed:', err)
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
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="club">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="club" className="flex-1">동아리 관리자</TabsTrigger>
              <TabsTrigger value="union" className="flex-1">동아리 연합회</TabsTrigger>
            </TabsList>

            <TabsContent value="club">
              <form onSubmit={handleClubLogin} className="space-y-4">
                {error && (
                  <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="clubAccount">아이디</Label>
                  <Input
                    id="clubAccount"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={clubAccount}
                    onChange={(e) => setClubAccount(e.target.value)}
                    disabled={isClubLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubPassword">비밀번호</Label>
                  <Input
                    id="clubPassword"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={clubPassword}
                    onChange={(e) => setClubPassword(e.target.value)}
                    disabled={isClubLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isClubLoading}>
                  {isClubLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="union">
              <form onSubmit={handleUnionLogin} className="space-y-4">
                {error && (
                  <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="unionAccount">아이디</Label>
                  <Input
                    id="unionAccount"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={unionAccount}
                    onChange={(e) => setUnionAccount(e.target.value)}
                    disabled={isAdminLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unionPassword">비밀번호</Label>
                  <Input
                    id="unionPassword"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={unionPassword}
                    onChange={(e) => setUnionPassword(e.target.value)}
                    disabled={isAdminLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isAdminLoading}>
                  {isAdminLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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
