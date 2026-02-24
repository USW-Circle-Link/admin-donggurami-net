import { useState, useEffect } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { Safari } from '@/components/ui/safari'
import { Iphone } from '@/components/ui/iphone'
import { dashboardScreen, mobilePreviewScreen } from '../mock-screens'

// iPhone screen area percentages (from iphone.tsx constants)
const IPHONE_SCREEN = {
  left: (21.25 / 433) * 100,
  top: (19.25 / 882) * 100,
  width: (389.5 / 433) * 100,
  height: (843.5 / 882) * 100,
  radiusH: (55.75 / 389.5) * 100,
  radiusV: (55.75 / 843.5) * 100,
}

// Safari screen area percentages (from safari.tsx constants)
const SAFARI_SCREEN = {
  left: (1 / 1203) * 100,
  top: (52 / 753) * 100,
  width: (1200 / 1203) * 100,
  height: (700 / 753) * 100,
}

export function AppPreviewSection() {
  const [safariIframeError, setSafariIframeError] = useState(false)
  const [safariLoaded, setSafariLoaded] = useState(false)
  const [iphoneIframeError, setIphoneIframeError] = useState(false)
  const [iphoneLoaded, setIphoneLoaded] = useState(false)

  // Timeout fallback for Safari iframe
  useEffect(() => {
    if (safariLoaded || safariIframeError) return
    const timer = setTimeout(() => setSafariIframeError(true), 5000)
    return () => clearTimeout(timer)
  }, [safariLoaded, safariIframeError])

  // Timeout fallback for iPhone iframe
  useEffect(() => {
    if (iphoneLoaded || iphoneIframeError) return
    const timer = setTimeout(() => setIphoneIframeError(true), 5000)
    return () => clearTimeout(timer)
  }, [iphoneLoaded, iphoneIframeError])

  return (
    <section id="preview" className="py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2">Preview</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              어디서든 동아리를 관리하세요
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              웹 대시보드와 모바일로 언제 어디서든 동아리를 관리할 수 있습니다
            </p>
          </div>
        </BlurFade>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Safari mockup - dashboard */}
          <BlurFade delay={0.2} className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden">
              {safariIframeError ? (
                <Safari
                  url="admin.donggurami.net"
                  className="w-full"
                  imageSrc={dashboardScreen}
                />
              ) : (
                <div className="relative" style={{ aspectRatio: '1203/753' }}>
                  {/* iframe clipping container */}
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      left: `${SAFARI_SCREEN.left}%`,
                      top: `${SAFARI_SCREEN.top}%`,
                      width: `${SAFARI_SCREEN.width}%`,
                      height: `${SAFARI_SCREEN.height}%`,
                      borderRadius: '0 0 11px 11px',
                    }}
                  >
                    <iframe
                      src="/preview/dashboard"
                      title="동구라미 관리자 대시보드"
                      className="border-0 bg-white origin-top-left w-[250%] h-[250%] scale-[0.4] sm:w-[200%] sm:h-[200%] sm:scale-50"
                      loading="lazy"
                      onLoad={() => setSafariLoaded(true)}
                      onError={() => setSafariIframeError(true)}
                    />
                  </div>
                  {/* SVG frame on top */}
                  <Safari
                    url="admin.donggurami.net"
                    className="relative z-10 w-full pointer-events-none"
                    transparent
                  />
                </div>
              )}
              <BorderBeam
                size={200}
                duration={8}
                borderWidth={2}
                colorFrom="hsl(var(--primary))"
                colorTo="hsl(var(--chart-3))"
              />
            </div>
          </BlurFade>

          {/* iPhone mockup - donggurami.net */}
          <BlurFade delay={0.4} className="lg:col-span-2 flex justify-center">
            <div className="relative">
              {iphoneIframeError ? (
                <Iphone
                  className="w-[180px] sm:w-[280px]"
                  src={mobilePreviewScreen}
                />
              ) : (
                <div
                  className="relative w-[180px] sm:w-[280px]"
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
                      title="동구라미 모바일"
                      className="absolute border-0 bg-white origin-top-left w-[250%] h-[235%] scale-[0.4] sm:w-[150%] sm:h-[141%] sm:scale-[0.667]"
                      style={{ top: '6%', left: 0 }}
                      loading="lazy"
                      onLoad={() => setIphoneLoaded(true)}
                      onError={() => setIphoneIframeError(true)}
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
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/15 via-transparent to-transparent rounded-[3rem] blur-2xl -z-10" />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
