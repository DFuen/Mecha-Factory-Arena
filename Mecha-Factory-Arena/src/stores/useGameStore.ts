import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Part, RobotSelection } from '@/interfaces/RobotInterfaces' // Tus interfaces

export const useGameStore = defineStore('game', () => {
  
  // --- STATE (Estado Global) ---
  // Aquí guardamos los datos que deben sobrevivir al cambio de página
  const robot = ref<RobotSelection>({
    head: null,
    body: null,
    arms: null,
    legs: null
  })

  const money = ref(2000) // Presupuesto inicial

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

  // Función para resetear (vender todo)
  function resetRobot() {
    robot.value = { head: null, body: null, arms: null, legs: null }
    money.value = 2000
  }

  return {
    // Exportamos todo para que los componentes lo usen
    robot,
    money,
    totalHealth,
    totalAttack,
    totalSpeed,
    isReadyToFight,
    equipPart,
    resetRobot
  }
})