import { ETileRotation, ETileType } from '@/types/enums'
import type { IAccessMap } from '@/types/tile.ts'

export const getAccessMap = (type: ETileType, rotation: ETileRotation): IAccessMap => {
  switch (type) {
    case ETileType.START:
      return {
        top: true,
        left: true,
        right: true,
        bottom: true
      }
    case ETileType.THROUGH:
      if ((rotation / 90) % 2 === 0) {
        return {
          top: false,
          left: true,
          right: true,
          bottom: false,
        }
      } else {
        return {
          top: true,
          left: false,
          right: false,
          bottom: true,
        }
      }
    case ETileType.ANGLE:
      rotation %= 360;
      switch (rotation / 90) {
        case 0:
          return {
            top: true,
            left: false,
            right: true,
            bottom: false,
          }
        case 1:
          return {
            top: false,
            left: false,
            right: true,
            bottom: true,
          }
        case 2:
          return {
            top: false,
            left: true,
            right: false,
            bottom: true,
          }
        case 3:
          return {
            top: true,
            left: true,
            right: false,
            bottom: false,
          }
        default:
          throw new Error('Непредвиденная ошибка')
      }
    case ETileType.FORK:
      rotation %= 360;
      switch (rotation / 90) {
        case 0:
          return {
            top: true,
            left: true,
            right: true,
            bottom: false,
          }
        case 1:
          return {
            top: true,
            left: false,
            right: true,
            bottom: true,
          }
        case 2:
          return {
            top: false,
            left: true,
            right: true,
            bottom: true,
          }
        case 3:
          return {
            top: true,
            left: true,
            right: false,
            bottom: true,
          }
        default:
          throw new Error('Непредвиденная ошибка')
      }
    default:
      throw new Error('Непредвиденная ошибка')
  }
}
