<script setup lang="ts">
import { CursorHoverTrail, GameController } from '@/components'
import { DefaultLayout } from '@/layouts'
</script>

<template>
  <cursor-hover-trail />
  <default-layout >
    <game-controller />
  </default-layout>
  <div id="modals" class="z-10"></div>
</template>
