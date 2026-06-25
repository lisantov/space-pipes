import { ETileType } from '@/types/enums'

export const getRandomType = () => {
  const index = Math.floor(Math.random() * 3)
  switch (index) {
    case 0:
      return ETileType.THROUGH
    case 1:
      return ETileType.ANGLE
    case 2:
      return ETileType.FORK
    default:
      throw new Error('ОШИБКА: непредвиденная ошибка')
  }
}
