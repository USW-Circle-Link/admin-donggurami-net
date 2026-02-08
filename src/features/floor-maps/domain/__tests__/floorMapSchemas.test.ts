import { describe, it, expect } from 'vitest'
import {
  floorEnumSchema,
  floorMapResponseSchema,
  type FloorEnum,
  type UploadFloorMapsRequest,
} from '../floorMapSchemas'

describe('floorMapSchemas', () => {
  describe('floorEnumSchema', () => {
    it('should validate valid floor enums', () => {
      expect(floorEnumSchema.parse('B1')).toBe('B1')
      expect(floorEnumSchema.parse('F1')).toBe('F1')
      expect(floorEnumSchema.parse('F2')).toBe('F2')
    })

    it('should reject invalid floor enums', () => {
      expect(() => floorEnumSchema.parse('F3')).toThrow()
      expect(() => floorEnumSchema.parse('B2')).toThrow()
      expect(() => floorEnumSchema.parse('invalid')).toThrow()
    })
  })

  describe('floorMapResponseSchema', () => {
    it('should validate valid floor map response', () => {
      const validData = {
        floor: 'F1' as FloorEnum,
        presignedUrl: 'https://example.com/floor1.jpg',
      }

      const result = floorMapResponseSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject response with invalid floor', () => {
      const invalidData = {
        floor: 'F3',
        presignedUrl: 'https://example.com/floor3.jpg',
      }

      expect(() => floorMapResponseSchema.parse(invalidData)).toThrow()
    })

    it('should reject response without presignedUrl', () => {
      const invalidData = {
        floor: 'F1',
      }

      expect(() => floorMapResponseSchema.parse(invalidData)).toThrow()
    })
  })

  describe('UploadFloorMapsRequest type', () => {
    it('should allow File objects for each floor', () => {
      const file = new File(['content'], 'floor.jpg', { type: 'image/jpeg' })

      const request: UploadFloorMapsRequest = {
        B1: file,
        F1: file,
        F2: file,
      }

      expect(request.B1).toBeInstanceOf(File)
      expect(request.F1).toBeInstanceOf(File)
      expect(request.F2).toBeInstanceOf(File)
    })

    it('should allow partial uploads', () => {
      const file = new File(['content'], 'floor.jpg', { type: 'image/jpeg' })

      const request: UploadFloorMapsRequest = {
        F1: file,
      }

      expect(request.F1).toBeInstanceOf(File)
      expect(request.B1).toBeUndefined()
      expect(request.F2).toBeUndefined()
    })
  })
})
