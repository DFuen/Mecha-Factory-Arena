import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import rawParts from '../data/parts.json'

export interface PartItem {
  id: string
  name: string
  cost: number
}

export const useRobotStore = defineStore('robot', () => {
  const robotName = ref('')
  const budget = ref(1000)
  const selectedParts = ref<PartItem[]>([])
  const errorMessage = ref('')

  const parts = rawParts as PartItem[]

  const spent = computed(() => selectedParts.value.reduce((total, item) => total + item.cost, 0))
  const remaining = computed(() => Math.max(budget.value - spent.value, 0))
  const selectedIds = computed(() => selectedParts.value.map((item) => item.id))

  const setRobotName = (name: string) => {
    robotName.value = name
  }

  const setBudget = (value: number) => {
    errorMessage.value = ''
    const safeValue = Number.isFinite(value) ? Math.max(value, 0) : 0

    if (safeValue < spent.value) {
      budget.value = spent.value
      errorMessage.value = 'El presupuesto no puede ser menor que lo ya gastado.'
      return
    }

    budget.value = safeValue
  }

  const togglePart = (part: PartItem) => {
    errorMessage.value = ''

    if (selectedIds.value.includes(part.id)) {
      selectedParts.value = selectedParts.value.filter((item) => item.id !== part.id)
      return
    }

    if (budget.value - spent.value < part.cost) {
      errorMessage.value = 'Presupuesto insuficiente para este componente.'
      return
    }

    selectedParts.value = [...selectedParts.value, part]
  }

  return {
    robotName,
    budget,
    selectedParts,
    parts,
    spent,
    remaining,
    selectedIds,
    errorMessage,
    setRobotName,
    setBudget,
    togglePart
  }
})
