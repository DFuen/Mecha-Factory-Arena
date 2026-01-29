<template>
  <div class="robot-container" :class="{ dragging: isDragging }">
    <button @click="resetPositions" class="reset-button">Restablecer</button>
    <div class="robot">
      <Head
        color="rgb(50, 116, 179)"
        :size="120"
        :style="getPartStyle('head')"
        @mousedown.prevent="onDragStart('head', $event)"
      />

      <Arms
        color="#4b5563"
        :length="90"
        :thickness="18"
        :style="getPartStyle('arms')"
        @mousedown.prevent="onDragStart('arms', $event)"
      />
      <Body
        color="rgb(50, 116, 179)"
        :width="170"
        :height="210"
        :style="getPartStyle('body')"
        @mousedown.prevent="onDragStart('body', $event)"
      />

      <Legs
        color="#4b5563"
        :height="120"
        :style="getPartStyle('legs')"
        @mousedown.prevent="onDragStart('legs', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Head from './HeadPart.vue'
import Body from './BodyPart.vue'
import Arms from './ArmsPart.vue'
import Legs from './LegsPart.vue'

// Definimos el contrato del robot usando los atributos exactos de tus archivos
interface RobotConfig {
  name: string
  head: {
    color?: string
    borderRadius?: string
    size?: number
    health?: number
    attack?: number
    defense?: number
  }
  body: {
    color?: string
    width?: number
    height?: number
    health?: number
    attack?: number
    defense?: number
  }
  arms: {
    color?: string
    length?: number
    thickness?: number
    health?: number
    attack?: number
    defense?: number
  }
  legs: {
    color?: string
    width?: number
    height?: number
    gap?: number
    health?: number
    attack?: number
    defense?: number
  }
}

const props = defineProps<{
  config: RobotConfig
}>()

type PartName = 'head' | 'body' | 'arms' | 'legs';

const isDragging = ref(false)
const draggedPart = ref<PartName | null>(null)
const partPositions = reactive({
  head: { x: 0, y: 0 },
  body: { x: 0, y: 0 },
  arms: { x: 0, y: 0 },
  legs: { x: 0, y: 0 }
})
// Almacena la posición inicial del ratón y de la pieza al empezar a arrastrar
const dragContext = {
  initialMouseX: 0,
  initialMouseY: 0,
  initialPartX: 0,
  initialPartY: 0,
}

const onDragStart = (part: PartName, event: MouseEvent) => {
  console.log('Pieza seleccionada:', part);
  isDragging.value = true
  draggedPart.value = part

  // Guardar el estado inicial del arrastre
  dragContext.initialMouseX = event.clientX
  dragContext.initialMouseY = event.clientY
  dragContext.initialPartX = partPositions[part].x
  dragContext.initialPartY = partPositions[part].y

  // Añadir listeners globales para un arrastre robusto
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', onDragEnd)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !draggedPart.value) return

  const part = draggedPart.value;
  
  // Calcular el desplazamiento del ratón desde el inicio
  const deltaX = event.clientX - dragContext.initialMouseX
  const deltaY = event.clientY - dragContext.initialMouseY

  // La nueva posición es la posición inicial más el desplazamiento
  partPositions[part].x = dragContext.initialPartX + deltaX
  partPositions[part].y = dragContext.initialPartY + deltaY
}

const onDragEnd = () => {
  isDragging.value = false
  
  // Limpiar los listeners globales
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', onDragEnd)
}

const resetPositions = () => {
  for (const part in partPositions) {
    partPositions[part as PartName].x = 0;
    partPositions[part as PartName].y = 0;
  }
}

const getPartStyle = (part: PartName) => {
  const style: any = {
    transform: `translate(${partPositions[part].x}px, ${partPositions[part].y}px)`,
    transition: !isDragging.value ? 'transform 0.4s ease' : 'none',
    position: 'relative',
    zIndex: draggedPart.value === part && isDragging.value ? 10 : 1
  };

  // Desactivar la animación de la pieza que se está arrastrando para un arrastre suave
  if (isDragging.value && draggedPart.value === part) {
    style.animation = 'none';
  }
  
  return style;
}
</script>

<style scoped>
.robot-container {
  width: 100%;
  height: 100vh;
  position: relative;
  /* overflow: hidden; <-- Eliminado para quitar la barrera */
}

.reset-button {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.reset-button:hover {
  background-color: #dc2626;
}

.robot {
  position: relative;
  width: 220px;
  margin: 100px auto 40px; /* Aumentado margen superior para dejar espacio al botón */
  color: rgb(50, 116, 179);
}

:deep(.head),
:deep(.arms),
:deep(.body),
:deep(.legs) {
  cursor: grab;
  user-select: none;
}

.robot-container.dragging {
  cursor: grabbing;
}

/* Aplicar el cursor "grabbing" directamente a la pieza activa */
:deep(.head:active),
:deep(.arms:active),
:deep(.body:active),
:deep(.legs:active) {
  cursor: grabbing;
}
</style>
