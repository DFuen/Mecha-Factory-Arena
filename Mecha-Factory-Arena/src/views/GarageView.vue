<template>
  <main class="garage-view">
    <header class="garage-view__header">
      <div>
        <h1>Garage</h1>
        <p>Configura tu robot antes de entrar a la arena.</p>
      </div>
    </header>

    <section class="garage-view__content">
      <WorkshopPanel
        :robot-name="robotStore.robotName"
        :budget="robotStore.budget"
        :spent="robotStore.spent"
        :remaining="robotStore.remaining"
        :error-message="robotStore.errorMessage"
        :parts="robotStore.parts"
        :selected-ids="robotStore.selectedIds"
        @update:robotName="robotStore.setRobotName"
        @update:budget="robotStore.setBudget"
        @togglePart="robotStore.togglePart"
      />

      <div class="garage-view__preview">
        <RobotPreview :config="robotConfig" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WorkshopPanel from '../components/WorkshopPanel.vue'
import RobotPreview from '../components/RobotPreview.vue'
import { useRobotStore } from '../stores/robot'

const robotStore = useRobotStore()

const robotConfig = computed(() => ({
  name: robotStore.robotName || 'Centurion',
  head: { color: 'rgb(50, 116, 179)', size: 120 },
  body: { color: 'rgb(50, 116, 179)', width: 170, height: 210 },
  arms: { color: '#4b5563', length: 90, thickness: 18 },
  legs: { color: '#4b5563', height: 120 }
}))
</script>

<style scoped>
.garage-view {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.garage-view__header h1 {
  margin-bottom: 6px;
  font-size: 2rem;
}

.garage-view__header p {
  color: #6b7280;
}

.garage-view__content {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 24px;
  align-items: start;
}

.garage-view__preview {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  min-height: 600px;
}
</style>
