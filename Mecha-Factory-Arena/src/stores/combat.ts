import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Fighter {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  speed: number
  color: string
}

export interface CombatLog {
  id: number
  message: string
  type: 'info' | 'attack' | 'victory' | 'defeat'
}

export const useCombatStore = defineStore('combat', () => {
  const player = ref<Fighter>({
    id: 'player',
    name: 'Tu Robot',
    health: 100,
    maxHealth: 100,
    attack: 20,
    defense: 10,
    speed: 10,
    color: 'rgb(50, 116, 179)'
  })

  const enemy = ref<Fighter>({
    id: 'enemy',
    name: 'Enemigo',
    health: 100,
    maxHealth: 100,
    attack: 18,
    defense: 8,
    speed: 8,
    color: 'rgb(220, 38, 38)'
  })

  const currentTurn = ref<'player' | 'enemy'>('player')
  const combatLog = ref<CombatLog[]>([])
  const combatInProgress = ref(false)
  const winner = ref<string | null>(null)
  const logIdCounter = ref(0)

  const isPlayerTurn = computed(() => currentTurn.value === 'player')
  const playerHealthPercent = computed(() => (player.value.health / player.value.maxHealth) * 100)
  const enemyHealthPercent = computed(() => (enemy.value.health / enemy.value.maxHealth) * 100)

  const addLog = (message: string, type: CombatLog['type'] = 'info') => {
    combatLog.value.push({
      id: logIdCounter.value++,
      message,
      type
    })
  }

  const calculateDamage = (attacker: Fighter, defender: Fighter): number => {
    const baseDamage = attacker.attack
    const reducedDamage = Math.max(1, baseDamage - defender.defense)
    const variance = Math.random() * 0.2 - 0.1 // ±10% variación
    return Math.round(reducedDamage * (1 + variance))
  }

  const attack = (attackerId: 'player' | 'enemy') => {
    if (!combatInProgress.value || winner.value) return

    const attacker = attackerId === 'player' ? player.value : enemy.value
    const defender = attackerId === 'player' ? enemy.value : player.value

    const damage = calculateDamage(attacker, defender)
    defender.health = Math.max(0, defender.health - damage)

    addLog(
      `${attacker.name} ataca a ${defender.name} causando ${damage} de daño.`,
      'attack'
    )

    // Verificar si hay ganador
    if (defender.health <= 0) {
      winner.value = attacker.id
      addLog(`¡${attacker.name} ha ganado el combate!`, 'victory')
      combatInProgress.value = false
      return
    }

    // Cambiar turno
    currentTurn.value = attackerId === 'player' ? 'enemy' : 'player'

    // Si es turno del enemigo, atacar automáticamente después de un delay
    if (currentTurn.value === 'enemy') {
      setTimeout(() => {
        if (combatInProgress.value && !winner.value) {
          attack('enemy')
        }
      }, 1200)
    }
  }

  const startCombat = (playerStats?: Partial<Fighter>, enemyStats?: Partial<Fighter>) => {
    // Resetear estado
    player.value = {
      id: 'player',
      name: playerStats?.name || 'Tu Robot',
      health: playerStats?.maxHealth || 100,
      maxHealth: playerStats?.maxHealth || 100,
      attack: playerStats?.attack || 20,
      defense: playerStats?.defense || 10,
      speed: playerStats?.speed || 10,
      color: playerStats?.color || 'rgb(50, 116, 179)'
    }

    enemy.value = {
      id: 'enemy',
      name: enemyStats?.name || 'Enemigo',
      health: enemyStats?.maxHealth || 100,
      maxHealth: enemyStats?.maxHealth || 100,
      attack: enemyStats?.attack || 18,
      defense: enemyStats?.defense || 8,
      speed: enemyStats?.speed || 8,
      color: enemyStats?.color || 'rgb(220, 38, 38)'
    }

    currentTurn.value = 'player'
    combatLog.value = []
    logIdCounter.value = 0
    winner.value = null
    combatInProgress.value = true

    addLog('¡El combate ha comenzado!', 'info')
  }

  const resetCombat = () => {
    combatInProgress.value = false
    winner.value = null
    combatLog.value = []
    currentTurn.value = 'player'
  }

  return {
    player,
    enemy,
    currentTurn,
    combatLog,
    combatInProgress,
    winner,
    isPlayerTurn,
    playerHealthPercent,
    enemyHealthPercent,
    attack,
    startCombat,
    resetCombat
  }
})
