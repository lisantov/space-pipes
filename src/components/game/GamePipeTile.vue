<template>
  <ui-hover-indicator
    class="transition-all duration-200 hover:opacity-75"
    @click.stop="emit('rotate')"
  >
    <div class="w-10 h-10 relative bg-neutral-950">
      <div
        class="absolute inset-0 transition-all duration-200"
        :style="{ rotate: rotation + 'deg' }"
      >
        <div
          v-if="dir.left"
          class="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-2 rounded-r-full transition-all duration-300"
          :class="pipeClass"
        ></div>

        <div
          v-if="dir.right"
          class="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-2 rounded-l-full transition-all duration-300"
          :class="pipeClass"
        ></div>

        <div
          v-if="dir.top"
          class="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-2 rounded-b-full transition-all duration-300"
          :class="pipeClass"
        ></div>

        <div
          v-if="dir.bottom"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-2 rounded-t-full transition-all duration-300"
          :class="pipeClass"
        ></div>

        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full z-10 transition-all duration-300"
          :class="hubClass"
        ></div>
      </div>
      <div class="absolute inset-0 border border-white/5 pointer-events-none"></div>
    </div>
  </ui-hover-indicator>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ETileStatus, ETileType } from '@/types/enums'
import { UiHoverIndicator } from '@/components'

interface IProps {
  status: ETileStatus
  type: ETileType
  rotation: number
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  rotate: []
}>()

const dir = computed(() => {
  switch (props.type) {
    case ETileType.START:
      return { top: true, left: true, right: true, bottom: true }
    case ETileType.THROUGH:
      return { top: false, left: true, right: true, bottom: false }
    case ETileType.ANGLE:
      return { top: true, left: false, right: true, bottom: false }
    case ETileType.FORK:
      return { top: true, left: true, right: true, bottom: false }
    default:
      return { top: false, left: false, right: false, bottom: false }
  }
})

const pipeClass = computed(() => {
  if (props.status === ETileStatus.SOLVED) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
  if (props.type === ETileType.START) return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
  if (props.status === ETileStatus.FILLED) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
  return 'bg-neutral-600'
})

const hubClass = computed(() => {
  if (props.status === ETileStatus.SOLVED) return 'bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.8)]'
  if (props.type === ETileType.START) return 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
  if (props.status === ETileStatus.FILLED) return 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
  return 'bg-neutral-500'
})
</script>
