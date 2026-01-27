<template>
  <div class="body" :style="bodyStyle">
    <div class="panel"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BodyProps {
  color?: string
  width?: number
  height?: number
}

const props = defineProps<BodyProps>()

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
}

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
