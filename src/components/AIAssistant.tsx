import { useRef, useState, useEffect } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { FAQS, findFAQ } from '@/lib/faqs';
import { EMOTIONAL_TONES } from '@/lib/types';
import type { Language, EmotionalTone } from '@/lib/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface AIAssistantProps {
  onClose?: () => void;
  embedded?: boolean;
  emotionalTone?: EmotionalTone;
}

export function AIAssistant({ emotionalTone }: AIAssistantProps) {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting: Record<Language, string> = {
    en: "Hi! I'm your WaykeUp assistant. Ask me anything about alarms, voices, focus timer, or premium features.",
    de: "Hallo! Ich bin dein WaykeUp-Assistent. Frag mich alles über Wecker, Stimmen, den Fokus-Timer oder Premium-Funktionen.",
    es: "¡Hola! Soy tu asistente de WaykeUp. Pregúntame lo que quieras sobre alarmas, voces, el temporizador de enfoque o las funciones premium.",
    fr: "Salut ! Je suis ton assistant WaykeUp. Pose-moi toutes tes questions sur les réveils, les voix, le minuteur de concentration ou les fonctionnalités premium.",
    pt: "Oi! Sou seu assistente do WaykeUp. Pergunte-me qualquer coisa sobre alarmes, vozes, o temporizador de foco ou recursos premium.",
    it: "Ciao! Sono il tuo assistente WaykeUp. Chiedimi qualsiasi cosa sulle sveglie, le voci, il timer di concentrazione o le funzionalità premium.",
  };

  useEffect(() => {
    setMessages([{ id: 'greeting', role: 'assistant', text: greeting[lang] }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    const faq = findFAQ(text, lang);
    const toneConfig = emotionalTone
      ? EMOTIONAL_TONES.find((t) => t.id === emotionalTone)
      : undefined;
    const toneHint = toneConfig ? toneConfig.aiInstruction[lang] : '';

    const fallbacks: Record<Language, string> = {
      de: 'Das weiß ich leider nicht. Versuche eine der vorgeschlagenen Fragen unten.',
      es: 'Lo siento, no sé eso. Prueba una de las preguntas sugeridas a continuación.',
      fr: 'Désolé, je ne sais pas cela. Essayez l\'une des questions suggérées ci-dessous.',
      pt: 'Desculpe, não sei isso. Tente uma das perguntas sugeridas abaixo.',
      it: 'Mi dispiace, non lo so. Prova una delle domande suggerite qui sotto.',
      en: "I'm not sure about that. Try one of the suggested questions below.",
    };
    const suggestionHints: Record<Language, string> = {
      de: 'Versuche eine der vorgeschlagenen Fragen unten.',
      es: 'Prueba una de las preguntas sugeridas a continuación.',
      fr: 'Essayez l\'une des questions suggérées ci-dessous.',
      pt: 'Tente uma das perguntas sugeridas abaixo.',
      it: 'Prova una delle domande suggerite qui sotto.',
      en: 'Try one of the suggested questions below.',
    };
    const replyText = faq
      ? faq.answer[lang]
      : toneHint
        ? `${toneHint}\n\n${suggestionHints[lang]}`
        : fallbacks[lang];

    const replyMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: replyText,
    };
    setMessages((m) => [...m, replyMsg]);
  };

  const handleQuickQuestion = (faqId: string) => {
    const faq = FAQS.find((f) => f.id === faqId);
    if (!faq) return;
    const text = faq.question[lang];
    setInput(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pt-8 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-600 bg-ink-800">
          <Sparkles className="h-5 w-5 text-accent-cyan" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{t('assistant.title')}</h1>
          <p className="text-xs text-slate-500">{t('assistant.subtitle')}</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent-cyan/15 text-slate-100 rounded-br-md'
                  : 'bg-ink-800 text-slate-300 rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && msg.id !== 'greeting' && (
                <div className="mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
                  <span className="text-[10px] font-medium uppercase tracking-wide text-accent-cyan/70">
                    {t('assistant.botName')}
                  </span>
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-2">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-600">
          {t('assistant.suggested')}
        </p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {FAQS.slice(0, 5).map((faq) => (
            <button
              key={faq.id}
              type="button"
              onClick={() => handleQuickQuestion(faq.id)}
              className="shrink-0 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-accent-cyan/40 hover:text-accent-cyan active:scale-95"
            >
              {faq.question[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-ink-700/60 px-5 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-600 bg-ink-800 px-3 py-2.5">
          <MessageCircle className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('assistant.placeholder')}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-cyan text-ink-950 transition-all hover:shadow-glow disabled:opacity-40 active:scale-95"
          aria-label={t('assistant.send')}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
