<template>
  <div :class="`flex`">
    <div v-for="(col, x) in grid" :key="x" class="flex flex-col">
      <template v-for="(item, y) in col" :key="y">
        <GamePipeTile
          :status="item.status"
          :type="item.type"
          :rotation="item.rotation"
          @rotate="handleRotation(x, y)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITile } from '@/types/tile'
import { onMounted, ref } from 'vue'
import { ETileRotation, ETileStatus, ETileType } from '@/types/enums'
import GamePipeTile from '@/components/game/GamePipeTile.vue'
import { getRandomRotation } from '@/utils/getRandomRotation'
import { getRandomType } from '@/utils/getRandomType'
import { getNextCoords } from '@/utils/routeConditions'
import { getAccessMap } from '@/utils/getAccessMap.ts'
import { useGameStore } from '@/stores/game.ts'

interface IProps {
  rows?: number
  columns?: number
}
const props = withDefaults(defineProps<IProps>(), {
  rows: 10,
  columns: 10,
})
const emit = defineEmits<{
  victory: []
}>()

const grid = ref<ITile[][]>(
  Array.from({ length: props.rows }, () => new Array(props.columns).fill(0)),
)

const isVictoryPending = ref(false)

const oppositeDir = (dir: number[]): [number, number] => [-dir[0]!, -dir[1]!]

const findWinningPath = (): [number, number][] | null => {
  const queue: [number, number][] = [[0, 0]]
  const visited = new Set<string>()
  visited.add('0:0')
  const parent = new Map<string, [number, number]>()

  while (queue.length > 0) {
    const [x, y] = queue.shift()!

    if (x === props.rows - 1 && y === props.columns - 1) {
      const path: [number, number][] = []
      let cur: [number, number] = [x, y]
      while (cur[0] !== 0 || cur[1] !== 0) {
        path.unshift(cur)
        cur = parent.get(`${cur[0]}:${cur[1]}`)!
      }
      path.unshift([0, 0])
      return path
    }

    const tile = grid.value[x]![y]!
    const nextCoords = getNextCoords(tile)!

    for (const coord of nextCoords) {
      const newX = x + coord[0]!
      const newY = y + coord[1]!
      const key = `${newX}:${newY}`

      if (newX < 0 || newX >= props.rows || newY < 0 || newY >= props.columns) continue
      if (visited.has(key)) continue

      const neighbor = grid.value[newX]![newY]!
      const neighborDirs = getNextCoords(neighbor)!
      const opposite = oppositeDir(coord)

      const hasMatch = neighborDirs.some(nc => nc[0] === opposite[0] && nc[1] === opposite[1])
      if (!hasMatch) continue

      visited.add(key)
      parent.set(key, [x, y])
      queue.push([newX, newY])
    }
  }

  return null
}

const computeChanges = () => {
  const endX = props.rows - 1
  const endY = props.columns - 1
  const endKey = `${endX}:${endY}`

  const connected = new Set<string>()
  const toFill: [number, number][] = []
  const queue: [number, number][] = [[0, 0]]
  connected.add('0:0')

  while (queue.length > 0) {
    const [x, y] = queue.shift()!
    const tile = grid.value[x]![y]!

    if (tile.status === ETileStatus.STILL) toFill.push([x, y])

    if (x === endX && y === endY) continue

    const nextCoords = getNextCoords(tile)!
    for (const coord of nextCoords) {
      const newX = x + coord[0]!
      const newY = y + coord[1]!
      const key = `${newX}:${newY}`

      if (newX < 0 || newX >= props.rows || newY < 0 || newY >= props.columns) continue
      if (connected.has(key)) continue

      const neighbor = grid.value[newX]![newY]!
      const neighborDirs = getNextCoords(neighbor)!
      const opposite = oppositeDir(coord)

      const hasMatch = neighborDirs.some(nc => nc[0] === opposite[0] && nc[1] === opposite[1])
      if (!hasMatch) continue

      connected.add(key)
      queue.push([newX, newY])
    }
  }

  const toClear: [number, number][] = []
  for (let x = 0; x < props.rows; x++) {
    for (let y = 0; y < props.columns; y++) {
      const key = `${x}:${y}`
      const tile = grid.value[x]![y]!
      if (!connected.has(key) && tile.status === ETileStatus.FILLED) {
        toClear.push([x, y])
      }
    }
  }

  for (const [x, y] of toClear) {
    grid.value[x]![y]!.status = ETileStatus.STILL
  }

  return { toFill, isSolved: connected.has(endKey) }
}

const animateFill = (tiles: [number, number][], onComplete: () => void) => {
  if (tiles.length === 0) { onComplete(); return }

  const totalDuration = Math.min(800, tiles.length * 30)
  const delay = totalDuration / tiles.length

  tiles.forEach(([x, y], i) => {
    setTimeout(() => {
      grid.value[x]![y]!.status = ETileStatus.FILLED
      if (i === tiles.length - 1) onComplete()
    }, i * delay)
  })
}

const animateSolved = (winningPath: [number, number][]) => {
  const totalDuration = Math.min(1000, winningPath.length * 50)
  const delay = totalDuration / winningPath.length

  winningPath.forEach(([x, y], i) => {
    setTimeout(() => {
      grid.value[x]![y]!.status = ETileStatus.SOLVED
    }, i * delay)
  })

  setTimeout(() => emit('victory'), totalDuration + 500)
}

const handleRotation = (x: number, y: number) => {
  if (isVictoryPending.value) return
  const tile = grid.value[x]![y]!
  tile.rotation = (tile.rotation + 90)
  tile.accessMap = getAccessMap(tile.type, tile.rotation as ETileRotation)

  const { toFill, isSolved } = computeChanges()

  animateFill(toFill, () => {
    if (isSolved) {
      isVictoryPending.value = true
      setTimeout(() => {
        const winningPath = findWinningPath()
        if (winningPath) animateSolved(winningPath)
      }, 600)
    }
  })
}

onMounted(() => {
  for (let x = 0; x < props.rows; x++) {
    for (let y = 0; y < props.columns; y++) {
      const rotation = getRandomRotation()
      const type = getRandomType()
      grid.value[x]![y] = {
        rotation: 0,
        type,
        status: ETileStatus.STILL,
        accessMap: getAccessMap(type, rotation)
      }
    }
  }
  grid.value[0]![0]!.type = ETileType.START
  grid.value[props.rows - 1]![props.columns - 1]!.type = ETileType.START
  const { toFill } = computeChanges()
  for (const [x, y] of toFill) {
    grid.value[x]![y]!.status = ETileStatus.FILLED
  }
})
</script>
