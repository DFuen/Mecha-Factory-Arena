<template>
  <main class="combat-view">
    <header class="combat-view__header">
      <h1>Combate</h1>
      <p v-if="!combatStore.combatInProgress">Prepárate para la batalla</p>
      <p v-else-if="combatStore.winner">
        {{ combatStore.winner === 'player' ? '¡Victoria!' : '¡Derrota!' }}
      </p>
      <p v-else>{{ combatStore.isPlayerTurn ? 'Tu turno' : 'Turno del enemigo' }}</p>
    </header>

    <section class="combat-view__arena">
      <div class="fighter fighter--player">
        <div class="fighter__robot">
          <RobotPreview :config="playerRobotConfig" />
        </div>
        <div class="fighter__info">
          <h3>{{ combatStore.player.name }}</h3>
          <div class="fighter__stats">
            <div class="fighter-stat fighter-stat--health">
              <span class="fighter-stat__icon">❤️</span>
              <span class="fighter-stat__value">{{ combatStore.player.maxHealth }}</span>
            </div>
            <div class="fighter-stat fighter-stat--attack">
              <span class="fighter-stat__icon">⚔️</span>
              <span class="fighter-stat__value">{{ combatStore.player.attack }}</span>
            </div>
            <div class="fighter-stat fighter-stat--defense">
              <span class="fighter-stat__icon">🛡️</span>
              <span class="fighter-stat__value">{{ combatStore.player.defense }}</span>
            </div>
            <div class="fighter-stat fighter-stat--speed">
              <span class="fighter-stat__icon">⚡</span>
              <span class="fighter-stat__value">{{ combatStore.player.speed }}</span>
            </div>
          </div>
          <div class="fighter__health-bar">
            <div
              class="fighter__health-fill fighter__health-fill--player"
              :style="{ width: combatStore.playerHealthPercent + '%' }"
            ></div>
          </div>
          <div class="fighter__health-text">
            {{ combatStore.player.health }} / {{ combatStore.player.maxHealth }}
          </div>
        </div>
      </div>

      <div class="combat-view__vs">VS</div>

      <div class="fighter fighter--enemy">
        <div class="fighter__robot">
          <RobotPreview :config="enemyRobotConfig" />
        </div>
        <div class="fighter__info">
          <h3>{{ combatStore.enemy.name }}</h3>
          <div class="fighter__stats">
            <div class="fighter-stat fighter-stat--health">
              <span class="fighter-stat__icon">❤️</span>
              <span class="fighter-stat__value">{{ combatStore.enemy.maxHealth }}</span>
            </div>
            <div class="fighter-stat fighter-stat--attack">
              <span class="fighter-stat__icon">⚔️</span>
              <span class="fighter-stat__value">{{ combatStore.enemy.attack }}</span>
            </div>
            <div class="fighter-stat fighter-stat--defense">
              <span class="fighter-stat__icon">🛡️</span>
              <span class="fighter-stat__value">{{ combatStore.enemy.defense }}</span>
            </div>
            <div class="fighter-stat fighter-stat--speed">
              <span class="fighter-stat__icon">⚡</span>
              <span class="fighter-stat__value">{{ combatStore.enemy.speed }}</span>
            </div>
          </div>
          <div class="fighter__health-bar">
            <div
              class="fighter__health-fill fighter__health-fill--enemy"
              :style="{ width: combatStore.enemyHealthPercent + '%' }"
            ></div>
          </div>
          <div class="fighter__health-text">
            {{ combatStore.enemy.health }} / {{ combatStore.enemy.maxHealth }}
          </div>
        </div>
      </div>
    </section>

    <section class="combat-view__controls">
      <button
        v-if="!combatStore.combatInProgress"
        @click="handleBackToArena"
        class="btn btn--primary"
      >
        Volver a Arena
      </button>
      <div v-else-if="combatStore.winner" class="combat-view__controls-row">
        <button @click="handleRematch" class="btn btn--primary">Revancha</button>
        <button @click="handleBackToArena" class="btn btn--ghost">Volver a Arena</button>
      </div>
      <button
        v-else
        @click="handleAttack"
        :disabled="!combatStore.isPlayerTurn"
        class="btn btn--attack"
      >
        {{ combatStore.isPlayerTurn ? 'Atacar' : 'Esperando...' }}
      </button>
    </section>

    <section class="combat-view__log">
      <h3>Registro de Combate</h3>
      <div class="log-container">
        <div
          v-for="entry in combatStore.combatLog"
          :key="entry.id"
          class="log-entry"
          :class="`log-entry--${entry.type}`"
        >
          {{ entry.message }}
        </div>
        <div v-if="combatStore.combatLog.length === 0" class="log-empty">
          El registro de combate aparecerá aquí...
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCombatStore } from '../stores/combat'
import { useRobotStore } from '../stores/robot'
import RobotPreview from '../components/RobotPreview.vue'

const combatStore = useCombatStore()
const robotStore = useRobotStore()
const router = useRouter()

const playerRobotConfig = computed(() => ({
  name: robotStore.robotName || 'Tu Robot',
  head: { color: 'rgb(50, 116, 179)', size: 120 },
  body: { color: 'rgb(50, 116, 179)', width: 170, height: 210 },
  arms: { color: '#4b5563', length: 90, thickness: 18 },
  legs: { color: '#4b5563', height: 120 }
}))

const enemyRobotConfig = computed(() => ({
  name: 'Enemigo',
  head: { color: 'rgb(220, 38, 38)', size: 120 },
  body: { color: 'rgb(220, 38, 38)', width: 170, height: 210 },
  arms: { color: '#7f1d1d', length: 90, thickness: 18 },
  legs: { color: '#7f1d1d', height: 120 }
}))

const handleStartCombat = () => {
  const baseStats = {
    health: 100,
    attack: 15,
    defense: 8,
    speed: 10
  }

  combatStore.startCombat(
    {
      name: robotStore.robotName || 'Tu Robot',
      maxHealth: baseStats.health + robotStore.totalStats.health,
      attack: baseStats.attack + robotStore.totalStats.attack,
      defense: baseStats.defense + robotStore.totalStats.defense,
      speed: baseStats.speed + robotStore.totalStats.speed,
      color: 'rgb(50, 116, 179)'
    },
    {
      name: 'Robot Enemigo',
      maxHealth: 120,
      attack: 18,
      defense: 10,
      speed: 12,
      color: 'rgb(220, 38, 38)'
    }
  )
}

const handleAttack = () => {
  combatStore.attack('player')
}

const handleRematch = () => {
  combatStore.resetCombat()
  handleStartCombat()
}

const handleBackToArena = async () => {
  combatStore.resetCombat()
  await router.push({ name: 'arena' })
}
</script>

<style scoped>
.combat-view {
  display: grid;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.combat-view__header {
  text-align: center;
}

.combat-view__header h1 {
  margin-bottom: 8px;
  font-size: 2.5rem;
  color: #0f172a;
}

.combat-view__header p {
  font-size: 1.2rem;
  color: #6b7280;
}

.combat-view__arena {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: center;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
}

.fighter {
  display: grid;
  gap: 16px;
}

.fighter__robot {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fighter__robot :deep(.robot) {
  margin-top: 0;
}

.fighter__info {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
}

.fighter__info h3 {
  margin-bottom: 12px;
  font-size: 1.3rem;
  text-align: center;
}

.fighter__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.fighter-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 2px solid transparent;
  background: #f9fafb;
}

.fighter-stat__icon {
  font-size: 1.4rem;
}

.fighter-stat__value {
  font-size: 1.2rem;
  font-weight: 700;
}

.fighter-stat--health {
  border-color: #fee2e2;
  background: #fef2f2;
}

.fighter-stat--attack {
  border-color: #fed7aa;
  background: #fff7ed;
}

.fighter-stat--defense {
  border-color: #dbeafe;
  background: #eff6ff;
}

.fighter-stat--speed {
  border-color: #e9d5ff;
  background: #faf5ff;
}

.fighter-stat--health .fighter-stat__value {
  color: #ef4444;
}

.fighter-stat--attack .fighter-stat__value {
  color: #f59e0b;
}

.fighter-stat--defense .fighter-stat__value {
  color: #3b82f6;
}

.fighter-stat--speed .fighter-stat__value {
  color: #8b5cf6;
}

.fighter__health-bar {
  height: 24px;
  border-radius: 12px;
  background: #e5e7eb;
  overflow: hidden;
  margin-bottom: 8px;
}

.fighter__health-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.fighter__health-fill--player {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.fighter__health-fill--enemy {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.fighter__health-text {
  text-align: center;
  font-weight: 600;
  color: #374151;
}

.combat-view__vs {
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.combat-view__controls {
  display: flex;
  justify-content: center;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--primary {
  background: #0f172a;
  color: #ffffff;
}

.btn--primary:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}

.btn--attack {
  background: #dc2626;
  color: #ffffff;
}

.btn--attack:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.btn--attack:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.combat-view__log {
  padding: 20px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.combat-view__log h3 {
  margin-bottom: 12px;
  font-size: 1.3rem;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  gap: 8px;
}

.log-entry {
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 4px solid;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-entry--info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.log-entry--attack {
  background: #fef2f2;
  border-color: #ef4444;
}

.log-entry--victory {
  background: #f0fdf4;
  border-color: #22c55e;
  font-weight: 600;
}

.log-entry--defeat {
  background: #fef2f2;
  border-color: #dc2626;
  font-weight: 600;
}

.log-empty {
  color: #9ca3af;
  text-align: center;
  padding: 20px;
}
</style>
