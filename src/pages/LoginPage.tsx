import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function LoginPage() {
  const navigate = useNavigate()
  const [clubAccount, setClubAccount] = useState('')
  const [clubPassword, setClubPassword] = useState('')
  const [unionAccount, setUnionAccount] = useState('')
  const [unionPassword, setUnionPassword] = useState('')

  const handleClubLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 동아리 관리자 로그인 → 동아리 대시보드로 이동
    navigate('/dashboard')
  }

  const handleUnionLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 동아리 연합회 로그인 → 연합회 대시보드로 이동
    navigate('/union/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl" style={{ fontFamily: 'Juache, sans-serif', color: '#FFC01D' }}>
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
                <div className="space-y-2">
                  <Label htmlFor="clubAccount">아이디</Label>
                  <Input
                    id="clubAccount"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={clubAccount}
                    onChange={(e) => setClubAccount(e.target.value)}
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
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="union">
              <form onSubmit={handleUnionLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unionAccount">아이디</Label>
                  <Input
                    id="unionAccount"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={unionAccount}
                    onChange={(e) => setUnionAccount(e.target.value)}
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
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
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
