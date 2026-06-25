import { ETileRotation } from '@/types/enums'

export const getRandomRotation = () => {
  const index = Math.floor(Math.random() * 4)
  switch (index) {
    case 0:
      return ETileRotation.STILL
    case 1:
      return ETileRotation.ONCE
    case 2:
      return ETileRotation.TWICE
    case 3:
      return ETileRotation.TRIPLE
    default:
      throw new Error('ОШИБКА: непредвиденная ошибка')
  }
}
