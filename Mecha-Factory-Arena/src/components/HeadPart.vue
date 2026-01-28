<template>
  <div class="head" :style="headStyle">
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
}

const props = defineProps<HeadProps>()

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
}

.eye {
  width: 40px;
  height: 40px;
  background: black;
  border-radius: 50%;
  position: absolute;
  top: 40px;
}

.eye.left {
  left: 10px;
}

.eye.right {
  right: 10px;
}

.mouth {
  width: 50px;
  height:14px;
  border-radius: 7px;
  background: black;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
