<template>
  <div class="arena-container">
    <h1>🏟️ La Arena</h1>

    <!-- Estado: Sin combate -->
    <div v-if="store.gameState === 'idle'" class="lobby">
      <div class="robot-check">
        <h2>Estado del Robot</h2>
        <div v-if="store.isReadyToFight" class="ready">
          <p>✅ <strong>{{ store.robotName }}</strong> está listo para combatir</p>
          <div class="stats-display">
            <span>❤️ Vida: {{ store.totalHealth }}</span>
            <span>⚔️ Ataque: {{ store.totalAttack }}</span>
            <span>⚡ Velocidad: {{ store.totalSpeed }}</span>
          </div>
        </div>
        <div v-else class="not-ready">
          <p>❌ Robot incompleto. Vuelve al taller para equipar todas las piezas.</p>
        </div>
      </div>

      <div v-if="store.isReadyToFight" class="enemy-selection">
        <h2>Selecciona tu Oponente</h2>
        <div class="enemies-grid">
          <button 
            v-for="enemigo in enemigos" 
            :key="enemigo.id"
            @click="iniciarCombate(enemigo)"
            class="enemy-card"
          >
            <h3>{{ enemigo.name }}</h3>
            <div class="enemy-stats">
              <span>❤️ {{ enemigo.health }}</span>
              <span>⚔️ {{ enemigo.attack }}</span>
              <span>⚡ {{ enemigo.speed }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Estado: Combate activo -->
    <div v-if="store.gameState === 'combat'" class="combat-arena">
      <div class="combat-header">
        <div class="player-info">
          <h3>{{ store.robotName }}</h3>
          <div class="health-bar">
            <div 
              class="health-fill player-health" 
              :style="{ width: (store.playerCurrentHealth / store.totalHealth * 100) + '%' }"
            ></div>
          </div>
          <p>{{ store.playerCurrentHealth }} / {{ store.totalHealth }} HP</p>
        </div>

        <div class="vs-indicator">VS</div>

        <div class="enemy-info">
          <h3>{{ store.enemy?.name }}</h3>
          <div class="health-bar">
            <div 
              class="health-fill enemy-health" 
              :style="{ width: (store.enemy ? store.enemy.health / store.enemy.maxHealth * 100 : 0) + '%' }"
            ></div>
          </div>
          <p>{{ store.enemy?.health }} / {{ store.enemy?.maxHealth }} HP</p>
        </div>
      </div>

      <div class="turn-indicator">
        <p v-if="store.turn === 'player'" class="player-turn">🎮 Tu Turno</p>
        <p v-else class="enemy-turn">🤖 Turno del Enemigo</p>
      </div>

      <div class="combat-actions">
        <button 
          @click="store.atacar()" 
          :disabled="store.turn !== 'player'"
          class="action-btn attack-btn"
        >
          ⚔️ Atacar
        </button>
        <button 
          @click="store.curar()" 
          :disabled="store.turn !== 'player'"
          class="action-btn heal-btn"
        >
          🔧 Reparar (30%)
        </button>
      </div>

      <div class="combat-log">
        <h3>Registro de Combate</h3>
        <div class="log-entries">
          <div 
            v-for="log in store.combatLog" 
            :key="log.id"
            :class="['log-entry', `log-${log.type}`]"
          >
            {{ log.message }}
          </div>
        </div>
      </div>
    </div>

    <!-- Estado: Victoria -->
    <div v-if="store.gameState === 'victory'" class="result victory">
      <h2>🎉 ¡VICTORIA!</h2>
      <p>Has derrotado a {{ store.enemy?.name }}</p>
      <button @click="store.endCombat()" class="result-btn">
        Volver al Lobby
      </button>
    </div>

    <!-- Estado: Derrota -->
    <div v-if="store.gameState === 'defeat'" class="result defeat">
      <h2>💀 DERROTA</h2>
      <p>{{ store.enemy?.name }} te ha destruido</p>
      <button @click="store.endCombat()" class="result-btn">
        Volver al Lobby
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'
import type { Enemy } from '@/interfaces/RobotInterfaces'

const store = useGameStore()

// Lista de enemigos (más adelante se cargará dinámicamente desde enemies.json)
const enemigos: Enemy[] = [
  {
    id: 'enemy_1',
    name: 'Dron de Entrenamiento',
    health: 100,
    maxHealth: 100,
    attack: 15,
    speed: 20
  },
  {
    id: 'enemy_2',
    name: 'Guardia Mk-I',
    health: 150,
    maxHealth: 150,
    attack: 25,
    speed: 30
  },
  {
    id: 'enemy_3',
    name: 'Centinela Pesado',
    health: 200,
    maxHealth: 200,
    attack: 35,
    speed: 25
  }
]

const iniciarCombate = (enemigo: Enemy) => {
  store.startCombat(enemigo)
}
</script>

<style scoped>
.arena-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

/* LOBBY */
.lobby {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.robot-check {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
}

.ready {
  color: #059669;
}

.not-ready {
  color: #dc2626;
}

.stats-display {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.enemies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.enemy-card {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.enemy-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
}

.enemy-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* COMBATE */
.combat-arena {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.combat-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
}

.player-info, .enemy-info {
  text-align: center;
}

.vs-indicator {
  font-size: 2rem;
  font-weight: bold;
  color: #ef4444;
}

.health-bar {
  width: 100%;
  height: 30px;
  background: #e5e7eb;
  border-radius: 15px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.health-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.player-health {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.enemy-health {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.turn-indicator {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
}

.player-turn {
  color: #2563eb;
}

.enemy-turn {
  color: #dc2626;
}

.combat-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.action-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.attack-btn {
  background: #ef4444;
  color: white;
}

.attack-btn:hover:not(:disabled) {
  background: #dc2626;
  transform: scale(1.05);
}

.heal-btn {
  background: #22c55e;
  color: white;
}

.heal-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: scale(1.05);
}

.combat-log {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  animation: fadeIn 0.3s;
}

.log-player {
  background: #dbeafe;
  color: #1e40af;
}

.log-enemy {
  background: #fee2e2;
  color: #991b1b;
}

.log-system {
  background: #fef3c7;
  color: #92400e;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESULTADOS */
.result {
  text-align: center;
  padding: 3rem;
  border-radius: 16px;
}

.victory {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.defeat {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.result h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.result-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  background: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.result-btn:hover {
  transform: scale(1.1);
}
</style>
