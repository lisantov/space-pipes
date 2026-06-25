import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type GamePhase = 'start' | 'game' | 'results'

export const useGameStore = defineStore('game', () => {
  const phase = ref<GamePhase>('start')
  const score = ref(0)

  const isStart = computed(() => phase.value === 'start')
  const isGame = computed(() => phase.value === 'game')
  const isResults = computed(() => phase.value === 'results')

  function startGame() {
    score.value = 0
    phase.value = 'game'
  }

  function endGame(finalScore: number) {
    score.value = finalScore
    phase.value = 'results'
  }

  function resetGame() {
    score.value = 0
    phase.value = 'start'
  }

  return { phase, score, isStart, isGame, isResults, startGame, endGame, resetGame }
})
