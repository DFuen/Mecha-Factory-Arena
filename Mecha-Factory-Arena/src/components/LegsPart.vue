<template>
  <div class="legs" :style="legsStyle">
    <div class="leg left"></div>
    <div class="leg right"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LegsProps {
  color?: string
  width?: number
  height?: number
  gap?: number
}

const props = defineProps<LegsProps>()

const legsStyle = computed(() => ({
  width: props.width ? `${props.width}px` : '160px',
  height: props.height ? `${props.height}px` : '120px',
  gap: props.gap ? `${props.gap}px` : '20px',
  '--leg-color': props.color ?? '#6b7280'
}))
</script>

<style scoped>
.legs {
  display: flex;
  justify-content: center;
  margin: 10px auto 0;
}

.leg {
  width: 40px;
  height: 100%;
  background-color: var(--leg-color);
  border-radius: 8px;
}
</style>
