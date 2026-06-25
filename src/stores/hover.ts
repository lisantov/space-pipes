import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHoverStore = defineStore('hover', () => {
  const currentHoverId = ref<string | null>('title')

  const setCurrentHoverId = (id: string) => currentHoverId.value = id
  const resetHoverId = () => currentHoverId.value = null

  return {
    currentHoverId,
    setCurrentHoverId,
    resetHoverId
  }
})
