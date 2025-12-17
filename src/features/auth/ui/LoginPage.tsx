import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Card, Input, Button, Select } from '@shared/ui';

// Using the URL from Figma for the mascot. 
// Ideally, this should be downloaded and stored locally.
const MASCOT_IMAGE_URL = "https://www.figma.com/api/mcp/asset/032efdbf-0d95-423b-bd02-94e1866bf391";

const ROLE_OPTIONS = [
  { label: '동아리 관리자', value: 'admin' },
  { label: '동아리 연합회', value: 'union' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    // Mock login logic to demonstrate error state
    if (username === '' || password === '') {
      setError(true);
    } else {
      setError(false);
      console.log('Logging in...', { username, password, role });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-[46px]">
      {/* Header / Logo Area */}
      <div className="flex flex-col items-center gap-[30px]">
        <div className="text-[#9d9d9d] text-[32px] font-medium font-['Pretendard']">
          수원대학교 동아리 통합 관리 서비스
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-[85px] h-[62px]">
            <img
              src={MASCOT_IMAGE_URL}
              alt="Mascot"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-[#FFC01D] text-[72px] font-['Jua'] leading-[1]">
            동구라미
          </h1>
        </div>
      </div>

      {/* Login Form Card */}
      <Card className="w-[676px] p-[36px]">
        <form onSubmit={handleLogin} className="flex flex-col gap-[30px]">
          <Input
            icon={<User className="w-full h-full" />}
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            containerClassName={error ? "border-[#FF3535]" : ""}
          />

          <div className="relative w-full">
            <Input
              type="password"
              icon={<Lock className="w-full h-full" />}
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              containerClassName={error ? "border-[#FF3535]" : ""}
            />
            {/* Error Message moved here */}
            {error && (
              <div className="text-[#FF3535] text-[16px] font-['Pretendard'] font-light mt-[8px]">
                * 아이디 또는 비밀번호가 일치하지 않아요.
              </div>
            )}
          </div>

          <Select
            options={ROLE_OPTIONS}
            value={role}
            onChange={setRole}
            placeholder="역할 선택"
          />

          <Button type="submit">
            로그인
          </Button>
        </form>
      </Card>
    </div >
  );
}
