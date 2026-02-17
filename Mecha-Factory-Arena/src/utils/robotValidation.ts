import type { RobotSelection } from '@/interfaces/RobotInterfaces'

/**
 * REGLAS DE LA ARENA
 * Verifica si el robot cumple los requisitos mínimos para combatir.
 */
export const isRobotReady = (robot: RobotSelection): boolean => {
  // Regla 1: Debe tener CABEZA
  if (!robot.head) return false;

  // Regla 2: Debe tener CUERPO
  if (!robot.body) return false;

  // Regla 3: Debe tener BRAZOS (Armas)
  if (!robot.arms) return false;

  // Regla 4: Debe tener PIERNAS
  if (!robot.legs) return false;

  // Si tiene todo, está listo
  return true;
};

/**
 * Devuelve una lista de lo que falta para mostrarselo al usuario
 */
export const getMissingParts = (robot: RobotSelection): string[] => {
  const errors: string[] = [];
  
  if (!robot.head) errors.push("Falta la Cabeza");
  if (!robot.body) errors.push("Falta el Cuerpo");
  if (!robot.arms) errors.push("Faltan las Armas");
  if (!robot.legs) errors.push("Faltan las Piernas");
  
  return errors;
};