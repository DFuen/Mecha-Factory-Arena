<template>
  <div class="robot">
    <Head
      color="#fca5a5"
      :size="120"
      :active="selectedPart === 'head'"
      @select="selectedPart = 'head'"
    />

    <div class="torso">
      <Arms
        color="#4b5563"
        :length="90"
        :thickness="30"
        :active="selectedPart === 'arms'"
        @select="selectedPart = 'arms'"
      />

      <Body
        color="#93c5fd"
        :width="170"
        :height="210"
        :active="selectedPart === 'body'"
        @select="selectedPart = 'body'"
      />
    </div>

    <Legs
      color="#4b5563"
      :height="120"
      :active="selectedPart === 'legs'"
      @select="selectedPart = 'legs'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Head from './HeadPart.vue'
import Body from './BodyPart.vue'
import Arms from './ArmsPart.vue'
import Legs from './LegsPart.vue'

const selectedPart = ref<string | null>(null)
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
