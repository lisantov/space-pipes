<template>
  <div class="p-4 relative" @mouseenter="setHoverId" @mouseleave="hoverStore.resetHoverId">
    <transition name="fade">
      <div v-if="currentHovered">
        <div class="corner top-0 left-0 rotate-0"></div>
        <div class="corner top-0 right-0 rotate-90"></div>
        <div class="corner bottom-0 left-0 -rotate-90"></div>
        <div class="corner bottom-0 right-0 rotate-180"></div>
      </div>
    </transition>
    <slot @focus="setHoverId" />
  </div>
</template>

<script setup lang="ts">
import { useHoverStore } from '@/stores/hover.ts'
import { computed, ref, useId } from 'vue'

interface IProps {
  id?: string
}
const props = defineProps<IProps>()

const hoverStore = useHoverStore()
const id = ref<string>(props.id ?? useId())

const currentHovered = computed(() => hoverStore.currentHoverId === id.value)
const setHoverId = () => {
  hoverStore.setCurrentHoverId(id.value)
}
</script>
