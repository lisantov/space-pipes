<template>
  <Teleport to="#modals">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 flex justify-center items-center z-50">
        <div class="fixed inset-0 bg-black/50" @click="isOpen = false"></div>

        <div
          class="w-96 p-8 rounded-2xl flex flex-col gap-6 relative"
          :class="type === 'defeat'
            ? 'bg-red-950 border border-red-500/30'
            : 'bg-gray-800 border border-white/10'"
        >
          <h2
            class="text-2xl font-bold text-center"
            :class="type === 'defeat' ? 'text-red-400' : 'text-white'"
          >
            {{ type === 'defeat' ? 'Станция уничтожена' : 'Станция спасена' }}
          </h2>
          <p
            class="text-center"
            :class="type === 'defeat' ? 'text-red-300/70' : 'text-gray-400'"
          >
            {{ type === 'defeat' ? 'Время вышло' : 'Успешное прохождение' }}
          </p>

          <div class="flex flex-col gap-3 mt-2">
            <button
              v-if="type === 'victory'"
              @click="emit('restart')"
              class="w-full py-3 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Начать заново
            </button>
            <button
              v-if="type === 'defeat'"
              @click="emit('retry')"
              class="w-full py-3 px-6 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors cursor-pointer"
            >
              Попробовать снова
            </button>
            <button
              @click="emit('main-menu')"
              class="w-full py-3 px-6 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold transition-colors cursor-pointer"
            >
              В главное меню
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'victory' | 'defeat'
}>(), {
  type: 'victory',
})
const isOpen = defineModel('open')
const emit = defineEmits<{
  restart: []
  retry: []
  'main-menu': []
}>()
</script>
