<template>
  <div
    class="absolute"
    :style="{ left: coordinates.x - 10 + 'px', top: coordinates.y - 10 + 'px' }"
  >
    <transition name="fade" mode="out-in">
      <div v-if="!hoverStore.currentHoverId" class="relative w-6 aspect-square">
        <div class="corner top-0 left-0 rotate-0"></div>
        <div class="corner top-0 right-0 rotate-90"></div>
        <div class="corner bottom-0 left-0 -rotate-90"></div>
        <div class="corner bottom-0 right-0 rotate-180"></div>
      </div>
      <div
        v-else
        class="rounded-full w-2 aspect-square bg-purple-500/65 transition-all duration-250"
        :class="isMouseDown ? 'scale-200 opacity-65' : 'scale-100'"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 0.6;
}
</style>

<script setup lang="ts">
import { useHoverStore } from '@/stores/hover.ts'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const hoverStore = useHoverStore()
const isMouseDown = ref<boolean>(false)

const setMouseDown = () => (isMouseDown.value = true)
const setMouseUp = () => (isMouseDown.value = false)

const coordinates = reactive<{
  x: number
  y: number
}>({
  x: 0,
  y: 0,
})

onMounted(() => {
  document.addEventListener('mousemove', updateCoordinates)
  document.addEventListener('mousedown', setMouseDown)
  document.addEventListener('mouseup', setMouseUp)
  document.addEventListener('click', hoverStore.resetHoverId)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateCoordinates)
  document.removeEventListener('mousedown', setMouseDown)
  document.removeEventListener('mouseup', setMouseUp)
  document.removeEventListener
  ('click', hoverStore.resetHoverId)
})

const updateCoordinates = (event: MouseEvent) => {
  coordinates.x = event.clientX
  coordinates.y = event.clientY
}
</script>
