<template>
  <div class="flex items-center justify-center w-full h-full gap-12">
    <div
      class="flex flex-col items-center gap-4 relative py-3"
    >
      <div class="absolute left-5 top-5 bottom-5 w-px bg-white/15"></div>

      <div class="flex items-center gap-4 relative entrance-item" style="animation-delay: 0.1s">
        <div
          class="w-11 h-11 flex items-center justify-center border-2 text-sm font-bold transition-all duration-700"
          :class="d1
            ? 'bg-green-600 border-green-400 text-white'
            : currentStage === 1
              ? 'bg-yellow-800/50 border-yellow-400 text-yellow-200 stage-current'
              : 'bg-black border-white/20 text-white/30'"
        >1</div>
        <div class="flex flex-col">
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d1 ? 'text-green-400' : currentStage === 1 ? 'text-white' : 'text-white/30'"
          >Этап 1</span>
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d1 ? 'text-green-400/50' : currentStage === 1 ? 'text-white/50' : 'text-white/15'"
          >6×6</span>
        </div>
      </div>

      <div class="flex items-center gap-4 relative entrance-item" style="animation-delay: 0.2s">
        <div
          class="w-11 h-11 flex items-center justify-center border-2 text-sm font-bold transition-all duration-700"
          :class="d2
            ? 'bg-green-600 border-green-400 text-white'
            : currentStage === 2
              ? 'bg-yellow-800/50 border-yellow-400 text-yellow-200 stage-current'
              : 'bg-black border-white/20 text-white/30'"
        >2</div>
        <div class="flex flex-col">
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d2 ? 'text-green-400' : currentStage === 2 ? 'text-white' : 'text-white/30'"
          >Этап 2</span>
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d2 ? 'text-green-400/50' : currentStage === 2 ? 'text-white/50' : 'text-white/15'"
          >9×9</span>
        </div>
      </div>

      <div class="flex items-center gap-4 relative entrance-item" style="animation-delay: 0.3s">
        <div
          class="w-11 h-11 flex items-center justify-center border-2 text-sm font-bold transition-all duration-700"
          :class="d3
            ? 'bg-green-600 border-green-400 text-white'
            : currentStage === 3
              ? 'bg-yellow-800/50 border-yellow-400 text-yellow-200 stage-current'
              : 'bg-black border-white/20 text-white/30'"
        >3</div>
        <div class="flex flex-col">
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d3 ? 'text-green-400' : currentStage === 3 ? 'text-white' : 'text-white/30'"
          >Этап 3</span>
          <span
            class="text-[11px] font-bold tracking-widest uppercase leading-tight transition-all duration-500"
            :class="d3 ? 'text-green-400/50' : currentStage === 3 ? 'text-white/50' : 'text-white/15'"
          >12×12</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-4">
      <div
        class="text-3xl font-bold tracking-widest tabular-nums entrance-item"
        style="animation-delay: 0.4s"
        :class="timeLeft <= 30 ? 'text-red-500' : 'text-yellow-300'"
      >
        {{ formattedTime }}
      </div>

      <div
        class="border-2 border-white/30 border-dashed overflow-hidden entrance-item"
        style="animation-delay: 0.5s"
      >
        <Transition name="slide" mode="out-in">
          <GameTileGrid
            v-if="currentStage === 1"
            :key="'stage1-' + gridKey"
            :rows="6"
            :columns="6"
            @victory="handleFirstStage"
          />
          <GameTileGrid
            v-else-if="currentStage === 2"
            :key="'stage2-' + gridKey"
            :rows="9"
            :columns="9"
            @victory="handleSecondStage"
          />
          <GameTileGrid
            v-else-if="currentStage === 3"
            :key="'stage3-' + gridKey"
            :rows="12"
            :columns="12"
            @victory="handleThirdStage"
          />
        </Transition>
      </div>
    </div>

    <ResultsModal
      v-model:open="isModalOpen"
      :type="modalType"
      @restart="handleRestart"
      @retry="handleDefeatRetry"
      @main-menu="handleMainMenu"
    />
  </div>
</template>

<script setup lang="ts">
import GameTileGrid from '@/components/game/GameTileGrid.vue'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { ResultsModal } from '@/components/modals'
import { useGameStore } from '@/stores/game'

const TIMER_DURATION = 120

const game = useGameStore()
const isGameEnded = ref(false)
const isDefeat = ref(false)
const currentStage = ref(1)
const gridKey = ref(0)
const d1 = ref(false)
const d2 = ref(false)
const d3 = ref(false)
const timeLeft = ref(TIMER_DURATION)
let timerInterval: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const isModalOpen = computed({
  get: () => isGameEnded.value || isDefeat.value,
  set: (v) => { if (!v) { isGameEnded.value = false; isDefeat.value = false } },
})

const modalType = computed(() => isDefeat.value ? 'defeat' : 'victory')

const startTimer = () => {
  stopTimer()
  timeLeft.value = TIMER_DURATION
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      stopTimer()
      if (!isGameEnded.value) isDefeat.value = true
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

watch(currentStage, (val) => {
  if (val > 1) setTimeout(() => { d1.value = true }, 200)
  if (val > 2) setTimeout(() => { d2.value = true }, 200)
})

watch(isGameEnded, (val) => {
  if (val) { stopTimer(); setTimeout(() => { d3.value = true }, 200) }
})

onMounted(() => startTimer())
onBeforeUnmount(() => stopTimer())

const handleFirstStage = () => {
  currentStage.value = 2
}
const handleSecondStage = () => {
  currentStage.value = 3
}
const handleThirdStage = () => {
  isGameEnded.value = true
}

const handleRestart = () => {
  isGameEnded.value = false
  currentStage.value = 1
  d1.value = false
  d2.value = false
  d3.value = false
  gridKey.value++
  startTimer()
}

const handleDefeatRetry = () => {
  isDefeat.value = false
  gridKey.value++
  startTimer()
}

const handleMainMenu = () => {
  stopTimer()
  game.resetGame()
}
</script>
