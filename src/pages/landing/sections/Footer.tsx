export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between">
          {/* Logo & branding */}
          <div className="flex items-center gap-2">
            <img
              src="/Icon-512.png"
              alt="동구라미"
              className="h-6 w-6 rounded"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/circle_default_image.png'
              }}
            />
            <span className="text-lg font-[Juache,sans-serif] text-primary">
              동구라미
            </span>
          </div>

          {/* Links & Copyright - right aligned */}
          <div className="flex flex-col items-end gap-1">
            <nav aria-label="푸터 링크" className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="https://donggurami.net/assets/assets/html/privacy_policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                개인정보처리방침
              </a>
              <span className="text-border">|</span>
              <a
                href="https://donggurami.net/assets/assets/html/terms_of_service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                이용약관
              </a>
            </nav>
            <p className="text-xs text-muted-foreground">
              &copy; 2024-2026 동구라미. 수원대학교 중앙동아리 연합회
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
