import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { Search, FileText, CheckCircle, LayoutDashboard } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: '모든 동아리를 한 곳에서',
    description: '문화, 스포츠, 학술 등 다양한 분야의 동아리를 한눈에 탐색하세요.',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    icon: FileText,
    title: '간편한 지원 프로세스',
    description: '몇 번의 클릭만으로 원하는 동아리에 간단하게 지원할 수 있습니다.',
    className: 'md:col-span-1',
  },
  {
    icon: CheckCircle,
    title: '지원 현황 및 결과 확인',
    description: '실시간으로 지원 상태와 결과를 확인하세요.',
    className: 'md:col-span-1',
  },
  {
    icon: LayoutDashboard,
    title: '동아리 관리 대시보드',
    description: '동아리 회장을 위한 통합 관리 도구로 효율적으로 동아리를 운영하세요.',
    className: 'md:col-span-2',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              동구라미가 제공하는 기능
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              동아리 탐색부터 지원, 관리까지 모든 과정을 하나의 플랫폼에서
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <BlurFade key={feature.title} delay={0.15 + index * 0.1}>
              <MagicCard
                className={`flex flex-col justify-between p-6 h-full cursor-default ${feature.className}`}
                gradientColor="hsl(var(--primary) / 0.1)"
              >
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
