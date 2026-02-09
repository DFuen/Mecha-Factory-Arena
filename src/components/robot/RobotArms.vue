<template>
  <div class="arms" :style="armsStyle" @mousedown.stop="$emit('select')">
    <div class="arm left"></div>
    <div class="arm right"></div>
    <div class="hand left"></div>
    <div class="hand right"></div>
    <div v-if="part && props.showLabel" class="part-label">{{ part.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Part } from '../../types'

interface Props {
  part?: Part | null
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true
})
defineEmits(['select'])

const armsStyle = computed(() => ({
  '--arm-color': props.part?.color ?? '#4b5563',
  '--arm-length': '110px',
  '--arm-thickness': '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
} as any))
</script>

<style scoped>
.arms {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: var(--arm-thickness);
  pointer-events: none;
}

.arms:hover .arm {
  box-shadow: 0 0 15px rgba(241, 196, 15, 0.6);
}

.arm {
  position: absolute;
  width: var(--arm-length);
  height: var(--arm-thickness);
  background-color: var(--arm-color);
  border-radius: 10px;
  pointer-events: auto;
  transition: all 0.3s ease;
}

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
  pointer-events: auto;
}

.hand.left {
  right: calc(60px + var(--arm-length) - 12px);
}

.hand.right {
  left: calc(60px + var(--arm-length) - 12px);
}

.part-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: bold;
  color: #ecf0f1;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
