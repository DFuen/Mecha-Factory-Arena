<template>
  <div class="arms" :style="armsStyle">
    <div class="arm left"></div>
    <div class="arm right"></div>
    <div class="hand left"></div>
    <div class="hand right"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ArmsProps {
  color?: string
  length?: number
  thickness?: number
}

const props = defineProps<ArmsProps>()

const armsStyle = computed(() => ({
  '--arm-color': props.color ?? '#4b5563',
  '--arm-length': props.length ? `${props.length}px` : '110px',
  '--arm-thickness': props.thickness ? `${props.thickness}px` : '16px'
}))
</script>

<style scoped>
.arms {
  position: absolute;
  top: 50px;                 /* altura del hombro */
  left: 50%;
  transform: translateX(-50%);
  width: 0;                  /* punto de anclaje central */
  height: var(--arm-thickness);
  pointer-events: none;
  animation: quebote 1s infinite ease-in-out;
}

.arm {
  position: absolute;
  width: var(--arm-length);
  height: var(--arm-thickness);
  background-color: var(--arm-color);
  border-radius: 10px;
}

/* Brazos crecen hacia fuera del cuerpo */
.arm.left {
  right: 60px;
}

.arm.right {
  left: 60px;
}

.hand {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: rgb(56, 55, 55);
  border-radius: 10%;
  top: 50%;
  transform: translateY(-50%);
}
.hand.left {
  right: calc(60px + var(--arm-length) - 12px);
}
.hand.right {
  left: calc(60px + var(--arm-length) - 12px);
}

@keyframes quebote {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
  
}
</style>
