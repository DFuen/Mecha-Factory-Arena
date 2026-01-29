<template>
  <div class="legs" :style="legsStyle" @mousedown.stop="$emit('mousedown', $event)">
    <div class="leg left"></div>
    <div class="leg right"></div>
    <div class="footR"></div>
    <div class="footL"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LegsProps {
  id?: string
  color?: string
  width?: number
  height?: number
  gap?: number
  health?: number
  attack?: number
  defense?: number
}

const props = defineProps<LegsProps>()
defineEmits(['mousedown'])

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
  margin: 0 auto 0;
}

.leg {
  width: 30px;
  height: 100%;
  background-color: var(--leg-color);
  border-bottom-right-radius: 8px;
}

.footL {
  width: 70px;
  height: 40px;
  background-color: rgb(56, 55, 55);
  border-top-right-radius: 20px;
  border-top-left-radius:15px;
  position: absolute;
  left: calc(50% - 50px);
  bottom: 0;
}

.footR {
  width: 70px;
  height: 40px;
  background-color: rgb(56, 55, 55);
  border-top-right-radius: 20px;
  border-top-left-radius: 15px;
  position: absolute;
  right: calc(40% - 50px);
  bottom: 0;
}

</style>
