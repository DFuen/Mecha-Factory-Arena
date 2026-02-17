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
            <div class="parts__stats">
              <small>❤️ {{ part.health }} | ⚔️ {{ part.attack }} | ⚡ {{ part.speed }}</small>
            </div>
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
import type { Part } from '@/interfaces/RobotInterfaces'

// Conexión con el Store
const store = useGameStore()
const { robot, money, robotName } = storeToRefs(store)

// Datos de las piezas (deberían cargarse dinámicamente con Axios más adelante)
const parts: Part[] = [
  { id: 'head_basic', name: 'Cabeza Básica', cost: 200, health: 30, attack: 5, speed: 10 },
  { id: 'body_steel', name: 'Cuerpo de Acero', cost: 350, health: 80, attack: 10, speed: 5 },
  { id: 'arms_hydraulic', name: 'Brazos Hidráulicos', cost: 250, health: 20, attack: 40, speed: 15 },
  { id: 'legs_turbo', name: 'Piernas Turbo', cost: 300, health: 25, attack: 8, speed: 35 }
]

// Determinar el tipo de pieza según su ID
const getPartType = (part: Part): 'head' | 'body' | 'arms' | 'legs' => {
  if (part.id.startsWith('head')) return 'head'
  if (part.id.startsWith('body')) return 'body'
  if (part.id.startsWith('arms')) return 'arms'
  return 'legs'
}

// Lógica Visual (¿Está comprado?)
const isSelected = (part: Part) => {
  const type = getPartType(part)
  const equippedPart = robot.value[type]
  return equippedPart?.id === part.id
}

// Acción de compra/venta
const togglePart = (part: Part) => {
  const type = getPartType(part)
  
  // Si ya la tengo puesta, la quito (vender)
  if (isSelected(part)) {
    store.removePart(type)
    return
  }

  // Si intento comprar pero no tengo dinero
  if (money.value < part.cost) {
    alert("❌ Fondos insuficientes para comprar esta pieza.")
    return
  }

  // Si todo bien, comprar
  store.equipPart(part, type)
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
  flex: 1;
}

.parts__name {
  font-weight: 600;
}

.parts__cost {
  color: #6b7280;
  font-size: 0.9rem;
}

.parts__stats {
  font-size: 0.85rem;
  color: #059669;
  font-weight: 600;
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