<template>
  <div
    class="body"
    :class="{ active }"
    :style="bodyStyle"
    @click.stop="emit('select')"
  >
    <div class="panel"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BodyProps {
  color?: string
  width?: number
  height?: number
  active?: boolean
}

const props = defineProps<BodyProps>()
const emit = defineEmits(['select'])

const bodyStyle = computed(() => ({
  backgroundColor: props.color ?? '#9ca3af',
  width: props.width ? `${props.width}px` : '160px',
  height: props.height ? `${props.height}px` : '200px'
}))
</script>

<style scoped>
.body {
  border-radius: 12px;
  margin: 10px auto 0;
  position: relative;
  cursor: pointer;

  transition: transform 0.2s ease, filter 0.2s ease;
}

/* Hover */
.body:hover {
  transform: scale(1.03);
  filter: brightness(1.1);
}

/* Activo */
.body.active {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9));
}

/* ===== Panel ===== */

.panel {
  width: 60px;
  height: 40px;
  background-color: #374151;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
}
</style>
