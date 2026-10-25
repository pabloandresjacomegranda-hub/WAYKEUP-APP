import type { Language } from './types';

export type RegionalAccent = 'none' | 'paisa' | 'costeno' | 'serrano' | 'carioca' | 'gaucho' | 'andaluz' | 'chilango' | 'rioplatense';

export const REGIONAL_ACCENTS: {
  id: RegionalAccent;
  name: Record<Language, string>;
  description: Record<Language, string>;
  emoji: string;
  languages: Language[];
}[] = [
  { id: 'none', name: { en: 'Natural', de: 'Natürlich', es: 'Natural', fr: 'Naturel', pt: 'Natural', it: 'Naturale' }, description: { en: 'No accent modification', de: 'Keine Akzentänderung', es: 'Sin modificación de acento', fr: 'Sans modification d\'accent', pt: 'Sem modificação de sotaque', it: 'Senza modifica di accento' }, emoji: '🌍', languages: ['en', 'de', 'es', 'fr', 'pt', 'it'] },
  { id: 'paisa', name: { en: 'Paisa', de: 'Paisa', es: 'Paisa', fr: 'Paisa', pt: 'Paisa', it: 'Paisa' }, description: { en: 'Colombian Antioquia — warm, melodic, "parcero" dialect', de: 'Kolumbianisch-Antioquia — warm, melodisch, "parcero"-Dialekt', es: 'Antioqueño cálido y melodioso, dialecto "parcero"', fr: 'Colombien d\'Antioquia — chaleureux, mélodieux, dialecte "parcero"', pt: 'Colombiano de Antioquia — quente, melodioso, dialeto "parcero"', it: 'Colombiano di Antioquia — caldo, melodico, dialetto "parcero"' }, emoji: '🇨🇴', languages: ['es'] },
  { id: 'costeno', name: { en: 'Costeño', de: 'Costeño', es: 'Costeño', fr: 'Costeño', pt: 'Costeño', it: 'Costeño' }, description: { en: 'Colombian Caribbean — relaxed, rhythmic, coastal dialect', de: 'Kolumbianisch-Karibik — entspannt, rhythmisch, karibischer Dialekt', es: 'Caribe colombiano — relajado, rítmico, dialecto costero', fr: 'Caraïbe colombien — détendu, rythmé, dialecte côtier', pt: 'Caribe colombiano — relaxado, rítmico, dialeto costeiro', it: 'Caraibico colombiano — rilassato, ritmato, dialetto costiero' }, emoji: '🏖️', languages: ['es'] },
  { id: 'serrano', name: { en: 'Serrano', de: 'Serrano', es: 'Serrano', fr: 'Serrano', pt: 'Serrano', it: 'Serrano' }, description: { en: 'Andean highland — formal, rolled R, mountain dialect', de: 'Anden-Hochland — formell, gerolltes R, Bergdialekt', es: 'Altiplano andino — formal, erre vibrante, dialecto de montaña', fr: 'Hauts plateaux andins — formel, R roulé, dialecte montagnard', pt: 'Altiplano andino — formal, erre vibrante, dialeto de montanha', it: 'Altopiano andino — formale, R vibrante, dialetto montano' }, emoji: '🏔️', languages: ['es'] },
  { id: 'carioca', name: { en: 'Carioca', de: 'Carioca', es: 'Carioca', fr: 'Carioca', pt: 'Carioca', it: 'Carioca' }, description: { en: 'Rio de Janeiro — breezy, musical, beach-city charm', de: 'Rio de Janeiro — locker, musikalisch, Strandstadt-Charme', es: 'Río de Janeiro — suelto, musical, encanto de ciudad playa', fr: 'Rio de Janeiro — aisé, musical, charme de ville plage', pt: 'Rio de Janeiro — solto, musical, charme de cidade praiana', it: 'Rio de Janeiro — sciolto, musicale, fascino di città di spiaggia' }, emoji: '🏖️', languages: ['pt'] },
  { id: 'gaucho', name: { en: 'Gaucho', de: 'Gaucho', es: 'Gaucho', fr: 'Gaucho', pt: 'Gaúcho', it: 'Gaucho' }, description: { en: 'Southern Brazilian — strong, rural, "tchê" warmth', de: 'Südbrasilianisch — stark, ländlich, "tchê"-Wärme', es: 'Sur de Brasil — fuerte, rural, calidez "tchê"', fr: 'Sud brésilien — fort, rural, chaleur "tchê"', pt: 'Sul do Brasil — forte, rural, calor "tchê"', it: 'Sud brasiliano — forte, rurale, calore "tchê"' }, emoji: '🤠', languages: ['pt'] },
  { id: 'andaluz', name: { en: 'Andalusian', de: 'Andalusisch', es: 'Andaluz', fr: 'Andalou', pt: 'Andaluz', it: 'Andaluso' }, description: { en: 'Southern Spain — dropped consonants, sunny dialect', de: 'Südspanien — verschluckte Konsonanten, sonniger Dialekt', es: 'Sur de España — consonantes omitidas, dialecto soleado', fr: 'Sud de l\'Espagne — consonnes omises, dialecte ensoleillé', pt: 'Sul da Espanha — consoantes omitidas, dialeto ensolarado', it: 'Sud della Spagna — consonanti omesse, dialetto soleggiato' }, emoji: '☀️', languages: ['es'] },
  { id: 'chilango', name: { en: 'Chilango', de: 'Chilango', es: 'Chilango', fr: 'Chilango', pt: 'Chilango', it: 'Chilango' }, description: { en: 'Mexico City — urban, fast, witty dialect', de: 'Mexiko-Stadt — urban, schnell, gewitzter Dialekt', es: 'Ciudad de México — urbano, rápido, dialecto ingenioso', fr: 'Mexico City — urbain, rapide, dialecte astucieux', pt: 'Cidade do México — urbano, rápido, dialeto engenhoso', it: 'Città del Messico — urbano, veloce, dialetto arguto' }, emoji: '🌮', languages: ['es'] },
  { id: 'rioplatense', name: { en: 'Rioplatense', de: 'Rioplatense', es: 'Rioplatense', fr: 'Rioplatense', pt: 'Rioplatense', it: 'Rioplatense' }, description: { en: 'Buenos Aires — melodic, "sh" sounds, porteño dialect', de: 'Buenos Aires — melodisch, "sh"-Laute, Porteño-Dialekt', es: 'Buenos Aires — melodioso, sonidos "sh", dialecto porteño', fr: 'Buenos Aires — mélodieux, sons "ch", dialecte porteño', pt: 'Buenos Aires — melodioso, sons "sh", dialeto porteño', it: 'Buenos Aires — melodico, suoni "sh", dialetto porteño' }, emoji: '🧉', languages: ['es'] },
];

export function getRegionalAccentsForLanguage(lang: Language) {
  return REGIONAL_ACCENTS.filter((a) => a.languages.includes(lang));
}

export function getRegionalAccent(id: RegionalAccent) {
  return REGIONAL_ACCENTS.find((a) => a.id === id);
}

function rw(text: string, word: string, replacement: string): string {
  return text.replace(new RegExp(`\\b${word}\\b`, 'gi'), (m) =>
    m[0] === m[0].toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement
  );
}

function rws(text: string, pairs: [string, string][]): string {
  return pairs.reduce((t, [from, to]) => rw(t, from, to), text);
}

// SERRANO: formal "usted" + mountain vocabulary
const SERRANO_FORMAL: [string, string][] = [
  ['tú', 'usted'], ['tus', 'sus'], ['tienes', 'tiene'], ['estás', 'está'],
  ['eres', 'es'], ['puedes', 'puede'], ['quieres', 'quiere'], ['sabes', 'sabe'],
  ['haces', 'hace'], ['vas', 'va'], ['te', 'se'], ['tu', 'su'],
  ['dime', 'dígame'], ['haz', 'haga'], ['pon', 'ponga'],
  ['ten', 'tenga'], ['sé', 'sepa'], ['ven', 'venga'], ['sal', 'salga'],
  ['mira', 'mire'], ['escucha', 'escuche'],
  ['despierta', 'despierte'], ['levántate', 'levántese'],
  ['siéntate', 'siéntese'], ['cállate', 'cállese'],
  ['empieza', 'empiece'], ['termina', 'termine'], ['sigue', 'siga'],
  ['espera', 'espere'], ['busca', 'busque'], ['prueba', 'pruebe'],
  ['bueno', 'adecuado'], ['malo', 'inadecuado'],
  ['hermoso', 'lindo'], ['hermosa', 'linda'],
  ['hombre', 'señor'], ['mujer', 'señora'], ['chico', 'joven'],
  ['chica', 'jovencita'], ['niño', 'infante'], ['amigo', 'compita'],
  ['dinero', 'recursos'], ['trabajo', 'labor'], ['casa', 'hogar'],
  ['hablar', 'conversar'], ['decir', 'manifestar'],
  ['hoy', 'el día de hoy'], ['ahora', 'en este momento'],
  ['después', 'posteriormente'], ['antes', 'previamente'],
  ['bien', 'adecuadamente'],
  ['seguro', 'cierto'], ['importante', 'relevante'],
  ['excelente', 'muy bien'], ['genial', 'estupendo'], ['increíble', 'extraordinario'],
  ['hace mucho', 'hace rato'], ['hace rato', 'hace rato'],
  ['¿cómo estás', '¿cómo se encuentra'], ['¿cómo está', '¿cómo se encuentra'],
  ['¿qué tal', '¿cómo se encuentra'],
  ['me alegro', 'me complace'], ['encantado', 'muy complacido'],
  ['vamos a', 'procedamos a'], ['tengo que', 'debo'], ['quiero', 'deseo'],
  ['no te preocupes', 'no se preocupe'],
  ['no te rindas', 'no se rinda'],
  ['tú puedes', 'usted puede'], ['tú vales', 'usted vale'],
  ['bien hecho', 'muy bien realizado'],
  ['buen trabajo', 'buena labor'],
  ['sigue así', 'siga así'],
  ['no pares', 'no se detenga'],
  ['vamos', 'procedemos'], ['hola', 'saludos'],
  ['buenos días', 'buen día'],
  ['buenas tardes', 'buenas tardes'],
  ['buenas noches', 'buenas noches'],
  ['gracias', 'le agradezco'],
  ['por favor', 'por favor'],
  ['¿me entiendes', '¿me comprende'], ['¿entiendes', '¿comprende'],
  ['¿verdad', '¿no es así'],
];

const PAISA_SLANG: [string, string][] = [
  ['amigo', 'parcero'], ['amigos', 'parceros'], ['muchacho', 'parcero'],
  ['muchachos', 'parceros'], ['chico', 'parcero'], ['chicos', 'parceros'],
  ['compañero', 'parcero'], ['hombre', 'man'], ['mujer', 'vieja'],
  ['trabajo', 'pega'], ['dinero', 'platica'], ['plata', 'platica'],
  ['vamos', 'vamos pues'], ['excelente', 'bacanísimo'], ['genial', 'bacano'],
  ['increíble', 'bacanísimo'], ['perfecto', 'bacanísimo'], ['hermoso', 'chévere'],
  ['bien', 'bacano'], ['bueno', 'bacano'], ['hola', 'quiubo'],
  ['buenas', 'quiubo'], ['rápido', 'al toque'], ['despacio', 'suave'],
  ['de verdad', 'de una'], ['en serio', 'de una'],
  ['aburrido', 'desaburrido'], ['divertido', 'chévere'],
  ['guapo', 'lindo'], ['feo', 'salao'], ['listo', 'al toque'],
  ['seguro', 'bacano'], ['difícil', 'chimba'], ['fácil', 'al toque'],
  ['caro', 'salao'], ['barato', 'baratico'],
  ['pequeño', 'chiquito'], ['ahora', 'ahora mismo'],
  ['entonces', 'pues entonces'], ['enojado', 'arrechado'],
  ['cansado', 'reventado'], ['feliz', 'súper contento'],
  ['triste', 'desanimado'], ['contento', 'súper contento'],
  ['interesante', 'chévere'],
  ['mira', 'vea'], ['mire', 'vea'], ['oiga', 'vea parcero'], ['escucha', 'vea'],
  ['despierta', 'despierta parcero'], ['levántate', 'levántate parcero'],
  ['buenos días', 'quiubo parcero'], ['buenas noches', 'quiubo parcero'],
  ['hace mucho', 'hace rato'], ['hace rato', 'hace rato'],
  ['¿cómo estás', '¿cómo estás parcero'], ['¿cómo está', '¿cómo va'],
  ['¿qué más', 'quiubo parcero'], ['¿qué hubo', 'quiubo parcero'],
  ['me alegro', 'qué bacano'], ['encantado', 'qué chimba'],
  ['no te preocupes', 'tranquilo parcero'],
  ['no te rindas', 'no te rindas parcero'],
  ['tú puedes', 'tú puedes parcero, al toque'],
  ['tú vales', 'vales oro parcero'],
  ['bien hecho', 'qué bacano parcero'],
  ['buen trabajo', 'buena pega parcero'],
  ['sigue así', 'sigue así parcero'],
  ['no pares', 'no pares parcero, al toque'],
  ['vamos a', 'vamos pues a'],
  ['¿me entiendes', 'me entiende parcero'],
  ['a ver', 'vea parcero'],
  ['¿verdad', '¿o no parcero'],
];

const COSTENO_SLANG: [string, string][] = [
  ['para', 'pa'], ['está', 'ta'], ['estás', 'tás'], ['están', 'tán'],
  ['amigo', 'compae'], ['amigos', 'compaes'], ['hermano', 'compae'],
  ['muchacho', 'chigüiro'], ['muchachos', 'chigüiros'],
  ['hola', 'quiubo'], ['buenas', 'quiubo'],
  ['buenos días', 'quiubo compae'], ['buenas noches', 'quiubo compae'],
  ['dinero', 'plata'], ['trabajo', 'chamba'], ['rápido', 'al toque'],
  ['despacio', 'despacito'], ['bien', 'todo bien'], ['bueno', 'bacano'],
  ['genial', 'bacano'], ['excelente', 'bacanísimo'],
  ['hermoso', 'bacano'], ['hermosa', 'bacana'], ['increíble', 'bacano'],
  ['mujer', 'jeva'], ['hombre', 'man'], ['chica', 'jeva'], ['chico', 'man'],
  ['persona', 'compae'], ['gente', 'compaes'], ['escucha', 'oí'],
  ['mira', 've'], ['mire', 've'], ['oiga', 'oye compae'],
  ['despierta', 'despierta compae'], ['levántate', 'arriba compae'],
  ['niño', 'chigüiro'], ['niña', 'chigüira'],
  ['platicar', 'conversar'], ['hablar', 'conversar'],
  ['tener', 'tené'], ['hacer', 'hacé'], ['saber', 'sabé'],
  ['muy', 'súper'], ['grande', 'grandote'], ['pequeño', 'chiquito'],
  ['caro', 'carísimo'], ['barato', 'baratico'], ['divertido', 'bacano'],
  ['guapo', 'lindo'], ['listo', 'al toque'], ['sí', 'claro'],
  ['no', 'no, oye compae'],
  ['hace mucho', 'hace rato'], ['hace rato', 'hace rato'],
  ['¿cómo estás', '¿cómo tás compae'], ['¿cómo está', '¿cómo ta'],
  ['¿qué más', 'quiubo compae'], ['¿qué hubo', 'quiubo compae'],
  ['me alegro', 'qué bacano compae'],
  ['no te preocupes', 'tranquilo compae'],
  ['no te rindas', 'no te rindas compae'],
  ['tú puedes', 'tú puedes compae, al toque'],
  ['tú vales', 'vales plata compae'],
  ['bien hecho', 'qué bacano compae'],
  ['buen trabajo', 'buena chamba compae'],
  ['sigue así', 'sigue así compae'],
  ['no pares', 'no pares compae, al toque'],
  ['¿me entiendes', 'me entiendes compae'],
  ['a ver', 'vea compae'], ['¿verdad', '¿o no compae'],
];

const ANDALUZ_SLANG: [string, string][] = [
  ['para', 'pa'], ['está', 'tá'], ['estás', 'tás'], ['están', 'tán'],
  ['niño', 'illo'], ['niña', 'illa'], ['amigo', 'illo'],
  ['amigos', 'illos'], ['hola', 'qué pasa'], ['buenas', 'qué pasa'],
  ['buenos días', 'qué pasa illo'], ['buenas noches', 'qué pasa illo'],
  ['vamos', 'vamo'], ['trabajo', 'curro'], ['dinero', 'pasta'],
  ['rápido', 'ligero'], ['despacio', 'despacito'],
  ['bien', 'fenomenal'], ['bueno', 'fino'], ['genial', 'fino'],
  ['excelente', 'cojonudo'], ['hermoso', 'guapo'],
  ['increíble', 'de lujo'], ['mujer', 'tía'], ['hombre', 'tío'],
  ['chica', 'tía'], ['chico', 'tío'],
  ['mira', 'mira illo'], ['mire', 'mira illo'],
  ['oiga', 'oye illo'], ['escucha', 'oye illo'],
  ['despierta', 'despierta illo'], ['levántate', 'arriba illo'],
  ['muy', 'mu'], ['pequeño', 'chiquito'],
  ['divertido', 'guay'],
  ['guapo', 'bueno'],
  ['sí', 'claro illo'], ['no', 'no, oye illo'],
  ['hace mucho', 'hace rato'], ['hace rato', 'hace rato'],
  ['¿cómo estás', '¿cómo tás illo'], ['¿cómo está', '¿cómo tá'],
  ['me alegro', 'qué guay illo'],
  ['no te preocupes', 'tranquilo illo'],
  ['no te rindas', 'no te rindas illo'],
  ['tú puedes', 'tú puedes illo'],
  ['bien hecho', 'qué bueno illo'],
  ['buen trabajo', 'buen curro illo'],
  ['sigue así', 'sigue así illo'],
  ['no pares', 'no pares illo'],
  ['¿me entiendes', 'me entiendes illo'],
  ['a ver', 'a ver illo'], ['¿verdad', '¿o no illo'],
];

const CHILANGO_SLANG: [string, string][] = [
  ['muchacho', 'chavo'], ['muchachos', 'chavos'], ['amigo', 'carnal'],
  ['amigos', 'carnales'], ['hermano', 'carnal'], ['hombre', 'wey'],
  ['mujer', 'wey'], ['chico', 'chavo'], ['chica', 'chava'],
  ['chicos', 'chavos'], ['chicas', 'chavas'], ['hola', 'qué onda'],
  ['buenas', 'qué onda'], ['buenos días', 'qué onda carnal'],
  ['buenas noches', 'qué onda carnal'], ['vamos', 'ámonos'],
  ['trabajo', 'chamba'], ['dinero', 'varo'], ['rápido', 'rapidín'],
  ['despacio', 'despacito'], ['bien', 'padrísimo'], ['bueno', 'padrísimo'],
  ['genial', 'padrísimo'], ['excelente', 'padrísimo'],
  ['increíble', 'padrísimo'], ['perfecto', 'padrísimo'],
  ['hermoso', 'padre'], ['hermosa', 'padre'], ['divertido', 'padre'],
  ['aburrido', 'aburrido wey'], ['guapo', 'guapo carnal'],
  ['feo', 'feo wey'], ['listo', 'listo carnal'], ['sí', 'simón'],
  ['no', 'nel'], ['mira', 'mira carnal'], ['mire', 'mira carnal'],
  ['oiga', 'oye carnal'], ['escucha', 'oye carnal'],
  ['despierta', 'despierta carnal'], ['levántate', 'arriba carnal'],
  ['muy', 'bien'], ['grande', 'grandote'], ['pequeño', 'chiquito'],
  ['enojado', 'encabronado wey'], ['cansado', 'molido wey'],
  ['feliz', 'contento carnal'], ['triste', 'triste wey'],
  ['contento', 'contento carnal'], ['interesante', 'padre carnal'],
  ['hace mucho', 'hace rato carnal'], ['hace rato', 'hace rato carnal'],
  ['¿cómo estás', 'qué onda, cómo estás carnal'],
  ['me alegro', 'qué padre carnal'],
  ['no te preocupes', 'tranquilo carnal'],
  ['no te rindas', 'no te rindas carnal'],
  ['tú puedes', 'tú puedes carnal'],
  ['tú vales', 'vales mucho carnal'],
  ['bien hecho', 'qué padrísimo carnal'],
  ['buen trabajo', 'buena chamba carnal'],
  ['sigue así', 'sigue así carnal'],
  ['no pares', 'no pares carnal'],
  ['¿me entiendes', 'me entiendes carnal'],
  ['a ver', 'a ver carnal'], ['¿verdad', '¿o no carnal'],
];

const RIOPLATENSE_SLANG: [string, string][] = [
  ['tú', 'vos'], ['tienes', 'tenés'], ['tienes que', 'tenés que'],
  ['eres', 'sos'], ['puedes', 'podés'],
  ['quieres', 'querés'], ['sabes', 'sabés'], ['haces', 'hacés'],
  ['amigo', 'che'], ['amigos', 'ches'], ['hermano', 'che'],
  ['muchacho', 'pibe'], ['muchachos', 'pibes'], ['chico', 'pibe'],
  ['chica', 'piba'], ['chicos', 'pibes'], ['chicas', 'pibas'],
  ['hola', 'che, hola'], ['buenas', 'che, buenas'],
  ['buenos días', 'che, buenos días'], ['buenas noches', 'che, buenas noches'],
  ['trabajo', 'laburo'], ['dinero', 'mango'], ['rápido', 'al toque'],
  ['bien', 'copado'], ['bueno', 'copado'],
  ['genial', 'copado'], ['excelente', 'copado'], ['increíble', 'copado'],
  ['hermoso', 'copado'], ['hermosa', 'copada'], ['divertido', 'copado'],
  ['aburrido', 'aburrido che'], ['guapo', 'lindo'], ['feo', 'feo che'],
  ['listo', 'al toque'], ['sí', 'dale'], ['no', 'no, che'],
  ['mira', 'mirá'], ['mire', 'mirá'], ['oiga', 'escuchá che'],
  ['escucha', 'escuchá che'], ['despierta', 'despertate che'],
  ['levántate', 'levantate che'],
  ['pequeño', 'chiquito'],
  ['hace mucho', 'hace rato che'], ['hace rato', 'hace rato che'],
  ['¿cómo estás', '¿cómo estás che'],
  ['me alegro', 'qué copado che'],
  ['no te preocupes', 'no te preocupes che'],
  ['no te rindas', 'no te rindas che, dale'],
  ['tú puedes', 'vos podés che'],
  ['tú vales', 'valés che'],
  ['bien hecho', 'qué copado che'],
  ['buen trabajo', 'buen laburo che'],
  ['sigue así', 'seguí así che'],
  ['no pares', 'no pares che, dale'],
  ['¿me entiendes', 'me entendés che'],
  ['a ver', 'mirá che'], ['¿verdad', '¿no che'],
];

const CARIOCA_SLANG: [string, string][] = [
  ['você', 'cê'], ['está', 'tá'], ['estás', 'tás'], ['estão', 'tão'],
  ['para', 'pra'], ['legal', 'massa'], ['ótimo', 'massa'],
  ['bom', 'massa'],
  ['amigo', 'mano'], ['amigos', 'manos'], ['rapaz', 'mano'],
  ['rapazes', 'manos'], ['mulher', 'mina'], ['homem', 'mano'],
  ['garoto', 'mano'], ['garota', 'mina'], ['pessoa', 'mano'],
  ['gente', 'galera'], ['trabalho', 'trampo'], ['dinheiro', 'grana'],
  ['bem', 'massa'],
  ['excelente', 'massa'], ['incrível', 'massa'], ['perfeito', 'massa'],
  ['entediado', 'chato'],
  ['pronto', 'na régua'], ['sim', 'com certeza'], ['não', 'não, mano'],
  ['olha', 'ó'], ['olhe', 'ó'], ['ouça', 'ó mano'],
  ['escuta', 'ó mano'], ['acorda', 'acorda mano'],
  ['levanta', 'levanta mano'],
  ['pequeno', 'pequeninho'],
  ['feliz', 'muito feliz mano'], ['triste', 'triste mano'],
  ['cansado', 'destruído mano'],
  ['hoje', 'hoje mano'], ['agora', 'agora mano'],
  ['depois', 'depois mano'], ['então', 'então mano'],
  ['obrigado', 'valeu mano'], ['obrigada', 'valeu mano'],
];

const GAUCHO_SLANG: [string, string][] = [
  ['você', 'tu'], ['está', 'tá'], ['estás', 'tás'], ['estão', 'tão'],
  ['para', 'pra'], ['muito', 'tri'], ['bom', 'tri bom'],
  ['ótimo', 'tri bom'], ['legal', 'tri legal'], ['amigo', 'tchê'],
  ['amigos', 'tchês'], ['rapaz', 'tchê'], ['pessoa', 'tchê'],
  ['gente', 'guria'], ['trabalho', 'trampo'], ['dinheiro', 'grana'],
  ['bem', 'tri bem'], ['excelente', 'tri bom'], ['incrível', 'tri bom'],
  ['perfeito', 'tri bom'],
  ['divertido', 'tri legal'],
  ['pronto', 'na régua'], ['sim', 'certo tchê'], ['não', 'não tchê'],
  ['olha', 'ó tchê'], ['olhe', 'ó tchê'], ['ouça', 'ó tchê'],
  ['escuta', 'ó tchê'], ['acorda', 'acorda tchê'],
  ['levanta', 'levanta tchê'],
  ['feliz', 'tri feliz tchê'],
  ['triste', 'tri triste tchê'],
  ['cansado', 'tri cansado tchê'],
  ['hoje', 'hoje tchê'], ['agora', 'agora tchê'],
  ['depois', 'depois tchê'], ['então', 'então tchê'],
  ['obrigado', 'valeu tchê'], ['obrigada', 'valeu tchê'],
];

const ACCENT_MARKERS: Record<Exclude<RegionalAccent, 'none'>, string[]> = {
  paisa: ['parcero', 'bacano', 'quiubo'],
  costeno: ['compae', 'bacano', 'quiubo'],
  serrano: ['señor', 'señora'],
  andaluz: ['illo', 'illa'],
  chilango: ['carnal', 'wey', 'padrísimo'],
  rioplatense: ['che', 'copado'],
  carioca: ['mano', 'massa'],
  gaucho: ['tchê', 'tri'],
};

function limitRepeatedMarkers(text: string, markers: string[]): string {
  return text
    .split(/([.!?]+\s*)/)
    .map((part) => {
      if (/^[.!?]/.test(part)) return part;
      const seen = new Set<string>();
      let result = part;
      for (const marker of markers) {
        const pattern = new RegExp(`\\b${marker}\\b`, 'gi');
        result = result.replace(pattern, (match) => {
          const key = match.toLocaleLowerCase();
          if (seen.has(key)) return '';
          seen.add(key);
          return match;
        });
      }
      return result.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function applyAccentToText(text: string, accent: RegionalAccent): string {
  let transformed: string;
  switch (accent) {
    case 'paisa': transformed = rws(text, PAISA_SLANG); break;
    case 'costeno': transformed = rws(text, COSTENO_SLANG); break;
    case 'serrano': transformed = rws(text, SERRANO_FORMAL); break;
    case 'andaluz': transformed = rws(text, ANDALUZ_SLANG); break;
    case 'chilango': transformed = rws(text, CHILANGO_SLANG); break;
    case 'rioplatense': transformed = rws(text, RIOPLATENSE_SLANG); break;
    case 'carioca': transformed = rws(text, CARIOCA_SLANG); break;
    case 'gaucho': transformed = rws(text, GAUCHO_SLANG); break;
    case 'none':
    default: return text;
  }
  return limitRepeatedMarkers(transformed, ACCENT_MARKERS[accent]);
}
