# 🤖 Sistema de Combate - Mecha Factory Arena

## 📋 Descripción General

El sistema de combate es un sistema por turnos que enfrenta al robot del jugador contra enemigos controlados por IA.

## 🎮 Mecánicas de Combate

### Inicio de Combate

```typescript
import { useGameStore } from '@/stores/useGameStore'
import type { Enemy } from '@/interfaces/RobotInterfaces'

const store = useGameStore()

// Definir un enemigo
const enemigo: Enemy = {
  name: "Dron de Entrenamiento",
  health: 100,
  maxHealth: 100,
  attack: 25,
  speed: 20
}

// Iniciar combate
store.startCombat(enemigo)
```

### Acciones del Jugador

#### 1. Atacar
```typescript
store.atacar()
```
- Inflige daño al enemigo basado en el ataque total del robot
- Daño variable: 80% - 120% del ataque base
- Cambia el turno al enemigo automáticamente

#### 2. Curar
```typescript
store.curar()
```
- Restaura el 30% de la vida máxima del robot
- No puede exceder la vida máxima
- Cambia el turno al enemigo automáticamente

### Sistema de Turnos

1. **Iniciativa**: El personaje con mayor velocidad ataca primero
2. **Turno del Jugador**: Puede elegir entre `atacar()` o `curar()`
3. **Turno de la IA**: Se ejecuta automáticamente después de 1.5 segundos
4. **Repetición**: Los turnos se alternan hasta que alguien sea derrotado

### Comportamiento de la IA

La IA enemiga tiene un comportamiento simple pero efectivo:

- **Si tiene más del 50% de vida**: 100% probabilidad de atacar
- **Si tiene menos del 50% de vida**: 
  - 70% probabilidad de atacar
  - 30% probabilidad de curarse (restaura 25% de vida máxima)

## 📊 Estados del Juego

```typescript
type GameState = 'idle' | 'combat' | 'victory' | 'defeat'
```

- **idle**: No hay combate activo
- **combat**: Combate en progreso
- **victory**: El jugador ha ganado
- **defeat**: El jugador ha perdido

## 🎯 Cálculo de Daño

```javascript
// Fórmula de daño
const variacion = 0.8 + Math.random() * 0.4  // Entre 0.8 y 1.2
const danio = Math.round(ataqueTotal * variacion)
```

Esto significa que cada ataque causa entre el **80% y 120%** del poder de ataque base.

## 📝 Log de Combate

Todos los eventos del combate se registran en `combatLog`:

```typescript
const combatLog: CombatLog[] = [
  {
    id: 1234567890,
    message: "Mi Robot ataca y causa 45 de daño",
    type: "player",  // 'player' | 'enemy' | 'system'
    timestamp: 1234567890
  }
]
```

## 🔄 Flujo Completo de Combate

```typescript
// 1. Verificar que el robot esté completo
if (!store.isReadyToFight) {
  console.error('Robot incompleto')
  return
}

// 2. Iniciar combate
const success = store.startCombat(enemigo)

// 3. Durante el combate (en el componente)
<template>
  <div v-if="store.gameState === 'combat'">
    <p>Turno: {{ store.turn }}</p>
    <p>Tu vida: {{ store.playerCurrentHealth }} / {{ store.totalHealth }}</p>
    <p>Enemigo: {{ store.enemy?.health }} / {{ store.enemy?.maxHealth }}</p>
    
    <button 
      @click="store.atacar()" 
      :disabled="store.turn !== 'player'"
    >
      Atacar
    </button>
    
    <button 
      @click="store.curar()" 
      :disabled="store.turn !== 'player'"
    >
      Curar
    </button>
    
    <div v-for="log in store.combatLog" :key="log.id">
      {{ log.message }}
    </div>
  </div>
  
  <div v-if="store.gameState === 'victory'">
    ¡Victoria!
  </div>
  
  <div v-if="store.gameState === 'defeat'">
    Derrota...
  </div>
</template>

// 4. Finalizar combate
store.endCombat()
```

## 🛡️ Estadísticas del Robot

Las estadísticas se calculan automáticamente sumando las de todas las partes:

- **Health (Salud)**: Suma de health de todas las partes
- **Attack (Ataque)**: Suma de attack de todas las partes  
- **Speed (Velocidad)**: Suma de speed de todas las partes

## ⚡ Ejemplo Completo de Uso

```typescript
// En un componente Vue
<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'
import { storeToRefs } from 'pinia'

const store = useGameStore()
const { gameState, playerCurrentHealth, enemy, turn, combatLog } = storeToRefs(store)

const iniciarPelea = () => {
  const enemigo = {
    name: "Dron de Entrenamiento",
    health: 100,
    maxHealth: 100,
    attack: 25,
    speed: 20
  }
  
  store.startCombat(enemigo)
}

const atacarEnemigo = () => {
  if (turn.value === 'player') {
    store.atacar()
  }
}

const curarse = () => {
  if (turn.value === 'player') {
    store.curar()
  }
}

const finalizarCombate = () => {
  store.endCombat()
}
</script>
```

## 🎨 Recomendaciones para Comunicación (UI/UX)

Para implementar las animaciones de combate:

1. **Animación de ataque**: Clase CSS `.attack-animation` con efecto de dash
2. **Animación de daño**: Clase CSS `.damage-shake` con efecto de temblor
3. **Barras de vida**: Componente `<HealthBar>` con transiciones suaves
4. **Log de combate**: Lista con scroll automático y fade-in para nuevos mensajes

```css
.damage-shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.attack-animation {
  animation: attack 0.6s;
}

@keyframes attack {
  0% { transform: translateX(0); }
  50% { transform: translateX(30px); }
  100% { transform: translateX(0); }
}
```

## 📚 Referencias

- **Store**: [useGameStore.ts](src/stores/useGameStore.ts)
- **Interfaces**: [RobotInterfaces.ts](src/interfaces/RobotInterfaces.ts)
- **Enemigos**: [enemies.json](src/data/enemies.json)
