/**
 * Interfaces centralizadas para el sistema de robots
 * Proyecto: Mecha-Factory Arena
 */

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

export interface Enemy {
  id?: string
  name: string
  health: number
  maxHealth: number
  attack: number
  speed: number
}

export type CombatLog = {
  id: number
  message: string
  type: 'player' | 'enemy' | 'system'
  timestamp: number
}

export type GameState = 'idle' | 'combat' | 'victory' | 'defeat'
