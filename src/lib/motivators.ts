import type { Motivator } from './types';

export const MOTIVATORS: Motivator[] = [
  {
    id: 'daily_goal',
    name: {
      en: 'Daily Goal Prompt',
      de: 'Tagesziel-Abfrage',
      es: 'Objetivo Diario',
      fr: 'Objectif du Jour',
      pt: 'Objetivo Diário',
      it: 'Obiettivo Giornaliero',
    },
    description: {
      en: 'Asks you to name one intention for the day before you rise.',
      de: 'Bittet dich, eine Intention für den Tag zu nennen, bevor du aufstehst.',
      es: 'Te pide que nombres una intención para el día antes de levantarte.',
      fr: 'Te demande de nommer une intention pour la journée avant de te lever.',
      pt: 'Pede que você defina uma intenção para o dia antes de se levantar.',
      it: 'Ti chiede di nominare un\'intenzione per la giornata prima di alzarti.',
    },
    icon: 'Target',
  },
  {
    id: 'fitness',
    name: {
      en: 'Fitness Boost',
      de: 'Fitness-Schub',
      es: 'Impulso Fitness',
      fr: 'Boost Fitness',
      pt: 'Impulso Fitness',
      it: 'Spinta Fitness',
    },
    description: {
      en: 'High-energy cues to get you moving and break a sweat.',
      de: 'Energetische Hinweise, um dich in Bewegung zu bringen und ins Schwitzen zu kommen.',
      es: 'Señales de alta energía para que te muevas y sudes.',
      fr: 'Des signaux énergiques pour te faire bouger et transpirer.',
      pt: 'Sinais de alta energia para te mover e suar.',
      it: 'Segnali ad alta energia per farti muovere e sudare.',
    },
    icon: 'Dumbbell',
  },
  {
    id: 'coach',
    name: {
      en: 'Coach Mode',
      de: 'Coach-Modus',
      es: 'Modo Coach',
      fr: 'Mode Coach',
      pt: 'Modo Coach',
      it: 'Modalità Coach',
    },
    description: {
      en: 'A firm, encouraging coach that won\'t let you hit snooze twice.',
      de: 'Ein fester, ermutigender Coach, der dich nicht zweimal schlummern lässt.',
      es: 'Un coach firme y motivador que no te dejará posponer dos veces.',
      fr: 'Un coach ferme et encourageant qui ne te laissera pas snoozer deux fois.',
      pt: 'Um coach firme e encorajador que não vai te deixar adiar duas vezes.',
      it: 'Un coach fermo e incoraggiante che non ti lascerà posticipare due volte.',
    },
    icon: 'Megaphone',
  },
  {
    id: 'gratitude',
    name: {
      en: 'Gratitude Start',
      de: 'Dankbarkeits-Start',
      es: 'Inicio con Gratitud',
      fr: 'Début avec Gratitude',
      pt: 'Início com Gratidão',
      it: 'Inizio con Gratitudine',
    },
    description: {
      en: 'A gentle reminder to begin the day with one thankful thought.',
      de: 'Eine sanfte Erinnerung, den Tag mit einem dankbaren Gedanken zu beginnen.',
      es: 'Un recordatorio suave para comenzar el día con un pensamiento de agradecimiento.',
      fr: 'Un doux rappel pour commencer la journée avec une pensée reconnaissante.',
      pt: 'Um lembrete gentil para começar o dia com um pensamento de gratidão.',
      it: 'Un dolce promemoria per iniziare la giornata con un pensiero riconoscente.',
    },
    icon: 'HeartHandshake',
  },
  {
    id: 'focus',
    name: {
      en: 'Deep Focus',
      de: 'Tiefer Fokus',
      es: 'Enfoque Profundo',
      fr: 'Concentration Profonde',
      pt: 'Foco Profundo',
      it: 'Concentrazione Profonda',
    },
    description: {
      en: 'Frames your morning around the single task that matters most.',
      de: 'Rahmt deinen Morgen um die einzige Aufgabe ein, die am wichtigsten ist.',
      es: 'Encuadra tu mañana en torno a la única tarea que más importa.',
      fr: 'Cadre ton matin autour de la seule tâche qui compte le plus.',
      pt: 'Enquadra sua manhã em torno da única tarefa que mais importa.',
      it: 'Inquadra la tua mattina intorno all\'unico compito che conta di più.',
    },
    icon: 'Brain',
  },
];

export function getMotivator(id: string): Motivator | undefined {
  return MOTIVATORS.find((m) => m.id === id);
}
