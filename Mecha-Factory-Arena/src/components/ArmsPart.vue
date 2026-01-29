<template>
  <div class="arms" :style="armsStyle">
    <div class="arm left" @mousedown.stop="$emit('mousedown', $event)"></div>
    <div class="arm right" @mousedown.stop="$emit('mousedown', $event)"></div>
    <div class="hand left"></div>
    <div class="hand right"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ArmsProps {
  id?: string
  color?: string
  length?: number
  thickness?: number
  health?: number
  attack?: number
  defense?: number
}

const props = defineProps<ArmsProps>()
defineEmits(['mousedown'])

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
  pointer-events: none; /* El contenedor no intercepta clics */
}

.arm {
  position: absolute;
  width: var(--arm-length);
  height: var(--arm-thickness);
  background-color: var(--arm-color);
  border-radius: 10px;
  pointer-events: auto; /* Los brazos sí interceptan clics */
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


</style>
