import { computed, Ref } from 'vue'

export interface Part {
  id: string
  name: string
  cost: number
  health?: number
  attack?: number
  speed?: number
}

export interface RobotSelection {
  head: Part | null
  body: Part | null
  arms: Part | null
  legs: Part | null
}

export interface RobotStats {
  health: number
  attack: number
  speed: number
}

/**
 * Composable para calcular automáticamente las estadísticas del robot
 * basándose en las partes seleccionadas
 */
export function useRobotStats(robotSelection: Ref<RobotSelection>) {
  // Calcula la salud total sumando el health de todas las partes
  const totalHealth = computed(() => {
    const { head, body, arms, legs } = robotSelection.value
    return (head?.health ?? 0) + (body?.health ?? 0) + (arms?.health ?? 0) + (legs?.health ?? 0)
  })

  // Calcula el ataque total sumando el attack de todas las partes
  const totalAttack = computed(() => {
    const { head, body, arms, legs } = robotSelection.value
    return (head?.attack ?? 0) + (body?.attack ?? 0) + (arms?.attack ?? 0) + (legs?.attack ?? 0)
  })

  // Calcula la velocidad total sumando la speed de todas las partes
  const totalSpeed = computed(() => {
    const { head, body, arms, legs } = robotSelection.value
    return (head?.speed ?? 0) + (body?.speed ?? 0) + (arms?.speed ?? 0) + (legs?.speed ?? 0)
  })

  // Retorna un objeto computed con todas las estadísticas
  const stats = computed<RobotStats>(() => ({
    health: totalHealth.value,
    attack: totalAttack.value,
    speed: totalSpeed.value
  }))

  return {
    stats,
    totalHealth,
    totalAttack,
    totalSpeed
  }
}
