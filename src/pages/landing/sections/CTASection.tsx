import { Link } from 'react-router'
import { BlurFade } from '@/components/ui/blur-fade'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ShineBorder } from '@/components/ui/shine-border'
import { RetroGrid } from '@/components/ui/retro-grid'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section id="download" className="relative py-24 sm:py-32 overflow-hidden">
      <RetroGrid className="absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1}>
          <div className="relative mx-auto max-w-3xl rounded-2xl bg-card/80 backdrop-blur-sm p-8 sm:p-12 text-center overflow-hidden">
            <ShineBorder
              shineColor={['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']}
              borderWidth={2}
            />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              수원대학교 동아리 활동, 동구라미와 함께하세요.
              <br className="hidden sm:block" />
              더 쉽고, 더 빠르게.
            </p>

            <div className="flex flex-row gap-3 justify-center">
              <a href="https://donggurami.net" target="_blank" rel="noopener noreferrer">
                <ShimmerButton
                  className="h-12 px-6 sm:px-8 text-base font-medium"
                  shimmerColor="hsl(var(--primary))"
                  background="hsl(var(--primary))"
                >
                  <span className="text-white">동아리 회원</span>
                </ShimmerButton>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-6 sm:px-8 text-base border-border/60 hover:bg-muted/50"
                render={<Link to="/login" />}
              >
                동아리 회장
              </Button>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
