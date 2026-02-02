<template>
  <section class="workshop">
    <header class="workshop__header">
      <h2>El Taller</h2>
      <p>Configura tu robot y controla el presupuesto.</p>
    </header>

    <div class="workshop__form">
      <label class="field">
        <span>Nombre del robot</span>
        <input
          :value="robotName"
          type="text"
          placeholder="Ej: Centurion"
          @input="emit('update:robotName', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label class="field">
        <span>Presupuesto inicial</span>
        <input
          :value="budget"
          type="number"
          min="0"
          step="50"
          @input="emit('update:budget', Number(($event.target as HTMLInputElement).value))"
        />
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
            <div class="parts__details">
              <span class="parts__cost">💰 {{ part.cost }}</span>
              <span class="parts__stats">
                <span v-if="part.health">❤️{{ part.health }}</span>
                <span v-if="part.attack">⚔️{{ part.attack }}</span>
                <span v-if="part.defense">🛡️{{ part.defense }}</span>
                <span v-if="part.speed">⚡{{ part.speed }}</span>
              </span>
            </div>
          </div>
          <button
            class="parts__action"
            :class="{ selected: selectedIds.includes(part.id) }"
            @click="emit('togglePart', part)"
          >
            {{ selectedIds.includes(part.id) ? 'Quitar' : 'Agregar' }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
type PartItem = {
  id: string
  name: string
  cost: number
  health?: number
  attack?: number
  defense?: number
  speed?: number
}
const props = defineProps<{
  robotName: string
  budget: number
  spent: number
  remaining: number
  errorMessage: string
  parts: PartItem[]
  selectedIds: string[]
}>()

const emit = defineEmits<{
  (event: 'update:robotName', value: string): void
  (event: 'update:budget', value: number): void
  (event: 'togglePart', value: PartItem): void
}>()
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

.parts__details {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
}

.parts__cost {
  color: #059669;
  font-weight: 600;
}

.parts__stats {
  display: flex;
  gap: 8px;
  color: #6b7280;
}

.parts__stats span {
  font-size: 0.8rem;
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
