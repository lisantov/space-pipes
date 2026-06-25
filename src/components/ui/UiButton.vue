<template>
  <button :type class="bg-transparent border-2 border-white text-white text-center min-w-42l px-12 py-3 flex items-center justify-center">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface IProps {
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<IProps>(), {
  type: 'button'
})
</script>
