<template>
  <div class="robot">
    <Head color="#fca5a5" :size="120" />

    <div class="torso">
      <Arms color="#4b5563" :length="90" :thickness="18" />
      <Body color="#93c5fd" :width="170" :height="210" />
    </div>

    <Legs color="#4b5563" :height="120" />
  </div>
</template>

<script setup lang="ts">
import Head from './HeadPart.vue'
import Body from './BodyPart.vue'
import Arms from './ArmsPart.vue'
import Legs from './LegsPart.vue'
</script>

<style scoped>
.robot {
  position: relative;
  width: 220px;
  margin: 40px auto;
}

.torso {
  position: relative;
}
</style>
