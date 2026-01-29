<template>
  <div class="robot">
    <Head color="rgb(50, 116, 179)" :size="120" />

    <div class="torso">
      <Arms color="#4b5563" :length="90" :thickness="18" />
      <Body color="rgb(50, 116, 179)" :width="170" :height="210" />
    </div>

    <Legs color="#4b5563" :height="120" />
  </div>
</template>

<script setup lang="ts">
import Head from './HeadPart.vue'
import Body from './BodyPart.vue'
import Arms from './ArmsPart.vue'
import Legs from './LegsPart.vue'

// Definimos el contrato del robot usando los atributos exactos de tus archivos
interface RobotConfig {
  name: string;
  head: {
    color?: string;
    borderRadius?: string;
    size?: number;
    health?: number;
    attack?: number;
    defense?: number;
  };
  body: {
    color?: string;
    width?: number;
    height?: number;
    health?: number;
    attack?: number;
    defense?: number;
  };
  arms: {
    color?: string;
    length?: number;
    thickness?: number;
    health?: number;
    attack?: number;
    defense?: number;
  };
  legs: {
    color?: string;
    width?: number;
    height?: number;
    gap?: number;
    health?: number;
    attack?: number;
    defense?: number;
  };
}

const props = defineProps<{
  config: RobotConfig
}>()
</script>

<style scoped>
.robot {
  position: relative;
  width: 220px;
  margin: 40px auto;
  color: rgb(50, 116, 179);
}

.torso {
  position: relative;
}
</style>
