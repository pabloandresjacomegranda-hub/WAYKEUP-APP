import type { Language } from './types';

export interface FAQ {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
  keywords: string[];
}

export const FAQS: FAQ[] = [
  {
    id: 'what_is_waykeup',
    question: {
      en: 'What is WaykeUp?',
      de: 'Was ist WaykeUp?',
      es: '¿Qué es WaykeUp?',
      fr: 'Qu\'est-ce que WaykeUp ?',
      pt: 'O que é o WaykeUp?',
      it: 'Cos\'è WaykeUp?',
    },
    answer: {
      en: 'WaykeUp is an AI-powered alarm clock that uses synthetic voices, cloned voices of loved ones, and interactive motivators to transform your mornings into the best part of your day.',
      de: 'WaykeUp ist ein KI-gestützter Wecker, der synthetische Stimmen, geklonte Stimmen von Liebsten und interaktive Motivatoren nutzt, um deine Morgen zum besten Teil deines Tages zu machen.',
      es: 'WaykeUp es un despertador con IA que usa voces sintéticas, voces clonadas de seres queridos y motivadores interactivos para transformar tus mañanas en la mejor parte de tu día.',
      fr: 'WaykeUp est un réveil basé sur l\'IA qui utilise des voix synthétiques, des voix clonées de proches et des motivateurs interactifs pour transformer vos matins en la meilleure partie de votre journée.',
      pt: 'WaykeUp é um despertador com IA que usa vozes sintéticas, vozes clonadas de entes queridos e motivadores interativos para transformar suas manhãs na melhor parte do seu dia.',
      it: 'WaykeUp è una sveglia basata sull\'IA che usa voci sintetiche, voci clonate dei tuoi cari e motivatori interattivi per trasformare le tue mattine nella migliore parte della giornata.',
    },
    keywords: ['what', 'waykeup', 'about', 'app', 'was', 'que', 'cosa', 'qu\'est'],
  },
  {
    id: 'how_voices_work',
    question: {
      en: 'How do the AI voices work?',
      de: 'Wie funktionieren die KI-Stimmen?',
      es: '¿Cómo funcionan las voces IA?',
      fr: 'Comment fonctionnent les voix IA ?',
      pt: 'Como funcionam as vozes de IA?',
      it: 'Come funzionano le voci IA?',
    },
    answer: {
      en: 'WaykeUp uses ElevenLabs AI for text-to-speech with the eleven_multilingual_v2 model. When you select German as your alarm language, a native German voice is used so the motivation text sounds natural — no translation to English happens first.',
      de: 'WaykeUp nutzt ElevenLabs KI für Text-to-Speech mit dem Modell eleven_multilingual_v2. Wenn du Deutsch als Weckersprache wählst, wird eine deutsche Muttersprachstimme verwendet, damit der Motivationstext natürlich klingt — ohne vorherige Übersetzung ins Englische.',
      es: 'WaykeUp usa la IA de ElevenLabs para texto-a-voz con el modelo eleven_multilingual_v2. Cuando seleccionas español como idioma de alarma, se usa una voz nativa en español para que el texto de motivación suene natural — sin traducir primero al inglés.',
      fr: 'WaykeUp utilise l\'IA d\'ElevenLabs pour la synthèse vocale avec le modèle eleven_multilingual_v2. Lorsque vous sélectionnez le français comme langue de réveil, une voix native française est utilisée pour que le texte de motivation sonne naturel — sans traduction préalable en anglais.',
      pt: 'WaykeUp usa a IA da ElevenLabs para texto-para-voz com o modelo eleven_multilingual_v2. Quando você seleciona português como idioma do alarme, uma voz nativa em português é usada para que o texto de motivação soe natural — sem tradução para o inglês primeiro.',
      it: 'WaykeUp usa l\'IA di ElevenLabs per la sintesi vocale con il modello eleven_multilingual_v2. Quando selezioni l\'italiano come lingua della sveglia, viene usata una voce nativa italiana in modo che il testo di motivazione suoni naturale — senza traduzione in inglese prima.',
    },
    keywords: ['voice', 'ai', 'tts', 'elevenlabs', 'stimme', 'voz', 'voix', 'voce', 'multilingual'],
  },
  {
    id: 'how_to_create_alarm',
    question: {
      en: 'How do I create a new alarm?',
      de: 'Wie erstelle ich einen neuen Wecker?',
      es: '¿Cómo creo una nueva alarma?',
      fr: 'Comment créer un nouveau réveil ?',
      pt: 'Como criar um novo alarme?',
      it: 'Come creo una nuova sveglia?',
    },
    answer: {
      en: 'Tap the "New Alarm" button on the Alarms tab. Set the time, choose your repeat days, pick a voice persona and motivator, then tap "Create Alarm".',
      de: 'Tippe auf „Neuer Wecker" im Wecker-Tab. Stelle die Zeit ein, wähle die Wiederholungstage, wähle eine Stimm-Persona und einen Motivator und tippe dann auf „Wecker erstellen".',
      es: 'Toca el botón "Nueva Alarma" en la pestaña Alarmas. Configura la hora, elige los días de repetición, selecciona una personalidad de voz y un motivador, y luego toca "Crear Alarma".',
      fr: 'Appuyez sur le bouton "Nouveau Réveil" dans l\'onglet Réveils. Réglez l\'heure, choisissez les jours de répétition, sélectionnez une personnalité vocale et un motivateur, puis appuyez sur "Créer le Réveil".',
      pt: 'Toque no botão "Novo Alarme" na aba Alarmes. Defina a hora, escolha os dias de repetição, selecione uma personalidade de voz e um motivador, e depois toque em "Criar Alarme".',
      it: 'Tocca il pulsante "Nuova Sveglia" nella scheda Sveglie. Imposta l\'ora, scegli i giorni di ripetizione, seleziona una personalità vocale e un motivatore, poi tocca "Crea Sveglia".',
    },
    keywords: ['create', 'new', 'alarm', 'setzen', 'erstellen', 'crear', 'creer', 'creare', 'neu', 'nouveau', 'novo', 'nuova'],
  },
  {
    id: 'subconscious_mode',
    question: {
      en: 'What is Subconscious Mode?',
      de: 'Was ist der unterbewusste Modus?',
      es: '¿Qué es el Modo Subconsciente?',
      fr: 'Qu\'est-ce que le Mode Subconscient ?',
      pt: 'O que é o Modo Subconsciente?',
      it: 'Cos\'è la Modalità Subconscia?',
    },
    answer: {
      en: 'Subconscious Mode plays a soft, soothing voice once during light sleep and gently fades out without waking you. You can adjust the volume from 1% to 10%.',
      de: 'Der unterbewusste Modus spielt eine leise, beruhigende Stimme einmal im leichten Schlaf ab und blendet sanft aus, ohne dich zu wecken. Du kannst die Lautstärke von 1% bis 10% anpassen.',
      es: 'El Modo Subconsciente reproduce una voz suave y reconfortante una vez durante el sueño ligero y se desvanece sin despertarte. Puedes ajustar el volumen del 1% al 10%.',
      fr: 'Le Mode Subconscient joue une voix douce et apaisante une fois pendant le sommeil léger et s\'éteint doucement sans vous réveiller. Vous pouvez ajuster le volume de 1% à 10%.',
      pt: 'O Modo Subconsciente reproduz uma voz suave e reconfortante uma vez durante o sono leve e desaparece sem te acordar. Você pode ajustar o volume de 1% a 10%.',
      it: 'La Modalità Subconscia riproduce una voce dolce e rassicurante una volta durante il sonno leggero e si spegne dolcemente senza svegliarti. Puoi regolare il volume da 1% a 10%.',
    },
    keywords: ['subconscious', 'sleep', 'soft', 'unterbewusst', 'schlaf', 'subconsciente', 'subconscient', 'subconscia'],
  },
  {
    id: 'voice_cloning',
    question: {
      en: 'How does voice cloning work?',
      de: 'Wie funktioniert Stimmklonung?',
      es: '¿Cómo funciona la clonación de voz?',
      fr: 'Comment fonctionne le clonage vocal ?',
      pt: 'Como funciona a clonagem de voz?',
      it: 'Come funziona la clonazione vocale?',
    },
    answer: {
      en: 'Voice cloning is a Premium feature that lets you use voices of loved ones — like a grandmother, mentor, partner, or coach — as your alarm voice. Upgrade to Premium in Settings to unlock this.',
      de: 'Stimmklonung ist eine Premium-Funktion, die dir ermöglicht, Stimmen von Liebsten — wie Großmutter, Mentor, Partner oder Trainer — als Weckerstimme zu verwenden. Upgrade auf Premium in den Einstellungen, um dies freizuschalten.',
      es: 'La clonación de voz es una función Premium que te permite usar voces de seres queridos — como abuela, mentor, pareja o entrenador — como voz de tu alarma. Mejora a Premium en Ajustes para desbloquearlo.',
      fr: 'Le clonage vocal est une fonctionnalité Premium qui vous permet d\'utiliser les voix de proches — comme une grand-mère, un mentor, un partenaire ou un coach — comme voix de réveil. Passez à Premium dans les Paramètres pour le débloquer.',
      pt: 'A clonagem de voz é um recurso Premium que permite usar vozes de entes queridos — como avó, mentor, parceiro ou treinador — como voz do alarme. Atualize para Premium nas Configurações para desbloquear.',
      it: 'La clonazione vocale è una funzione Premium che ti permette di usare le voci dei tuoi cari — come nonna, mentore, partner o allenatore — come voce della sveglia. Passa a Premium nelle Impostazioni per sbloccarla.',
    },
    keywords: ['clone', 'cloning', 'klon', 'clon', 'clonage', 'clonagem', 'voice', 'stimme', 'voz', 'voix', 'voce', 'loved', 'family'],
  },
  {
    id: 'premium_features',
    question: {
      en: 'What does Premium include?',
      de: 'Was beinhaltet Premium?',
      es: '¿Qué incluye Premium?',
      fr: 'Qu\'inclut Premium ?',
      pt: 'O que inclui o Premium?',
      it: 'Cosa include Premium?',
    },
    answer: {
      en: 'Premium unlocks voice cloning, custom motivation text, all cinematic voice personas, and removes all ads. It costs $9.99/month.',
      de: 'Premium schaltet Stimmklonung, eigenen Motivationstext, alle filmischen Stimm-Personen frei und entfernt alle Werbeanzeigen. Es kostet 9,99 €/Monat.',
      es: 'Premium desbloquea la clonación de voz, texto de motivación personalizado, todas las personalidades de voz cinematográficas y elimina todos los anuncios. Cuesta 9,99 €/mes.',
      fr: 'Premium débloque le clonage vocal, le texte de motivation personnalisé, toutes les personnalités vocales cinématiques et supprime toutes les publicités. Il coûte 9,99 €/mois.',
      pt: 'Premium desbloqueia clonagem de voz, texto de motivação personalizado, todas as personalidades de voz cinematográficas e remove todos os anúncios. Custa R$ 9,99/mês.',
      it: 'Premium sblocca la clonazione vocale, il testo di motivazione personalizzato, tutte le personalità vocali cinematografiche e rimuove tutti gli annunci. Costa 9,99 €/mese.',
    },
    keywords: ['premium', 'upgrade', 'price', 'cost', 'subscription', 'features', 'preis', 'kosten', 'precio', 'prix', 'preço', 'prezzo', 'abonnement'],
  },
  {
    id: 'focus_timer',
    question: {
      en: 'How does the Focus Timer work?',
      de: 'Wie funktioniert der Fokus-Timer?',
      es: '¿Cómo funciona el Temporizador de Enfoque?',
      fr: 'Comment fonctionne le Minuteur de Concentration ?',
      pt: 'Como funciona o Temporizador de Foco?',
      it: 'Come funziona il Timer di Concentrazione?',
    },
    answer: {
      en: 'The Focus Timer helps you stay on task. Set a target time, start the session, and stay in the app. If you complete it, you hear a reward message. If you leave the app, the session fails.',
      de: 'Der Fokus-Timer hilft dir, auf Aufgabe zu bleiben. Stelle eine Zielzeit ein, starte die Sitzung und bleib in der App. Wenn du sie abschließt, hörst du eine Belohnungsnachricht. Wenn du die App verlässt, schlägt die Sitzung fehl.',
      es: 'El Temporizador de Enfoque te ayuda a mantenerte en la tarea. Configura un tiempo objetivo, inicia la sesión y quédate en la app. Si la completas, escuchas un mensaje de recompensa. Si sales de la app, la sesión falla.',
      fr: 'Le Minuteur de Concentration vous aide à rester sur la tâche. Réglez un temps cible, démarrez la session et restez dans l\'app. Si vous la terminez, vous entendez un message de récompense. Si vous quittez l\'app, la session échoue.',
      pt: 'O Temporizador de Foco te ajuda a ficar na tarefa. Defina um tempo alvo, inicie a sessão e fique no app. Se você completá-la, ouve uma mensagem de recompensa. Se sair do app, a sessão falha.',
      it: 'Il Timer di Concentrazione ti aiuta a rimanere sul compito. Imposta un tempo target, avvia la sessione e rimani nell\'app. Se la completi, senti un messaggio di ricompensa. Se lasci l\'app, la sessione fallisce.',
    },
    keywords: ['focus', 'timer', 'session', 'reward', 'fokus', 'enfoque', 'concentration', 'concentrazione', 'foco', 'belohnung', 'recompensa', 'recompense', 'ricompensa'],
  },
  {
    id: 'api_key',
    question: {
      en: 'How do I set up my ElevenLabs API key?',
      de: 'Wie richte ich meinen ElevenLabs API-Schlüssel ein?',
      es: '¿Cómo configuro mi clave API de ElevenLabs?',
      fr: 'Comment configurer ma clé API ElevenLabs ?',
      pt: 'Como configuro minha chave API da ElevenLabs?',
      it: 'Come configuro la mia chiave API ElevenLabs?',
    },
    answer: {
      en: 'Open Settings from the Alarms tab, find the "ElevenLabs API Key" section, enter your key, and tap "Save Key". Your key is stored locally and used for AI voice synthesis.',
      de: 'Öffne die Einstellungen im Wecker-Tab, finde den Bereich „ElevenLabs API-Schlüssel", gib deinen Schlüssel ein und tippe auf „Schlüssel speichern". Dein Schlüssel wird lokal gespeichert und für die KI-Stimmsynthese verwendet.',
      es: 'Abre Ajustes desde la pestaña Alarmas, busca la sección "Clave API de ElevenLabs", introduce tu clave y toca "Guardar Clave". Tu clave se guarda localmente y se usa para la síntesis de voz IA.',
      fr: 'Ouvrez les Paramètres depuis l\'onglet Réveils, trouvez la section "Clé API ElevenLabs", entrez votre clé et appuyez sur "Sauvegarder". Votre clé est stockée localement et utilisée pour la synthèse vocale IA.',
      pt: 'Abra Configurações na aba Alarmes, encontre a seção "Chave API ElevenLabs", digite sua chave e toque em "Salvar Chave". Sua chave é armazenada localmente e usada para a síntese de voz IA.',
      it: 'Apri Impostazioni dalla scheda Sveglie, trova la sezione "Chiave API ElevenLabs", inserisci la tua chiave e tocca "Salva Chiave". La tua chiave è salvata localmente e usata per la sintesi vocale IA.',
    },
    keywords: ['api', 'key', 'elevenlabs', 'setup', 'settings', 'schlüssel', 'clave', 'chiave', 'configure', 'einrichten', 'configurar', 'configurare'],
  },
  {
    id: 'languages',
    question: {
      en: 'Which languages are supported?',
      de: 'Welche Sprachen werden unterstützt?',
      es: '¿Qué idiomas son compatibles?',
      fr: 'Quelles langues sont prises en charge ?',
      pt: 'Quais idiomas são suportados?',
      it: 'Quali lingue sono supportate?',
    },
    answer: {
      en: 'WaykeUp supports English, German, Spanish, French, Portuguese, and Italian. You can set the app language and also choose a different language per alarm.',
      de: 'WaykeUp unterstützt Englisch, Deutsch, Spanisch, Französisch, Portugiesisch und Italienisch. Du kannst die App-Sprache einstellen und auch pro Wecker eine andere Sprache wählen.',
      es: 'WaykeUp admite inglés, alemán, español, francés, portugués e italiano. Puedes configurar el idioma de la app y también elegir un idioma diferente por alarma.',
      fr: 'WaykeUp prend en charge l\'anglais, l\'allemand, l\'espagnol, le français, le portugais et l\'italien. Vous pouvez définir la langue de l\'app et aussi choisir une langue différente par réveil.',
      pt: 'WaykeUp suporta inglês, alemão, espanhol, francês, português e italiano. Você pode definir o idioma do app e também escolher um idioma diferente por alarme.',
      it: 'WaykeUp supporta inglese, tedesco, spagnolo, francese, portoghese e italiano. Puoi impostare la lingua dell\'app e anche scegliere una lingua diversa per ogni sveglia.',
    },
    keywords: ['language', 'languages', 'sprache', 'idioma', 'langue', 'lingua', 'supported', 'unterstützt', 'soportado', 'supportée', 'suportado', 'supportata'],
  },
  {
    id: 'custom_text',
    question: {
      en: 'Can I write my own motivation text?',
      de: 'Kann ich meinen eigenen Motivationstext schreiben?',
      es: '¿Puedo escribir mi propio texto de motivación?',
      fr: 'Puis-je écrire mon propre texte de motivation ?',
      pt: 'Posso escrever meu próprio texto de motivação?',
      it: 'Posso scrivere il mio testo di motivazione?',
    },
    answer: {
      en: 'Yes! Premium users can write custom motivation text that gets synthesized into speech by the AI voice. In the alarm editor, scroll to "Custom Motivation Text" and type your message.',
      de: 'Ja! Premium-Nutzer können eigenen Motivationstext schreiben, der von der KI-Stimme in Sprache umgewandelt wird. Scrolle im Wecker-Editor zu „Eigener Motivationstext" und schreibe deine Nachricht.',
      es: '¡Sí! Los usuarios Premium pueden escribir texto de motivación personalizado que la voz IA sintetiza en habla. En el editor de alarma, desplázate a "Texto de Motivación Personalizado" y escribe tu mensaje.',
      fr: 'Oui ! Les utilisateurs Premium peuvent écrire un texte de motivation personnalisé qui est synthétisé en parole par la voix IA. Dans l\'éditeur de réveil, descendez à "Texte de Motivation Personnalisé" et écrivez votre message.',
      pt: 'Sim! Usuários Premium podem escrever texto de motivação personalizado que é sintetizado em fala pela voz IA. No editor de alarme, role até "Texto de Motivação Personalizado" e digite sua mensagem.',
      it: 'Sì! Gli utenti Premium possono scrivere testo di motivazione personalizzato che viene sintetizzato in parlato dalla voce IA. Nell\'editor della sveglia, scorri fino a "Testo di Motivazione Personalizzato" e scrivi il tuo messaggio.',
    },
    keywords: ['custom', 'text', 'write', 'own', 'eigener', 'personalizado', 'personnalisé', 'personalizzato', 'motivation', 'schreiben', 'escribir', 'écrire', 'scrivere'],
  },
];

export function findFAQ(query: string, lang: Language): FAQ | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const scored = FAQS.map((faq) => {
    let score = 0;
    for (const kw of faq.keywords) {
      if (q.includes(kw)) score += 2;
    }
    const questionText = faq.question[lang].toLowerCase();
    const answerText = faq.answer[lang].toLowerCase();
    const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
    for (const w of queryWords) {
      if (questionText.includes(w)) score += 1;
      if (answerText.includes(w)) score += 0.5;
    }
    return { faq, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].faq : null;
}
