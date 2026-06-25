import type { ITile } from '@/types/tile'
import { ETileType } from '@/types/enums'

export const getNextCoords = (tile: ITile) => {
  switch (tile.type) {
    case ETileType.THROUGH:
      return getNextCoordsForThrough(tile.rotation)
    case ETileType.ANGLE:
      return getNextCoordsForAngle(tile.rotation)
    case ETileType.FORK:
      return getNextCoordsForFork(tile.rotation)
    case ETileType.START:
      return [[1, 0], [-1, 0], [0, 1], [0, -1]]
    default:
      return []
  }
}

export const getNextCoordsForThrough = (rotation: number) => {
  if ((rotation / 90) % 2 === 0) {
    return [[1, 0], [-1, 0]]
  } else return [[0, 1], [0, -1]]
}

export const getNextCoordsForAngle = (rotation: number) => {
  rotation %= 360;
  switch (rotation / 90) {
    case 0:
      return [[0, -1], [1, 0]]
    case 1:
      return [[0, 1], [1, 0]]
    case 2:
      return [[0, 1], [-1, 0]]
    case 3:
      return [[0, -1], [-1, 0]]
    default:
      return []
  }
}

export const getNextCoordsForFork = (rotation: number) => {
  rotation %= 360;
  switch (rotation / 90) {
    case 0:
      return [[0, -1], [-1, 0], [1, 0]]
    case 1:
      return [[0, -1], [0, 1], [1, 0]]
    case 2:
      return [[-1, 0], [1, 0], [0, 1]]
    case 3:
      return [[0, -1], [0, 1], [-1, 0]]
    default:
      return []
  }
}
