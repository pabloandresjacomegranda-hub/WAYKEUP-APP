import type { ScriptCategory, Script } from './types';

export const SCRIPT_CATEGORIES: ScriptCategory[] = [
  {
    id: 'wealth_mindset',
    name: {
      en: 'Wealth & Mindset',
      de: 'Wohlstand & Mindset',
      es: 'Riqueza y Mentalidad',
      fr: 'Richesse et Mentalité',
      pt: 'Riqueza e Mentalidade',
      it: 'Ricchezza e Mentalità',
    },
    icon: 'TrendingUp',
  },
  {
    id: 'fitness_discipline',
    name: {
      en: 'Fitness & Discipline',
      de: 'Fitness & Disziplin',
      es: 'Fitness y Disciplina',
      fr: 'Fitness et Discipline',
      pt: 'Fitness e Disciplina',
      it: 'Fitness e Disciplina',
    },
    icon: 'Dumbbell',
  },
  {
    id: 'emotional_healing',
    name: {
      en: 'Emotional Healing',
      de: 'Seelenfrieden & Heilung',
      es: 'Sanación Emocional',
      fr: 'Guérison Émotionnelle',
      pt: 'Cura Emocional',
      it: 'Guarigione Emotiva',
    },
    icon: 'HeartHandshake',
  },
  {
    id: 'subconscious',
    name: {
      en: 'Subconscious (Oma/Family)',
      de: 'Unterbewusst (Oma/Familie)',
      es: 'Subconsciente (Oma/Familia)',
      fr: 'Subconscient (Oma/Famille)',
      pt: 'Subconsciente (Vovó/Família)',
      it: 'Subconscio (Nonna/Famiglia)',
    },
    icon: 'Moon',
  },
  {
    id: 'reward_focus',
    name: {
      en: 'Reward Focus',
      de: 'Belohnung Fokus',
      es: 'Premio Enfoque',
      fr: 'Récompense Focus',
      pt: 'Recompensa Foco',
      it: 'Ricompensa Focus',
    },
    icon: 'Trophy',
  },
  {
    id: 'accountability',
    name: {
      en: 'Accountability',
      de: 'Verantwortung',
      es: 'Castigo Enfoque',
      fr: 'Responsabilité',
      pt: 'Responsabilidade',
      it: 'Responsabilità',
    },
    icon: 'Megaphone',
  },
];

export const SCRIPTS: Script[] = [
  {
    id: 'wealth_1',
    categoryId: 'wealth_mindset',
    text: {
      en: 'You are absolutely capable. Your family is proud of you. Today you will make decisions that move you closer to the life you deserve. Every step forward compounds. Trust your discipline.',
      de: 'Du bist absolut fähig. Deine Familie ist stolz auf dich. Heute wirst du Entscheidungen treffen, die dich dem Leben näherbringen, das du verdienst. Jeder Schritt nach vorn zahlt sich aus. Vertraue deiner Disziplin.',
      es: 'Eres absolutamente capaz. Tu familia está orgullosa de ti. Hoy tomarás decisiones que te acercan a la vida que mereces. Cada paso adelante se multiplica. Confía en tu disciplina.',
      fr: 'Tu es absolument capable. Ta famille est fière de toi. Aujourd\'hui tu prendras des décisions qui te rapprochent de la vie que tu mérites. Chaque pas en avant s\'accumule. Fais confiance à ta discipline.',
      pt: 'Você é absolutamente capaz. Sua família tem orgulho de você. Hoje você tomará decisões que aproximam você da vida que merece. Cada passo à frente se multiplica. Confie na sua disciplina.',
      it: 'Sei assolutamente capace. La tua famiglia è fiera di te. Oggi prenderai decisioni che ti avvicinano alla vita che meriti. Ogni passo avanti si accumula. Fidati della tua disciplina.',
    },
  },
  {
    id: 'wealth_2',
    categoryId: 'wealth_mindset',
    text: {
      en: 'Wealth is built in the quiet hours. While others sleep, you rise and plan. Your mind is your greatest asset. Feed it with vision, and your hands will build the rest.',
      de: 'Wohlstand wird in den stillen Stunden aufgebaut. Während andere schlafen, stehst du auf und planst. Dein Verstand ist dein größtes Kapital. Nähre ihn mit Vision, und deine Hände werden den Rest bauen.',
      es: 'La riqueza se construye en las horas tranquilas. Mientras otros duermen, tú te levantas y planificas. Tu mente es tu mayor activo. Aliméntala con visión y tus manos construirán el resto.',
      fr: 'La richesse se construit dans les heures calmes. Pendant que d\'autres dorment, tu te lèves et planifies. Ton esprit est ton plus grand atout. Nourris-le de vision et tes mains construiront le reste.',
      pt: 'A riqueza é construída nas horas silenciosas. Enquanto outros dormem, você se levanta e planeja. Sua mente é seu maior ativo. Alimente-a com visão e suas mãos construirão o resto.',
      it: 'La ricchezza si costruisce nelle ore tranquille. Mentre altri dormono, ti alzi e pianifichi. La tua mente è il tuo più grande asset. Nutrila con visione e le tue mani costruiranno il resto.',
    },
  },
  {
    id: 'fitness_1',
    categoryId: 'fitness_discipline',
    text: {
      en: 'Tomorrow you wake up and follow through on your training. No negotiations. Your body is the only home you truly own. Treat it like the temple it is. Discipline is freedom.',
      de: 'Morgen stehst du auf und ziehst dein Training durch. Keine Verhandlungen. Dein Körper ist das einzige Zuhause, das du wirklich besitzt. Behandle ihn wie den Tempel, der er ist. Disziplin ist Freiheit.',
      es: 'Mañana te levantas y cumples con tu entrenamiento. Sin negociaciones. Tu cuerpo es el único hogar que realmente posees. Trátalo como el templo que es. La disciplina es libertad.',
      fr: 'Demain tu te lèves et tu termines ton entraînement. Sans négociations. Ton corps est le seul foyer que tu possèdes vraiment. Traite-le comme le temple qu\'il est. La discipline est la liberté.',
      pt: 'Amanhã você acorda e cumpre seu treino. Sem negociações. Seu corpo é a única casa que você realmente possui. Trate-o como o templo que é. Disciplina é liberdade.',
      it: 'Domani ti svegli e porti a termine il tuo allenamento. Senza negoziazioni. Il tuo corpo è l\'unica casa che possiedi veramente. Trattalo come il tempio che è. La disciplina è libertà.',
    },
  },
  {
    id: 'fitness_2',
    categoryId: 'fitness_discipline',
    text: {
      en: 'The version of you that skips today is not the version you want to become. Every rep, every step, every early morning is a vote for your future self. Cast your vote now.',
      de: 'Die Version von dir, die heute aussetzt, ist nicht die Version, die du werden willst. Jede Wiederholung, jeder Schritt, jeder frühe Morgen ist eine Stimme für dein zukünftiges Ich. Gib jetzt deine Stimme ab.',
      es: 'La versión de ti que se salta el entrenamiento de hoy no es la versión que quieres ser. Cada repetición, cada paso y cada madrugón son un voto por tu yo futuro. Emite tu voto ahora.',
      fr: 'La version de toi qui saute l\'entraînement aujourd\'hui n\'est pas celle que tu veux devenir. Chaque répétition, chaque pas et chaque matin où tu te lèves tôt sont un vote pour ton futur toi. Vote maintenant.',
      pt: 'A versão de você que abandona o treino hoje não é a versão que você quer se tornar. Cada repetição, cada passo e cada manhã em que você acorda cedo são um voto pelo seu eu futuro. Vote agora.',
      it: 'La versione di te che salta oggi non è quella che vuoi diventare. Ogni ripetizione, ogni passo, ogni mattina presto è un voto per il tuo io futuro. Vota ora.',
    },
  },
  {
    id: 'healing_1',
    categoryId: 'emotional_healing',
    text: {
      en: 'You are allowed to rest. You are allowed to heal. The weight you carry is not yours to bear alone forever. Today, be gentle with yourself. Peace is not a destination — it is a practice.',
      de: 'Du darfst dich ausruhen. Du darfst heilen. Die Last, die du trägst, ist nicht für immer deine allein. Sei heute sanft mit dir selbst. Frieden ist kein Ziel — er ist eine Praxis.',
      es: 'Tienes permiso para descansar. Tienes permiso para sanar. No tienes que cargar para siempre y a solas con el peso que llevas. Hoy, sé amable contigo mismo. La paz no es un destino: es una práctica.',
      fr: 'Tu as le droit de te reposer. Tu as le droit de guérir. Le poids que tu portes n\'est pas à porter seul pour toujours. Aujourd\'hui, sois doux avec toi-même. La paix n\'est pas une destination — c\'est une pratique.',
      pt: 'Você tem permissão para descansar. Você tem permissão para curar. O peso que você carrega não é seu para carregar sozinho para sempre. Hoje, seja gentil consigo mesmo. A paz não é um destino — é uma prática.',
      it: 'Ti è permesso riposare. Ti è permesso guarire. Il peso che porti non è tuo da sostenere da solo per sempre. Oggi, sii gentile con te stesso. La pace non è una destinazione — è una pratica.',
    },
  },
  {
    id: 'healing_2',
    categoryId: 'emotional_healing',
    text: {
      en: 'Breathe. You have survived every difficult day so far. This morning is a new beginning. Let go of what you cannot control. Hold on to the quiet strength within you.',
      de: 'Atme. Du hast jeden schwierigen Tag bisher überstanden. Dieser Morgen ist ein neuer Anfang. Lass los, was du nicht kontrollieren kannst. Halte fest an der stillen Kraft in dir.',
      es: 'Respira. Has sobrevivido a cada día difícil hasta ahora. Esta mañana es un nuevo comienzo. Deja ir lo que no puedes controlar. Mantén la fuerza tranquila dentro de ti.',
      fr: 'Respire. Tu as survécu à chaque journée difficile jusqu\'ici. Ce matin est un nouveau départ. Laisse aller ce que tu ne peux pas contrôler. Accroche-toi à la force tranquille qui est en toi.',
      pt: 'Respire. Você sobreviveu a cada dia difícil até agora. Esta manhã é um novo começo. Deixe para trás o que você não pode controlar. Apoie-se na força silenciosa que existe dentro de você.',
      it: 'Respira. Sei sopravvissuto a ogni giorno difficile finora. Questa mattina è un nuovo inizio. Lascia andare ciò che non puoi controllare. Aggrappati alla forza silenziosa dentro di te.',
    },
  },
  {
    id: 'subconscious_1',
    categoryId: 'subconscious',
    text: {
      en: 'You are doing incredibly well. I am so proud of you and your journey. Keep sleeping peacefully. Tomorrow you will wake with clarity and purpose.',
      de: 'Du machst es unglaublich gut. Ich bin sehr stolz auf dich und deinen Weg. Schlaf weiter in Frieden. Morgen wachst du mit Klarheit und Zweck auf.',
      es: 'Lo estás haciendo increíble. Estoy muy orgulloso de ti y de tu camino. Sigue durmiendo en paz. Mañana despertarás con claridad y propósito.',
      fr: 'Tu te débrouilles incroyablement bien. Je suis si fier de toi et de ton chemin. Continue à dormir paisiblement. Demain, tu te réveilleras avec clarté et objectif.',
      pt: 'Você está indo muito bem. Tenho muito orgulho de você e do seu caminho. Continue dormindo em paz. Amanhã você acordará com clareza e propósito.',
      it: 'Stai facendo incredibilmente bene. Sono molto orgoglioso di te e del tuo cammino. Continua a dormire in pace. Domani ti sveglierai con chiarezza e scopo.',
    },
  },
  {
    id: 'reward_1',
    categoryId: 'reward_focus',
    text: {
      en: 'Excellent work maintaining focus! This is how true discipline is built. You earned it. Your future self thanks you.',
      de: 'Hervorragende Arbeit beim Aufrechterhalten des Fokus! So wird wahre Disziplin aufgebaut. Du hast es verdient. Dein zukünftiges Ich dankt dir.',
      es: '¡Excelente trabajo manteniendo el enfoque! Así es como se construye la verdadera disciplina. Te lo ganaste. Tu yo del futuro te lo agradece.',
      fr: 'Excellent travail de maintien de la concentration ! C\'est ainsi que se construit la vraie discipline. Tu l\'as mérité. Ton futur toi te remercie.',
      pt: 'Excelente trabalho mantendo o foco! É assim que se constrói a verdadeira disciplina. Você mereceu. Seu eu do futuro agradece.',
      it: 'Eccellente lavoro nel mantenere la concentrazione! È così che si costruisce la vera disciplina. Te lo sei guadagnato. Il tuo io futuro ti ringrazia.',
    },
  },
  {
    id: 'accountability_1',
    categoryId: 'accountability',
    text: {
      en: 'Seriously? Distracted again? Put the phone down right now and finish what you started. The person you want to become does not quit.',
      de: 'Ernsthaft? Schon wieder abgelenkt? Leg das Handy jetzt hin und beende, was du angefangen hast. Die Person, die du werden willst, gibt nicht auf.',
      es: '¿En serio? ¿Otra vez distrayéndote? Deja el teléfono ahora mismo y termina lo que empezaste. La persona que quieres ser no se rinde.',
      fr: 'Sérieusement ? Distrait encore ? Pose le téléphone maintenant et termine ce que tu as commencé. La personne que tu veux devenir ne renonce pas.',
      pt: 'Sério? Distraído de novo? Largue o telefone agora e termine o que começou. A pessoa que você quer se tornar não desiste.',
      it: 'Sul serio? Di nuovo distratto? Metti giù il telefono ora e finisci quello che hai iniziato. La persona che vuoi diventare non si arrende.',
    },
  },
];

export function getScript(id: string | null) {
  if (!id) return undefined;
  return SCRIPTS.find((s) => s.id === id);
}

export function getScriptsByCategory(categoryId: string) {
  return SCRIPTS.filter((s) => s.categoryId === categoryId);
}
