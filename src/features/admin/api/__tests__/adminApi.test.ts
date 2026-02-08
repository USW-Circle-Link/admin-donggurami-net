import { describe, it, expect } from 'vitest'
import {
  getFloorPhoto,
} from '../adminApi'

describe('Admin API', () => {
  describe('getFloorPhoto', () => {
    it('should return floor photo', async () => {
      const result = await getFloorPhoto('B1')

      expect(result.message).toBe('층 사진 조회 성공')
      expect(result.data.floor).toBe('B1')
      expect(result.data.presignedUrl).toBeDefined()
    })
  })
})
