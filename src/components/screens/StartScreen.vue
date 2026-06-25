<template>
  <div class="flex flex-col gap-12 items-center">
    <ui-hover-indicator id="title" class="entrance-item" style="animation-delay: 0.1s">
      <h1 class="text-white text-6xl text-center">SPACE PIPES</h1>
    </ui-hover-indicator>
    <div class="entrance-item" style="animation-delay: 0.2s">
      <ui-separator />
    </div>
    <ui-hover-indicator class="entrance-item" style="animation-delay: 0.3s">
      <p class="text-gray-300 text-xl">
        При столкновении с космическим телом на Международной космической станции «Марс-2» в секторе
        «А» произошел процесс неконтролируемой разгерметизации. Требуется срочно восстановить
        разрушенную систему подачи воздуха. Для этого в сектор «А» были направлены специалисты по
        монтажу систем вентиляции. Перед ними поставлена задача, восстановить систему воздуховода на
        поврежденном участке, соединив нужные участки труб между началом и концом разрыва (начало и
        конец разрыва находятся на противоположных сторонах).
      </p>
    </ui-hover-indicator>
    <ui-hover-indicator class="entrance-item cursor-pointer transition duration-600 hover:opacity-70" style="animation-delay: 0.4s" @click.stop="gameStore.startGame">
      <ui-button class="text-2xl cursor-pointer">Начать</ui-button>
    </ui-hover-indicator>
  </div>
</template>
<script setup lang="ts">
import { UiButton, UiHoverIndicator, UiSeparator } from '@/components'
import { useGameStore } from '@/stores/game.ts'

const gameStore = useGameStore()
</script>
