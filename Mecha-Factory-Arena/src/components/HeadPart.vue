<!-- El contenedor principal de la cabeza. -->
<!-- :style="headStyle" aplica estilos dinámicos calculados en el script. -->
<!-- @mousedown.stop="$emit('mousedown', $event)" emite un evento 'mousedown' cuando se hace clic, 
     permitiendo que el componente padre gestione el arrastre. El .stop evita que el evento se propague más. -->
<template>
  <div class="head" :style="headStyle" @mousedown.stop="$emit('mousedown', $event)">
    <!-- Elementos que componen la cara del robot. -->
    <div class="eye left"></div>
    <div class="eye right"></div>
    <div class="mouth"></div>
    <div class="orejaL"></div>
    <div class="orejaR"></div>
  </div>
</template>

<script setup lang="ts">
// Importa 'computed' de Vue para crear propiedades computadas.
import { computed } from 'vue'

// Define la interfaz 'HeadProps' para tipar las propiedades (props) que el componente puede recibir.
// Esto asegura que los datos pasados al componente tengan la forma correcta.
interface HeadProps {
  id?: string; // Identificador único opcional.
  color?: string; // Color de fondo opcional.
  borderRadius?: string; // Radio de los bordes opcional.
  size?: number; // Tamaño (ancho y alto) opcional.
  health?: number; // Puntos de vida opcionales.
  attack?: number; // Puntos de ataque opcionales.
  defense?: number; // Puntos de defensa opcionales.
}

// Define las props que el componente espera recibir, utilizando la interfaz 'HeadProps'.
const props = defineProps<HeadProps>()

// Declara los eventos que el componente puede emitir. En este caso, solo 'mousedown'.
defineEmits(['mousedown'])

// Crea una propiedad computada 'headStyle' que genera un objeto de estilos CSS.
// Estos estilos se basan en las props recibidas. Si una prop no se proporciona, se usa un valor por defecto.
const headStyle = computed(() => ({
  backgroundColor: props.color ?? '#d1d5db', // Color de fondo gris por defecto.
  borderRadius: props.borderRadius ?? '16px', // Bordes redondeados por defecto.
  width: props.size ? `${props.size}px` : '120px', // Ancho de 120px por defecto.
  height: props.size ? `${props.size}px` : '120px', // Alto de 120px por defecto.
}))
</script>

<style scoped>
/* Los estilos 'scoped' solo se aplican a este componente, evitando conflictos con otros. */

/* Estilo para el contenedor principal de la cabeza. */
.head {
  position: relative; /* Permite posicionar elementos hijos de forma absoluta dentro de la cabeza. */
  margin: 0 auto; /* Centra la cabeza horizontalmente. */
  z-index: 5; /* Asegura que la cabeza se muestre por encima de otros elementos. */
}

/* Estilos para las orejas. */
.orejaL {
  width: 20px;
  height: 50px;
  background: rgb(56, 55, 55);
  position: absolute; /* Posicionamiento absoluto respecto al contenedor '.head'. */
  top: 35px;
  left: -18px; /* Se posiciona fuera del borde izquierdo de la cabeza. */
  border-radius: 3px;
  z-index: 2;
}

.orejaR {
  width: 20px;
  height: 50px;
  background: rgb(56, 55, 55);
  position: absolute;
  top: 35px;
  left: 118px; /* Se posiciona cerca del borde derecho. */
  border-radius: 3px;
  z-index: 1; /* z-index más bajo que la oreja izquierda. */
}

/* Estilo base para los ojos. */
.eye {
  width: 40px;
  height: 40px;
  background: white;
  border: 6px solid rgb(56, 55, 55);
  border-radius: 50%; /* Crea una forma circular. */
  position: absolute;
  top: 40px;
}

/* Posicionamiento específico para el ojo izquierdo. */
.eye.left {
  left: 10px;
}

/* Posicionamiento específico para el ojo derecho. */
.eye.right {
  right: 10px;
}

/* Estilo para la boca. */
.mouth {
  width: 50px;
  height:20px;
  border-radius: 5px;
  background: white;
  border: 6px solid rgb(56, 55, 55);
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%); /* Centra la boca horizontalmente de forma precisa. */
}


</style>