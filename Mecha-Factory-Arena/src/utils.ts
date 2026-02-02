/**
 * Tipos de datos para las partes del robot
 */
export interface HeadPart {
  id: number
  name: string
  color: string
  borderRadius: string
  size: number
  description: string
  cost: number
  weight: number
}

export interface ArmsPart {
  id: number
  name: string
  color: string
  length: number
  thickness: number
  description: string
  cost: number
  weight: number
}

export interface BodyPart {
  id: number
  name: string
  color: string
  width: number
  height: number
  description: string
  cost: number
  weight: number
  armor: number
}

export interface LegsPart {
  id: number
  name: string
  color: string
  width: number
  height: number
  gap: number
  description: string
  cost: number
  weight: number
  speed: number
}

export interface RobotParts {
  heads: HeadPart[]
  arms: ArmsPart[]
  bodies: BodyPart[]
  legs: LegsPart[]
}

export interface RobotConfiguration {
  head: HeadPart | null
  arms: ArmsPart | null
  body: BodyPart | null
  legs: LegsPart | null
}

export interface RobotStats {
  totalCost: number
  totalWeight: number
  armor: number
  speed: number
  attackPower: number
  mobility: number
  combatRating: number
  efficiency: number
}

/**
 * Carga las partes del robot desde el archivo JSON
 */
export async function loadRobotParts(): Promise<RobotParts> {
  try {
    const response = await fetch('/parts.json')
    if (!response.ok) {
      throw new Error('Failed to load robot parts')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading robot parts:', error)
    throw error
  }
}

/**
 * Calcula las estadísticas totales del robot basándose en las partes seleccionadas
 */
export function calculateRobotStats(config: RobotConfiguration): RobotStats {
  const totalCost = [config.head, config.arms, config.body, config.legs]
    .filter((part): part is NonNullable<typeof part> => part !== null)
    .reduce((sum, part) => sum + part.cost, 0)

  const totalWeight = [config.head, config.arms, config.body, config.legs]
    .filter((part): part is NonNullable<typeof part> => part !== null)
    .reduce((sum, part) => sum + part.weight, 0)

  const armor = config.body?.armor ?? 0
  const baseSpeed = config.legs?.speed ?? 0

  // La velocidad efectiva se reduce por el peso total
  const weightPenalty = Math.max(0, (totalWeight - 200) / 20)
  const speed = Math.max(0, baseSpeed - weightPenalty)

  // Poder de ataque basado en grosor y longitud de brazos
  const attackPower = config.arms ? (config.arms.thickness + config.arms.length / 2) : 0

  // Movilidad: combinación de velocidad y peso
  const mobility = totalWeight > 0 ? (speed * 100) / totalWeight : 0

  // Rating de combate: fórmula combinada
  const combatRating = (attackPower * 0.3) + (armor * 0.3) + (speed * 0.2) + (mobility * 0.2)

  // Eficiencia: relación rendimiento/costo
  const efficiency = totalCost > 0 ? (combatRating * 10) / totalCost : 0

  return {
    totalCost,
    totalWeight,
    armor,
    speed: Math.round(speed),
    attackPower: Math.round(attackPower),
    mobility: Math.round(mobility),
    combatRating: Math.round(combatRating),
    efficiency: Math.round(efficiency * 100) / 100
  }
}

/**
 * Verifica si el robot está completo (todas las partes seleccionadas)
 */
export function isRobotComplete(config: RobotConfiguration): boolean {
  return !!(config.head && config.arms && config.body && config.legs)
}

/**
 * Valida si el robot cumple con el presupuesto máximo
 */
export function isWithinBudget(config: RobotConfiguration, maxBudget: number): boolean {
  const stats = calculateRobotStats(config)
  return stats.totalCost <= maxBudget
}

/**
 * Valida si el robot cumple con el límite de peso
 */
export function isWithinWeightLimit(config: RobotConfiguration, maxWeight: number): boolean {
  const stats = calculateRobotStats(config)
  return stats.totalWeight <= maxWeight
}

/**
 * Verifica compatibilidad entre partes
 * Regla: Las partes pesadas requieren piernas fuertes
 */
export function arePartsCompatible(config: RobotConfiguration): {
  compatible: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Verificar si el cuerpo es muy pesado para las piernas
  if (config.body && config.legs) {
    const bodyWeight = config.body.weight
    const legSpeed = config.legs.speed

    if (bodyWeight > 100 && legSpeed > 60) {
      issues.push('Las piernas rápidas no pueden soportar un cuerpo pesado')
    }

    if (bodyWeight < 60 && legSpeed < 40) {
      issues.push('Piernas pesadas desperdician potencial con un cuerpo ligero')
    }
  }

  // Verificar si los brazos son muy largos para el cuerpo
  if (config.arms && config.body) {
    const armLength = config.arms.length
    const bodyWidth = config.body.width

    if (armLength > bodyWidth * 0.8) {
      issues.push('Brazos demasiado largos para el tamaño del cuerpo, puede causar desequilibrio')
    }
  }

  // Verificar proporción cabeza-cuerpo
  if (config.head && config.body) {
    const headSize = config.head.size
    const bodyWidth = config.body.width

    if (headSize > bodyWidth * 0.9) {
      issues.push('Cabeza demasiado grande para el cuerpo')
    }

    if (headSize < bodyWidth * 0.4) {
      issues.push('Cabeza demasiado pequeña, sistemas de control limitados')
    }
  }

  return {
    compatible: issues.length === 0,
    issues
  }
}

/**
 * Obtiene una clasificación del robot basada en sus estadísticas
 */
export function getRobotClass(stats: RobotStats): string {
  if (stats.speed > 60 && stats.totalWeight < 150) {
    return 'Scout'
  } else if (stats.armor > 80 && stats.totalWeight > 250) {
    return 'Tank'
  } else if (stats.attackPower > 60) {
    return 'Assault'
  } else if (stats.mobility > 50 && stats.speed > 50) {
    return 'Runner'
  } else if (stats.combatRating > 100) {
    return 'Elite'
  } else {
    return 'Standard'
  }
}

/**
 * Calcula el ranking del robot (de 1 a 5 estrellas)
 */
export function getRobotRank(stats: RobotStats): number {
  const rating = stats.combatRating
  
  if (rating >= 120) return 5
  if (rating >= 100) return 4
  if (rating >= 80) return 3
  if (rating >= 60) return 2
  return 1
}

/**
 * Guarda la configuración del robot en localStorage
 */
export function saveRobotConfiguration(name: string, config: RobotConfiguration): void {
  try {
    const saved = localStorage.getItem('savedRobots')
    const robots = saved ? JSON.parse(saved) : {}
    
    robots[name] = {
      ...config,
      savedAt: new Date().toISOString()
    }
    
    localStorage.setItem('savedRobots', JSON.stringify(robots))
  } catch (error) {
    console.error('Error saving robot configuration:', error)
    throw new Error('No se pudo guardar la configuración')
  }
}

/**
 * Carga una configuración guardada del robot
 */
export function loadRobotConfiguration(name: string): RobotConfiguration | null {
  try {
    const saved = localStorage.getItem('savedRobots')
    if (!saved) return null
    
    const robots = JSON.parse(saved)
    return robots[name] || null
  } catch (error) {
    console.error('Error loading robot configuration:', error)
    return null
  }
}

/**
 * Obtiene todas las configuraciones guardadas
 */
export function getAllSavedRobots(): Record<string, RobotConfiguration & { savedAt: string }> {
  try {
    const saved = localStorage.getItem('savedRobots')
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('Error loading saved robots:', error)
    return {}
  }
}

/**
 * Elimina una configuración guardada
 */
export function deleteRobotConfiguration(name: string): boolean {
  try {
    const saved = localStorage.getItem('savedRobots')
    if (!saved) return false
    
    const robots = JSON.parse(saved)
    if (!(name in robots)) return false
    
    delete robots[name]
    localStorage.setItem('savedRobots', JSON.stringify(robots))
    return true
  } catch (error) {
    console.error('Error deleting robot configuration:', error)
    return false
  }
}

/**
 * Genera un nombre aleatorio para un robot
 */
export function generateRobotName(): string {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Titan', 'Nova', 'Apex']
  const suffixes = ['Striker', 'Guardian', 'Hunter', 'Warrior', 'Defender', 'Raider', 'Crusher', 'Phantom']
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  const number = Math.floor(Math.random() * 999) + 1
  
  return `${prefix}-${suffix}-${number.toString().padStart(3, '0')}`
}

/**
 * Compara dos robots y devuelve quién ganaría en combate
 */
export function compareRobots(config1: RobotConfiguration, config2: RobotConfiguration): {
  winner: 'robot1' | 'robot2' | 'draw'
  robot1Stats: RobotStats
  robot2Stats: RobotStats
  reason: string
} {
  const stats1 = calculateRobotStats(config1)
  const stats2 = calculateRobotStats(config2)

  const diff = stats1.combatRating - stats2.combatRating

  if (Math.abs(diff) < 5) {
    return {
      winner: 'draw',
      robot1Stats: stats1,
      robot2Stats: stats2,
      reason: 'Ambos robots tienen capacidades similares'
    }
  }

  if (diff > 0) {
    return {
      winner: 'robot1',
      robot1Stats: stats1,
      robot2Stats: stats2,
      reason: `Robot 1 tiene mejor rating de combate (${stats1.combatRating} vs ${stats2.combatRating})`
    }
  }

  return {
    winner: 'robot2',
    robot1Stats: stats1,
    robot2Stats: stats2,
    reason: `Robot 2 tiene mejor rating de combate (${stats2.combatRating} vs ${stats1.combatRating})`
  }
}

/**
 * Obtiene recomendaciones de partes basadas en un estilo de juego
 */
export function getRecommendedParts(
  parts: RobotParts,
  style: 'balanced' | 'speed' | 'tank' | 'assault'
): RobotConfiguration {
  let head: HeadPart, arms: ArmsPart, body: BodyPart, legs: LegsPart

  switch (style) {
    case 'speed':
      head = parts.heads.find(h => h.weight < 20) || parts.heads[0]
      arms = parts.arms.find(a => a.weight < 40) || parts.arms[0]
      body = parts.bodies.find(b => b.weight < 70) || parts.bodies[0]
      legs = parts.legs.find(l => l.speed > 60) || parts.legs[0]
      break

    case 'tank':
      head = parts.heads.find(h => h.weight > 30) || parts.heads[0]
      arms = parts.arms.find(a => a.weight > 50) || parts.arms[0]
      body = parts.bodies.find(b => b.armor > 80) || parts.bodies[0]
      legs = parts.legs.find(l => l.weight > 80) || parts.legs[0]
      break

    case 'assault':
      head = parts.heads[2] || parts.heads[0]
      arms = parts.arms.find(a => a.thickness > 35) || parts.arms[0]
      body = parts.bodies.find(b => b.armor > 50 && b.weight < 100) || parts.bodies[0]
      legs = parts.legs.find(l => l.speed > 40 && l.weight < 70) || parts.legs[0]
      break

    default: // balanced
      head = parts.heads[0]
      arms = parts.arms[0]
      body = parts.bodies[0]
      legs = parts.legs[0]
  }

  return { head, arms, body, legs }
}

/**
 * Formatea el costo con separadores de miles
 */
export function formatCost(cost: number): string {
  return cost.toLocaleString('es-ES') + ' CR'
}

/**
 * Formatea el peso
 */
export function formatWeight(weight: number): string {
  return weight.toFixed(1) + ' kg'
}

/**
 * Obtiene el color para un valor de estadística (verde=bueno, rojo=malo)
 */
export function getStatColor(value: number, max: number): string {
  const percentage = (value / max) * 100
  
  if (percentage >= 75) return '#10b981' // verde
  if (percentage >= 50) return '#f59e0b' // amarillo
  if (percentage >= 25) return '#fb923c' // naranja
  return '#ef4444' // rojo
}
