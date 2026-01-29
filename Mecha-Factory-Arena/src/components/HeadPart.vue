<template>
  <div
    class="head"
    :class="{ active }"
    :style="headStyle"
    @click.stop="emit('select')"
  >
    <div class="eye left"></div>
    <div class="eye right"></div>
    <div class="mouth"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HeadProps {
  color?: string
  borderRadius?: string
  size?: number
  active?: boolean
}

const props = defineProps<HeadProps>()
const emit = defineEmits(['select'])

const headStyle = computed(() => ({
  backgroundColor: props.color ?? '#d1d5db',
  borderRadius: props.borderRadius ?? '16px',
  width: props.size ? `${props.size}px` : '120px',
  height: props.size ? `${props.size}px` : '120px'
}))
</script>

<style scoped>
.head {
  position: relative;
  margin: 0 auto;
  cursor: pointer;

  transition: transform 0.2s ease, filter 0.2s ease;
}

/* Hover */
.head:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Activo */
.head.active {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9));
}

/* ===== Cara ===== */

.eye {
  width: 16px;
  height: 16px;
  background: black;
  border-radius: 50%;
  position: absolute;
  top: 30px;
}

.eye.left {
  left: 30px;
}

.eye.right {
  right: 30px;
}

.mouth {
  width: 50px;
  height: 6px;
  background: black;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
