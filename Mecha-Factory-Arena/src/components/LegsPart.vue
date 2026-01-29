<template>
  <div
    class="legs"
    :class="{ active }"
    :style="legsStyle"
    @click.stop="emit('select')"
  >
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
  active?: boolean
}

const props = defineProps<LegsProps>()
const emit = defineEmits(['select'])

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
  cursor: pointer;

  transition: transform 0.2s ease, filter 0.2s ease;
}

/* Hover */
.legs:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Activo */
.legs.active {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9));
}

.leg {
  width: 40px;
  height: 100%;
  background-color: var(--leg-color);
  border-radius: 8px;
}
</style>
