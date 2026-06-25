import { ETileStatus, ETileType } from '@/types/enums'

export interface IAccessMap {
  top: boolean
  left: boolean
  right: boolean
  bottom: boolean
}

export interface ITile {
  type: ETileType
  status: ETileStatus
  rotation: number
  accessMap: IAccessMap
}
