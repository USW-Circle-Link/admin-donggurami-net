import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { BlurFade } from '@/components/ui/blur-fade'
import { Particles } from '@/components/ui/particles'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { Iphone } from '@/components/ui/iphone'
import { Button } from '@/components/ui/button'
import { mobileAppScreen } from '../mock-screens'

// iPhone screen area percentages (from iphone.tsx constants)
const IPHONE_SCREEN = {
  left: (21.25 / 433) * 100,
  top: (19.25 / 882) * 100,
  width: (389.5 / 433) * 100,
  height: (843.5 / 882) * 100,
  radiusH: (55.75 / 389.5) * 100,
  radiusV: (55.75 / 843.5) * 100,
}

export function HeroSection() {
  const [iframeError, setIframeError] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Timeout fallback: if iframe doesn't fire onLoad within 5s, show static mock
  useEffect(() => {
    if (iframeLoaded || iframeError) return
    const timer = setTimeout(() => setIframeError(true), 5000)
    return () => clearTimeout(timer)
  }, [iframeLoaded, iframeError])

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <Particles
        className="absolute inset-0"
        quantity={60}
        staticity={30}
        color="hsl(var(--primary))"
        size={0.5}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <BlurFade delay={0.1}>
              <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 mb-6">
                <AnimatedShinyText className="text-sm">
                  수원대학교 중앙동아리 플랫폼
                </AnimatedShinyText>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                동아리 구하는 사람
                <br />
                <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  모여라!
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="mt-4 text-2xl sm:text-3xl font-[Juache,sans-serif] text-primary">
                미루지 말고 지금, 동구라미
              </p>
            </BlurFade>

            <BlurFade delay={0.4}>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                수원대학교 중앙동아리를 쉽게 찾고, 지원할 수 있는 플랫폼입니다.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <div className="mt-8 flex flex-row gap-3 justify-center lg:justify-start">
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
            </BlurFade>
          </div>

          {/* Device mockup */}
          <BlurFade delay={0.6} className="flex justify-center lg:justify-end">
            <div className="relative">
              {iframeError ? (
                <Iphone
                  className="w-[200px] sm:w-[300px]"
                  src={mobileAppScreen}
                />
              ) : (
                <div
                  className="relative w-[200px] sm:w-[300px]"
                  style={{ aspectRatio: '433/882' }}
                >
                  {/* iframe clipping container */}
                  <div
                    className="absolute overflow-hidden bg-white"
                    style={{
                      left: `${IPHONE_SCREEN.left}%`,
                      top: `${IPHONE_SCREEN.top}%`,
                      width: `${IPHONE_SCREEN.width}%`,
                      height: `${IPHONE_SCREEN.height}%`,
                      borderRadius: `${IPHONE_SCREEN.radiusH}% / ${IPHONE_SCREEN.radiusV}%`,
                    }}
                  >
                    <iframe
                      src="https://donggurami.net"
                      title="동구라미"
                      className="absolute border-0 bg-white origin-top-left w-[250%] h-[235%] scale-[0.4] sm:w-[150%] sm:h-[141%] sm:scale-[0.667]"
                      style={{ top: '6%', left: 0 }}
                      loading="lazy"
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                    />
                    {/* Status bar overlay - covers dynamic island area */}
                    <div
                      className="absolute top-0 left-0 w-full bg-white z-10"
                      style={{ height: '6%' }}
                    />
                  </div>
                  {/* SVG frame on top */}
                  <Iphone className="relative z-10 w-full pointer-events-none" transparent />
                </div>
              )}
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-[3rem] blur-2xl -z-10" />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
