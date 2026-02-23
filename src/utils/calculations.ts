import type { Part, Robot, RobotStats } from '../types'

/**
 * Calcular estadísticas totales del robot
 */
export function calculateRobotStats(robot: Robot): RobotStats {
  const stats: RobotStats = {
    health: 0,
    attack: 0,
    speed: 0
  }

  const parts = [robot.head, robot.body, robot.limbs, robot.weapon].filter(
    (p): p is Part => p !== null
  )

  parts.forEach(part => {
    stats.health += part.stats.health
    stats.attack += part.stats.attack
    stats.speed += part.stats.speed
  })

  // Asegurar valores mínimos
  stats.health = Math.max(30, stats.health)
  stats.attack = Math.max(1, stats.attack)
  stats.speed = Math.max(1, stats.speed)

  return stats
}

/**
 * Calcular presupuesto restante
 */
export function calculateRemainingBudget(robot: Robot): number {
  return robot.budget - robot.spentBudget
}

/**
 * Validar que el robot tenga todas las partes necesarias
 */
export function isRobotComplete(robot: Robot): boolean {
  return Boolean(robot.head && robot.body && robot.limbs && robot.weapon)
}

/**
 * Validar que el robot tenga un nombre válido
 */
export function isValidRobotName(name: string): boolean {
  return name.trim().length >= 3 && name.trim().length <= 50
}

/**
 * Calcular daño en combate con variación por tipo de ataque
 * Balanceado para combates más largos
 */
export function calculateDamage(
  attackerStats: RobotStats,
  defenderStats: RobotStats,
  critical: boolean = false,
  isPlayerAttack: boolean = false
): number {
  const variance = 0.88 + Math.random() * 0.20

  // Ofensa y defensa expresadas como rating, no como daño bruto
  const offenseRating = attackerStats.attack * 0.65 + attackerStats.speed * 0.10
  const defenseRating = defenderStats.health * 0.20 + defenderStats.speed * 0.14

  let damage = (offenseRating * variance) - (defenseRating * 0.48)

  if (isPlayerAttack) {
    damage *= 1.05
  }

  // Daño mínimo garantizado: 6% de la vida del defensor
  const chipDamage = Math.max(3, Math.floor(defenderStats.health * 0.06))

  // Tope normal: 18% de la vida del defensor por turno (~6-8 turnos para matar)
  // Tope crítico: 26% de la vida del defensor
  const softCap = Math.floor(defenderStats.health * (critical ? 0.26 : 0.18))

  return Math.min(softCap, Math.max(chipDamage, Math.floor(damage)))
}

/**
 * Calcular probabilidad de golpe crítico
 */
export function isCriticalHit(speed: number): boolean {
  const critChance = Math.min(0.28, 0.04 + speed / 220)
  return Math.random() < critChance
}

/**
 * Simular turno de IA
 */
export function getAIDecision(
  playerHealth: number,
  aiHealth: number,
  aiStats: RobotStats,
  aiMaxHealth: number = aiStats.health
): 'attack' | 'heal' {
  const healthPercentage = aiHealth / Math.max(1, aiMaxHealth)

  // Si la IA está muy dañada, prioriza curarse
  if (healthPercentage < 0.25) {
    return Math.random() < 0.75 ? 'heal' : 'attack'
  }

  // Si el jugador está rematable, ataca
  if (playerHealth <= aiStats.attack * 2) {
    return 'attack'
  }

  // Curación situacional en media vida
  if (healthPercentage < 0.45 && aiHealth < playerHealth) {
    return Math.random() < 0.45 ? 'heal' : 'attack'
  }

  // Por defecto la IA es agresiva
  return Math.random() < 0.8 ? 'attack' : 'heal'
}

/**
 * Curación escalada para evitar loops infinitos
 */
export function calculateHealAmount(
  stats: RobotStats,
  currentHealth: number,
  maxHealth: number
): number {
  const missingHealth = Math.max(0, maxHealth - currentHealth)
  if (missingHealth === 0) return 0

  const baseHeal = Math.floor(stats.attack * 0.3 + stats.speed * 0.12 + 8)
  const maxHealPerTurn = Math.floor(maxHealth * 0.18)
  return Math.min(missingHealth, Math.max(8, Math.min(baseHeal, maxHealPerTurn)))
}

/**
 * Escalar enemigo según el robot del jugador
 */
export function generateBalancedEnemyStats(playerStats: RobotStats): RobotStats {
  const variance = 0.94 + Math.random() * 0.12

  return {
    health: Math.max(35, Math.floor(playerStats.health * (0.9 + Math.random() * 0.12))),
    attack: Math.max(8, Math.floor(playerStats.attack * (0.88 + Math.random() * 0.15) * variance)),
    speed: Math.max(4, Math.floor(playerStats.speed * (0.85 + Math.random() * 0.2)))
  }
}

/**
 * Obtener color del rareza
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#808080',
    uncommon: '#00AA00',
    rare: '#0055FF',
    epic: '#AA00FF',
    legendary: '#FFAA00'
  }
  return colors[rarity] || '#808080'
}

/**
 * Obtener CSS variables por rareza
 */
export function getRarityStyles(rarity: string): Record<string, string> {
  const rarityColors: Record<string, string> = {
    common: '#808080',
    uncommon: '#2ECC71',
    rare: '#3498DB',
    epic: '#9B59B6',
    legendary: '#F39C12'
  }

  return {
    '--color-rarity': rarityColors[rarity] || '#808080',
    '--rarity': rarity
  }
}
