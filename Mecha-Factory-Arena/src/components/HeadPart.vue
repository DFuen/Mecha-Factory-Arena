<template>
  <div class="head" :style="headStyle">
    <div class="eye left"></div>
    <div class="eye right"></div>
    <div class="mouth"></div>
    <div class="orejaL"></div>
    <div class="orejaR"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HeadProps {
  id?: string
  color?: string
  borderRadius?: string
  size?: number
  health?: number
  attack?: number
  defense?: number
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
  z-index: 5;
  animation: quebote 1s infinite ease-in-out;
}

.orejaL {
  width: 20px;
  height: 50px;
  background: rgb(56, 55, 55);
  position: absolute;
  top: 35px;
  left: -18px;
  border-radius: 3px;
  z-index: 2;
}

.orejaR {
  width: 20px;
  height: 50px;
  background: rgb(56, 55, 55);
  position: absolute;
  top: 35px;
  left: 118px;
  border-radius: 3px;
  z-index: 1;
}

.eye {
  width: 40px;
  height: 40px;
  background: white;
  border: 6px solid rgb(56, 55, 55);
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
  height:20px;
  border-radius: 5px;
  background: white;
  border: 6px solid rgb(56, 55, 55);
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes quebote {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
  
}


</style>
