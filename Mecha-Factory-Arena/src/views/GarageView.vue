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

      <div class="garage-view__right">
        <div class="garage-view__preview">
          <RobotPreview :config="robotConfig" />
        </div>

        <div class="garage-view__stats">
          <h3>Estadísticas del Robot</h3>
          <div class="stats-grid">
            <div class="stat-item stat-item--health">
              <span class="stat-item__icon">❤️</span>
              <span class="stat-item__value">{{ robotStore.totalStats.health }}</span>
            </div>
            <div class="stat-item stat-item--attack">
              <span class="stat-item__icon">⚔️</span>
              <span class="stat-item__value">{{ robotStore.totalStats.attack }}</span>
            </div>
            <div class="stat-item stat-item--defense">
              <span class="stat-item__icon">🛡️</span>
              <span class="stat-item__value">{{ robotStore.totalStats.defense }}</span>
            </div>
            <div class="stat-item stat-item--speed">
              <span class="stat-item__icon">⚡</span>
              <span class="stat-item__value">{{ robotStore.totalStats.speed }}</span>
            </div>
          </div>
          <p v-if="robotStore.selectedParts.length === 0" class="stats-empty">
            Selecciona componentes para ver las estadísticas
          </p>
        </div>
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

.garage-view__right {
  display: grid;
  gap: 24px;
}

.garage-view__preview {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  min-height: 600px;
}

.garage-view__stats {
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.garage-view__stats h3 {
  margin-bottom: 16px;
  font-size: 1.4rem;
  color: #0f172a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item--health {
  border-color: #fee2e2;
  background: #fef2f2;
}

.stat-item--attack {
  border-color: #fed7aa;
  background: #fff7ed;
}

.stat-item--defense {
  border-color: #dbeafe;
  background: #eff6ff;
}

.stat-item--speed {
  border-color: #e9d5ff;
  background: #faf5ff;
}

.stat-item__icon {
  font-size: 2rem;
}

.stat-item__value {
  font-size: 1.8rem;
  font-weight: 700;
}

.stat-item--health .stat-item__value {
  color: #ef4444;
}

.stat-item--attack .stat-item__value {
  color: #f59e0b;
}

.stat-item--defense .stat-item__value {
  color: #3b82f6;
}

.stat-item--speed .stat-item__value {
  color: #8b5cf6;
}

.stats-empty {
  color: #9ca3af;
  text-align: center;
  padding: 16px;
  font-style: italic;
}
</style>
