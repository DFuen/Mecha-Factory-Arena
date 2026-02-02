<template>
  <main class="arena-view">
    <header class="arena-view__header">
      <div>
        <h1>Arena</h1>
        <p>Prueba el robot y revisa tu configuración final.</p>
      </div>
    </header>

    <section class="arena-view__content">
      <div class="arena-view__preview">
        <RobotPreview :config="robotConfig" />
      </div>

      <aside class="arena-view__summary">
        <h2>Resumen del robot</h2>
        <p class="arena-view__name">
          <strong>Nombre:</strong>
          {{ robotStore.robotName || 'Sin nombre' }}
        </p>

        <div class="arena-view__budget">
          <div>
            <strong>Presupuesto:</strong> {{ robotStore.budget }}
          </div>
          <div>
            <strong>Gastado:</strong> {{ robotStore.spent }}
          </div>
          <div :class="{ warning: robotStore.remaining === 0 }">
            <strong>Restante:</strong> {{ robotStore.remaining }}
          </div>
        </div>

        <div class="arena-view__parts">
          <h3>Componentes activos</h3>
          <ul v-if="robotStore.selectedParts.length" class="arena-view__parts-list">
            <li v-for="part in robotStore.selectedParts" :key="part.id">
              <span>{{ part.name }}</span>
              <span>{{ part.cost }}</span>
            </li>
          </ul>
          <p v-else class="arena-view__empty">No hay componentes seleccionados.</p>
        </div>

        <button class="arena-view__cta">Iniciar combate</button>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import RobotPreview from '../components/RobotPreview.vue'
import { computed } from 'vue'
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
.arena-view {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.arena-view__header h1 {
  margin-bottom: 6px;
  font-size: 2rem;
}

.arena-view__header p {
  color: #6b7280;
}

.arena-view__content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.arena-view__preview {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  min-height: 600px;
}

.arena-view__summary {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.arena-view__budget {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f3f4f6;
  font-weight: 600;
}

.arena-view__budget .warning {
  color: #b91c1c;
}

.arena-view__parts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.arena-view__parts-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.arena-view__empty {
  color: #6b7280;
}

.arena-view__cta {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}
</style>
