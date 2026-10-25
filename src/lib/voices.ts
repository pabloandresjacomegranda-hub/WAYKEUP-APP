import type { VoicePersona } from './types';

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'aura',
    name: {
      en: 'Aura',
      de: 'Aura',
      es: 'Aura',
      fr: 'Aura',
      pt: 'Aura',
      it: 'Aura',
    },
    description: {
      en: 'Calm and grounding, eases you into the morning',
      de: 'Ruhig und erdend, führt dich sanft in den Morgen',
      es: 'Calma y centrada, te introduce suavemente en la mañana',
      fr: 'Calme et ancrée, vous accompagne en douceur dans le matin',
      pt: 'Calma e centradora, te introduz suavemente na manhã',
      it: 'Calma e radicata, ti accompagna dolcemente nel mattino',
    },
    tier: 'standard',
    accent: '#22d3ee',
  },
  {
    id: 'ember',
    name: {
      en: 'Ember',
      de: 'Ember',
      es: 'Brasa',
      fr: 'Braise',
      pt: 'Brasa',
      it: 'Brace',
    },
    description: {
      en: 'Warm and cheerful, like morning sunlight',
      de: 'Warm und fröhlich, wie Morgenlicht',
      es: 'Cálida y alegre, como la luz de la mañana',
      fr: 'Chaleureuse et joyeuse, comme la lumière du matin',
      pt: 'Calorosa e alegre, como a luz da manhã',
      it: 'Calda e allegra, come la luce del mattino',
    },
    tier: 'standard',
    accent: '#fbbf24',
  },
  {
    id: 'sage',
    name: {
      en: 'Sage',
      de: 'Sage',
      es: 'Sabia',
      fr: 'Sage',
      pt: 'Sábia',
      it: 'Saggia',
    },
    description: {
      en: 'Steady and wise, a thoughtful start',
      de: 'Beständig und weise, ein bedachter Start',
      es: 'Constante y sabia, un comienzo reflexivo',
      fr: 'Constante et sage, un début réfléchi',
      pt: 'Constante e sábia, um começo reflexivo',
      it: 'Ferma e saggia, un inizio riflessivo',
    },
    tier: 'standard',
    accent: '#34d399',
  },
  {
    id: 'nova',
    name: {
      en: 'Nova',
      de: 'Nova',
      es: 'Nova',
      fr: 'Nova',
      pt: 'Nova',
      it: 'Nova',
    },
    description: {
      en: 'Bright and energetic, built to spark momentum',
      de: 'Hell und energiegeladen, um Schwung zu erzeugen',
      es: 'Brillante y enérgica, diseñada para impulsar',
      fr: 'Lumineuse et énergique, conçue pour lancer l\'élan',
      pt: 'Brilhante e enérgica, feita para gerar impulso',
      it: 'Vivace ed energica, creata per dare slancio',
    },
    tier: 'premium',
    accent: '#818cf8',
  },
  {
    id: 'onyx',
    name: {
      en: 'Onyx',
      de: 'Onyx',
      es: 'Ónix',
      fr: 'Onyx',
      pt: 'Ônix',
      it: 'Onice',
    },
    description: {
      en: 'Deep and commanding, the voice of a champion',
      de: 'Tief und befehlend, die Stimme eines Champions',
      es: 'Profunda y autoritaria, la voz de un campeón',
      fr: 'Profonde et autoritaire, la voix d\'un champion',
      pt: 'Profunda e autoritária, a voz de um campeão',
      it: 'Profonda e autoritaria, la voce di un campione',
    },
    tier: 'premium',
    accent: '#c084fc',
  },
  {
    id: 'lumen',
    name: {
      en: 'Lumen',
      de: 'Lumen',
      es: 'Lumen',
      fr: 'Lumen',
      pt: 'Lumen',
      it: 'Lumen',
    },
    description: {
      en: 'Cinematic and inspiring, narrated like a trailer',
      de: 'Filmisch und inspirierend, erzählt wie ein Trailer',
      es: 'Cinematográfica e inspiradora, narrada como un tráiler',
      fr: 'Cinématique et inspirante, narrée comme une bande-annonce',
      pt: 'Cinematográfica e inspiradora, narrada como um trailer',
      it: 'Cinematografica e ispiratrice, narrata come un trailer',
    },
    tier: 'premium',
    accent: '#f472b6',
  },
];

export function getVoicePersona(id: string): VoicePersona | undefined {
  return VOICE_PERSONAS.find((v) => v.id === id);
}
