import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Part, RobotSelection, Enemy, CombatLog, GameState } from '@/interfaces/RobotInterfaces'

export const useGameStore = defineStore('game', () => {
  
  // --- STATE (Estado Global) ---
  // Aquí guardamos los datos que deben sobrevivir al cambio de página
  const robot = ref<RobotSelection>({
    head: null,
    body: null,
    arms: null,
    legs: null
  })

  const robotName = ref('Mi Robot') // Nombre del robot
  const money = ref(2000) // Presupuesto inicial

  // --- ESTADO DE COMBATE ---
  const gameState = ref<GameState>('idle')
  const playerCurrentHealth = ref(0) // Vida actual del jugador en combate
  const enemy = ref<Enemy | null>(null) // Enemigo actual
  const combatLog = ref<CombatLog[]>([]) // Registro de acciones de combate
  const turn = ref<'player' | 'enemy'>('player') // Turno actual

  // --- GETTERS (Cálculos Automáticos) ---
  // Migramos tu lógica de 'useRobotStats' aquí dentro.
  // Ahora cualquier componente puede saber la vida total sin calcularla.
  const totalHealth = computed(() => {
    return (robot.value.head?.health ?? 0) + 
           (robot.value.body?.health ?? 0) + 
           (robot.value.arms?.health ?? 0) + 
           (robot.value.legs?.health ?? 0)
  })

  const totalAttack = computed(() => {
    return (robot.value.head?.attack ?? 0) + 
           (robot.value.body?.attack ?? 0) + 
           (robot.value.arms?.attack ?? 0) + 
           (robot.value.legs?.attack ?? 0)
  })

  const totalSpeed = computed(() => {
    return (robot.value.head?.speed ?? 0) + 
           (robot.value.body?.speed ?? 0) + 
           (robot.value.arms?.speed ?? 0) + 
           (robot.value.legs?.speed ?? 0)
  })

  // Validador (reutilizando tu lógica de navegación)
  const isReadyToFight = computed(() => {
    return robot.value.head && robot.value.body && robot.value.arms && robot.value.legs
  })

  // --- ACTIONS (Funciones para modificar el estado) ---
  
  // Función para comprar/equipar una pieza
  function equipPart(part: Part, type: 'head' | 'body' | 'arms' | 'legs') {
    // 1. Si ya había una pieza, reembolsamos su valor (opcional)
    if (robot.value[type]) {
      money.value += robot.value[type]!.cost
    }

    // 2. Verificamos si tenemos dinero para la nueva
    if (money.value >= part.cost) {
      money.value -= part.cost
      robot.value[type] = part // Guardamos la pieza
    } else {
      console.warn("No tienes suficiente dinero")
      // Aquí podrías lanzar una alerta o error
    }
  }

  // Función para quitar/vender una pieza
  function removePart(type: 'head' | 'body' | 'arms' | 'legs') {
    if (robot.value[type]) {
      money.value += robot.value[type]!.cost // Reembolsamos el dinero
      robot.value[type] = null // Quitamos la pieza
    }
  }

  // Función para resetear (vender todo)
  function resetRobot() {
    robot.value = { head: null, body: null, arms: null, legs: null }
    money.value = 2000
  }

  // --- ACCIONES DE COMBATE ---

  // Iniciar un combate contra un enemigo
  function startCombat(enemyData: Enemy) {
    if (!isReadyToFight.value) {
      console.warn('El robot no está completo')
      return false
    }

    gameState.value = 'combat'
    playerCurrentHealth.value = totalHealth.value
    enemy.value = { ...enemyData }
    combatLog.value = []
    
    // El que tenga más velocidad ataca primero
    turn.value = totalSpeed.value >= enemy.value.speed ? 'player' : 'enemy'
    
    addLog(`¡Combate iniciado contra ${enemy.value.name}!`, 'system')
    
    // Si el enemigo es más rápido, que ataque primero automáticamente
    if (turn.value === 'enemy') {
      setTimeout(() => turnoIA(), 1000)
    }
    
    return true
  }

  // Acción: Atacar al enemigo
  function atacar() {
    if (gameState.value !== 'combat' || turn.value !== 'player' || !enemy.value) {
      return
    }

    // Cálculo de daño: ataque base ± variación aleatoria (80%-120%)
    const variacion = 0.8 + Math.random() * 0.4
    const danio = Math.round(totalAttack.value * variacion)
    
    enemy.value.health -= danio
    addLog(`${robotName.value} ataca y causa ${danio} de daño`, 'player')

    // Verificar si el enemigo murió
    if (enemy.value.health <= 0) {
      enemy.value.health = 0
      gameState.value = 'victory'
      addLog(`¡Victoria! Has derrotado a ${enemy.value.name}`, 'system')
      return
    }

    // Cambiar turno
    turn.value = 'enemy'
    
    // Turno automático de la IA después de 1.5 segundos
    setTimeout(() => turnoIA(), 1500)
  }

  // Acción: Curarse
  function curar() {
    if (gameState.value !== 'combat' || turn.value !== 'player') {
      return
    }

    // Curación: 30% de la vida máxima
    const curacion = Math.round(totalHealth.value * 0.3)
    const vidaAntes = playerCurrentHealth.value
    playerCurrentHealth.value = Math.min(playerCurrentHealth.value + curacion, totalHealth.value)
    const vidaCurada = playerCurrentHealth.value - vidaAntes

    addLog(`${robotName.value} se repara y recupera ${vidaCurada} HP`, 'player')

    // Cambiar turno
    turn.value = 'enemy'
    
    // Turno automático de la IA después de 1.5 segundos
    setTimeout(() => turnoIA(), 1500)
  }

  // Turno de la IA (enemigo)
  function turnoIA() {
    if (gameState.value !== 'combat' || turn.value !== 'enemy' || !enemy.value) {
      return
    }

    // IA simple: 70% atacar, 30% curarse (solo si tiene menos del 50% de vida)
    const probability = Math.random()
    const lowHealth = enemy.value.health < enemy.value.maxHealth * 0.5

    if (lowHealth && probability > 0.7) {
      // El enemigo se cura
      const curacion = Math.round(enemy.value.maxHealth * 0.25)
      const vidaAntes = enemy.value.health
      enemy.value.health = Math.min(enemy.value.health + curacion, enemy.value.maxHealth)
      const vidaCurada = enemy.value.health - vidaAntes

      addLog(`${enemy.value.name} se repara y recupera ${vidaCurada} HP`, 'enemy')
    } else {
      // El enemigo ataca
      const variacion = 0.8 + Math.random() * 0.4
      const danio = Math.round(enemy.value.attack * variacion)
      
      playerCurrentHealth.value -= danio
      addLog(`${enemy.value.name} ataca y causa ${danio} de daño`, 'enemy')

      // Verificar si el jugador murió
      if (playerCurrentHealth.value <= 0) {
        playerCurrentHealth.value = 0
        gameState.value = 'defeat'
        addLog(`Has sido derrotado por ${enemy.value.name}`, 'system')
        return
      }
    }

    // Devolver el turno al jugador
    turn.value = 'player'
  }

  // Función auxiliar para añadir mensajes al log de combate
  function addLog(message: string, type: 'player' | 'enemy' | 'system') {
    combatLog.value.push({
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: Date.now()
    })
  }

  // Reiniciar el estado de combate
  function endCombat() {
    gameState.value = 'idle'
    playerCurrentHealth.value = 0
    enemy.value = null
    combatLog.value = []
    turn.value = 'player'
  }

  return {
    // Exportamos todo para que los componentes lo usen
    // Estado del robot
    robot,
    robotName,
    money,
    
    // Estadísticas calculadas
    totalHealth,
    totalAttack,
    totalSpeed,
    isReadyToFight,
    
    // Estado de combate
    gameState,
    playerCurrentHealth,
    enemy,
    combatLog,
    turn,
    
    // Acciones del taller
    equipPart,
    removePart,
    resetRobot,
    
    // Acciones de combate
    startCombat,
    atacar,
    curar,
    turnoIA,
    endCombat
  }
})