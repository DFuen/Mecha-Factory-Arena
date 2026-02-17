<template>
  <div class="robot-container" :class="{ dragging: isDragging }">
    
    <button @click="resetPositions" class="reset-button">Restablecer Posición</button>

    <div class="robot">
      
      <Head
        v-if="robot.head"
        color="rgb(50, 116, 179)" 
        :size="120"
        :style="getPartStyle('head')"
        @mousedown.prevent="onDragStart('head', $event)"
      >
        <span class="part-label">{{ robot.head.name }}</span>
      </Head>
      <div v-else class="placeholder head-placeholder">Falta Cabeza</div>

      <Arms
        v-if="robot.arms"
        color="#4b5563"
        :length="90"
        :thickness="18"
        :style="getPartStyle('arms')"
        @mousedown.prevent="onDragStart('arms', $event)"
      />
      <div v-else class="placeholder arms-placeholder">Faltan Brazos</div>

      <Body
        v-if="robot.body"
        color="rgb(50, 116, 179)"
        :width="170"
        :height="210"
        :style="getPartStyle('body')"
        @mousedown.prevent="onDragStart('body', $event)"
      />
      <div v-else class="placeholder body-placeholder">Falta Cuerpo</div>

      <Legs
        v-if="robot.legs"
        color="#4b5563"
        :height="120"
        :style="getPartStyle('legs')"
        @mousedown.prevent="onDragStart('legs', $event)"
      />
      <div v-else class="placeholder legs-placeholder">Faltan Piernas</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useGameStore } from '@/stores/useGameStore' // IMPORTANTE: Conexión al Store
import { storeToRefs } from 'pinia'

// Importamos tus componentes visuales
import Head from './HeadPart.vue'
import Body from './BodyPart.vue'
import Arms from './ArmsPart.vue'
import Legs from './LegsPart.vue'

// --- 1. CONEXIÓN CON PINIA ---
const store = useGameStore()
// Usamos storeToRefs para mantener la reactividad
const { robot } = storeToRefs(store)

// --- 2. LÓGICA DE ARRASTRE (Tu código original mantenido) ---
type PartName = 'head' | 'body' | 'arms' | 'legs';

const isDragging = ref(false)
const draggedPart = ref<PartName | null>(null)

const partPositions = reactive({
  head: { x: 0, y: 0 },
  body: { x: 0, y: 0 },
  arms: { x: 0, y: 0 },
  legs: { x: 0, y: 0 }
})

// Estado del arrastre
const dragContext = {
  initialMouseX: 0,
  initialMouseY: 0,
  initialPartX: 0,
  initialPartY: 0,
}

const onDragStart = (part: PartName, event: MouseEvent) => {
  if (!robot.value[part]) return; // Seguridad: No arrastrar si no existe la pieza

  isDragging.value = true
  draggedPart.value = part

  dragContext.initialMouseX = event.clientX
  dragContext.initialMouseY = event.clientY
  dragContext.initialPartX = partPositions[part].x
  dragContext.initialPartY = partPositions[part].y

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', onDragEnd)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !draggedPart.value) return

  const part = draggedPart.value;
  const deltaX = event.clientX - dragContext.initialMouseX
  const deltaY = event.clientY - dragContext.initialMouseY

  partPositions[part].x = dragContext.initialPartX + deltaX
  partPositions[part].y = dragContext.initialPartY + deltaY
}

const onDragEnd = () => {
  isDragging.value = false
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

  if (isDragging.value && draggedPart.value === part) {
    style.animation = 'none';
  }
  
  return style;
}
</script>

<style scoped>
.robot-container {
  width: 100%;
  height: 100%; /* Ajustado para encajar en el layout */
  min-height: 500px;
  position: relative;
  background: #f8fafc; /* Fondo ligero para ver mejor el robot */
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.reset-button {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  z-index: 100;
  background-color: #64748b;
  color: white;
  border: none;
  border-radius: 8px;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.reset-button:hover {
  opacity: 1;
}

.robot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 60px;
  gap: 10px; /* Separación base entre piezas */
}

/* Placeholders: Lo que se ve cuando no has comprado la pieza */
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #94a3b8;
  font-weight: bold;
  font-size: 0.9rem;
}

.head-placeholder { width: 100px; height: 100px; }
.body-placeholder { width: 150px; height: 180px; }
.arms-placeholder { width: 200px; height: 40px; }
.legs-placeholder { width: 120px; height: 100px; }

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

:deep(.head:active),
:deep(.arms:active),
:deep(.body:active),
:deep(.legs:active) {
  cursor: grabbing;
}
</style>