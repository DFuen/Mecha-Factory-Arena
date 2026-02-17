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

      <div class="budget">
        <div :class="{ warning: money < 200 }">
          <strong>Presupuesto Disponible:</strong> {{ money }} €
        </div>
      </div>
    </div>

    <div class="parts">
      <h3>Componentes Disponibles</h3>
      <ul class="parts__list">
        <li v-for="part in parts" :key="part.id" class="parts__item">
          
          <div class="parts__info">
            <span class="parts__name">{{ part.name }}</span>
            <span class="parts__cost">{{ part.cost }} €</span>
            <small style="color:#888">({{ part.type }})</small> 
          </div>

          <button
            class="parts__action"
            :class="{ selected: isSelected(part) }"
            @click="togglePart(part)"
          >
            {{ isSelected(part) ? 'Quitar' : 'Comprar' }}
          </button>

        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'
import { storeToRefs } from 'pinia'

// 1. Definición de tipos para la lista local
type PartItem = {
  id: string
  name: string
  cost: number
  type: 'head' | 'body' | 'arms' | 'legs'
  stats?: { health: number; attack: number; speed: number }
}

// 2. Conexión con el Store
const store = useGameStore()
const { robot, money, robotName } = storeToRefs(store)

// 3. Datos de las piezas (Hardcoded para este ejemplo)
const parts: PartItem[] = [
  { id: 'head_basic', name: 'Cabeza Básica', cost: 200, type: 'head' },
  { id: 'body_steel', name: 'Cuerpo de Acero', cost: 350, type: 'body' },
  { id: 'arms_hydraulic', name: 'Brazos Hidráulicos', cost: 250, type: 'arms' },
  { id: 'legs_turbo', name: 'Piernas Turbo', cost: 300, type: 'legs' }
]

// 4. Lógica Visual (¿Está comprado?)
// Comparamos si la pieza que hay en el store (robot.head) tiene el mismo ID que la de la lista
const isSelected = (part: PartItem) => {
  const equippedPart = robot.value[part.type]
  return equippedPart?.id === part.id
}

// 5. Acción de compra/venta
const togglePart = (part: PartItem) => {
  // Si ya la tengo puesta, la quito (vender)
  if (isSelected(part)) {
    store.removePart(part.type)
    return
  }

  // Si intento comprar pero no tengo dinero
  if (money.value < part.cost) {
    alert("❌ Fondos insuficientes para comprar esta pieza.")
    return
  }

  // Si todo bien, comprar
  store.equipPart(part, part.type)
}
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
  font-size: 1.1rem;
}

.budget .warning {
  color: #b91c1c; /* Rojo si queda poco dinero */
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
  background: #2563eb; /* Azul para comprar */
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.parts__action:hover {
  background: #1d4ed8;
}

/* Estilo rojo cuando el botón es "Quitar" */
.parts__action.selected {
  background: #ef4444; 
}
.parts__action.selected:hover {
  background: #dc2626;
}
</style>