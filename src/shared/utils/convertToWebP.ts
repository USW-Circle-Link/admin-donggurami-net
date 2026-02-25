/**
 * 이미지 파일을 WebP 포맷으로 변환합니다.
 * Canvas API를 사용하여 클라이언트 사이드에서 변환합니다.
 *
 * @param file - 변환할 이미지 File 객체
 * @param quality - WebP 압축 품질 (0~1, 기본값 0.85)
 * @returns WebP로 변환된 File 객체
 */
export function convertToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas context 생성 실패'))
        return
      }

      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('WebP 변환 실패'))
            return
          }

          const fileName = file.name.replace(/\.[^.]+$/, '.webp')
          resolve(new File([blob], fileName, { type: 'image/webp' }))
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지 로드 실패'))
    }

    img.src = url
  })
}
