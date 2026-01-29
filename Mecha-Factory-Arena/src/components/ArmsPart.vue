<template>
  <div
    class="arms"
    :class="{ active }"
    :style="armsStyle"
    @click.stop="emit('select')"
  >
    <div class="arm left"></div>
    <div class="arm right"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ArmsProps {
  color?: string
  length?: number
  thickness?: number
  active?: boolean
}

const props = defineProps<ArmsProps>()
const emit = defineEmits(['select'])

const armsStyle = computed(() => ({
  '--arm-color': props.color ?? '#4b5563',
  '--arm-length': props.length ? `${props.length}px` : '110px',
  '--arm-thickness': props.thickness ? `${props.thickness}px` : '16px'
}))
</script>

<style scoped>
.arms {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: var(--arm-thickness);

  pointer-events: auto;
  cursor: pointer;

  transition: transform 0.2s ease, filter 0.2s ease;
}

.arms:hover {
  transform: translateX(-50%) scale(1.05);
  filter: brightness(1.15);
}

.arms.active {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9));
}

.arm {
  position: absolute;
  width: var(--arm-length);
  height: var(--arm-thickness);
  background-color: var(--arm-color);
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.arm.left {
  right: 60px;
}

.arm.right {
  left: 60px;
}

.arms:hover .arm.left {
  transform: rotate(-5deg);
}

.arms:hover .arm.right {
  transform: rotate(5deg);
}
</style>
