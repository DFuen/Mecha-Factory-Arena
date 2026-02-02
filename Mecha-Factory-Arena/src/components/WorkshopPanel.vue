<template>
  <section class="workshop">
    <header class="workshop__header">
      <h2>El Taller</h2>
      <p>Configura tu robot y controla el presupuesto.</p>
    </header>

    <div class="workshop__form">
      <label class="field">
        <span>Nombre del robot</span>
        <input v-model.trim="robotName" type="text" placeholder="Ej: Centurion" />
      </label>

      <label class="field">
        <span>Presupuesto inicial</span>
        <input v-model.number="budget" type="number" min="0" step="50" />
      </label>

      <div class="budget">
        <div>
          <strong>Gastado:</strong> {{ spent }}
        </div>
        <div :class="{ warning: remaining === 0 }">
          <strong>Restante:</strong> {{ remaining }}
        </div>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div class="parts">
      <h3>Componentes</h3>
      <ul class="parts__list">
        <li v-for="part in parts" :key="part.id" class="parts__item">
          <div class="parts__info">
            <span class="parts__name">{{ part.name }}</span>
            <span class="parts__cost">{{ part.cost }}</span>
          </div>
          <button
            class="parts__action"
            :class="{ selected: isSelected(part.id) }"
            @click="togglePart(part)"
          >
            {{ isSelected(part.id) ? 'Quitar' : 'Agregar' }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type PartItem = {
  id: string
  name: string
  cost: number
}

const robotName = ref('')
const budget = ref(1000)
const selectedParts = ref<PartItem[]>([])
const errorMessage = ref('')

const parts: PartItem[] = [
  { id: 'head_basic', name: 'Cabeza básica', cost: 200 },
  { id: 'body_steel', name: 'Cuerpo de acero', cost: 350 },
  { id: 'arms_hydraulic', name: 'Brazos hidráulicos', cost: 250 },
  { id: 'legs_turbo', name: 'Piernas turbo', cost: 300 }
]

const spent = computed(() => selectedParts.value.reduce((total, item) => total + item.cost, 0))
const remaining = computed(() => Math.max(budget.value - spent.value, 0))

const isSelected = (id: string) => selectedParts.value.some((item) => item.id === id)

const togglePart = (part: PartItem) => {
  errorMessage.value = ''

  if (isSelected(part.id)) {
    selectedParts.value = selectedParts.value.filter((item) => item.id !== part.id)
    return
  }

  if (budget.value - spent.value < part.cost) {
    errorMessage.value = 'Presupuesto insuficiente para este componente.'
    return
  }

  selectedParts.value = [...selectedParts.value, part]
}

watch(budget, (value) => {
  if (value < 0) {
    budget.value = 0
  }

  if (value < spent.value) {
    budget.value = spent.value
    errorMessage.value = 'El presupuesto no puede ser menor que lo ya gastado.'
  }
})
</script>

<style scoped>
.workshop {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.workshop__header h2 {
  margin-bottom: 4px;
  font-size: 1.6rem;
}

.workshop__header p {
  color: #6b7280;
}

.workshop__form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.field input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 1rem;
}

.budget {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f3f4f6;
  font-weight: 600;
}

.budget .warning {
  color: #b91c1c;
}

.error {
  color: #dc2626;
  font-weight: 600;
}

.parts__list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 12px;
}

.parts__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.parts__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.parts__name {
  font-weight: 600;
}

.parts__cost {
  color: #6b7280;
  font-size: 0.9rem;
}

.parts__action {
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

.parts__action.selected {
  background: #ef4444;
}
</style>
