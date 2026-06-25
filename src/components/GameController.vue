<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { StartScreen } from '@/components/screens'
import GameScreen from '@/components/screens/GameScreen.vue'

const game = useGameStore()
</script>

<template>
  <Transition name="screen-fade" mode="out-in">
    <start-screen v-if="game.isStart" key="start" />

    <game-screen v-else-if="game.isGame" key="game" />
  </Transition>
</template>
