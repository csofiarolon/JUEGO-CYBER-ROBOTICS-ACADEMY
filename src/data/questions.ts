import { ALL_100_QUESTIONS, TOTAL_QUESTIONS_COUNT, CURRICULUM_LEVELS } from './curriculum';
import { Question } from '../types/game';

export const allQuestions: Question[] = ALL_100_QUESTIONS;
export const TOTAL_QUESTIONS = TOTAL_QUESTIONS_COUNT;

export const MODULE_NAMES: Record<number, string> = {
  1: 'Conceptos Básicos NoSQL',
  2: 'Operaciones CRUD Básicas',
  3: 'Aggregation Framework',
  4: 'Mongoose ODM y Modelado',
  5: 'Diseño de Esquemas',
  6: 'Rendimiento, Seguridad y Conexión',
};

export function getQuestionById(id: number): Question | undefined {
  return ALL_100_QUESTIONS.find((q) => q.id === id);
}

export function getQuestionsByModule(modulo: number): Question[] {
  return ALL_100_QUESTIONS.filter((q) => q.levelId === modulo);
}
