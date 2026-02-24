import { BlurFade } from '@/components/ui/blur-fade'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Search, FileEdit, PartyPopper } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Search,
    title: '동아리 탐색',
    description: '카테고리별로 다양한 동아리를 둘러보고, 관심 있는 동아리를 찾아보세요.',
  },
  {
    number: 2,
    icon: FileEdit,
    title: '지원서 작성',
    description: '원하는 동아리에 간단한 지원서를 작성하고 제출하세요.',
  },
  {
    number: 3,
    icon: PartyPopper,
    title: '결과 확인',
    description: '실시간으로 합격 결과를 확인하고, 동아리 활동을 시작하세요.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              간단한 3단계로 시작하세요
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              복잡한 과정 없이, 누구나 쉽게 동아리에 지원할 수 있습니다
            </p>
          </div>
        </BlurFade>

        {/* Desktop: horizontal, Mobile: vertical timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <BlurFade key={step.number} delay={0.2 + index * 0.15}>
              <div className="relative flex flex-col items-center text-center group">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-primary/40 to-primary/10" />
                )}

                {/* Step number circle */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group-hover:bg-primary/15 transition-colors">
                  <span className="text-3xl font-bold text-primary">
                    <NumberTicker value={step.number} />
                  </span>
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 text-muted-foreground mb-4">
                  <step.icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground max-w-xs">{step.description}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
