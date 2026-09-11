
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { MonthlyData } from '../types';

interface ChatBotProps {
  isDarkMode: boolean;
  data: MonthlyData[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ isDarkMode, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou seu assistente virtual de dados. Posso ajudar com análises sobre alcance, engajamento e métricas das redes sociais do CSSJD. O que gostaria de saber?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatSession = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const initChat = () => {
    if (!chatSession.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSession.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `Você é um assistente de análise de dados especialista em redes sociais para o dashboard "Redes Sociais do CSSJD".
          
          Seu objetivo é ajudar a equipe a entender o desempenho, tendências e insights.
          Responda de forma profissional, direta e estratégica. Use formatação simples.
          
          Aqui estão os dados atuais do dashboard (JSON) que você deve usar como base de conhecimento:
          ${JSON.stringify(data)}
          
          Regras:
          1. Use sempre os dados fornecidos. Se a pergunta for sobre um mês que não existe nos dados, informe que não há dados disponíveis.
          2. Ao citar números, formate-os para o padrão brasileiro (ex: 10.000, 23,5%).
          3. Analise tendências se solicitado (crescimento, queda).
          4. Seja conciso.
          `,
        },
      });
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      initChat();
      if (chatSession.current) {
        const result = await chatSession.current.sendMessage({ message: userMsg });
        const responseText = result.text;
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClass = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const buttonClass = isDarkMode 
    ? 'bg-slate-800 text-neon-glowBlue border border-neon-glowBlue shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-slate-700' 
    : 'bg-brand-600 text-white shadow-lg hover:bg-brand-700';
  
  const windowClass = isDarkMode
    ? 'bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
    : 'bg-white border border-slate-200 shadow-2xl';

  const headerClass = isDarkMode
    ? 'bg-slate-950 border-b border-slate-800 text-neon-glowBlue'
    : 'bg-brand-600 text-white rounded-t-xl';

  const inputAreaClass = isDarkMode
    ? 'bg-slate-950 border-t border-slate-800'
    : 'bg-slate-50 border-t border-slate-200 rounded-b-xl';

  const inputClass = isDarkMode
    ? 'bg-slate-900 border-slate-700 text-slate-200 focus:ring-neon-glowBlue placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-900 focus:ring-brand-500 placeholder-slate-400';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${containerClass} font-sans print:hidden`}>
      {isOpen && (
        <div className={`mb-4 w-[90vw] md:w-[400px] h-[500px] rounded-xl flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${windowClass}`}>
          <div className={`p-4 flex justify-between items-center rounded-t-xl ${headerClass}`}>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className={isDarkMode ? 'text-neon-purple' : 'text-yellow-300'} />
              <h3 className="font-bold">IA Assistant CSSJD</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-black/20 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600')
                    : (isDarkMode ? 'bg-neon-glowBlue/20 text-neon-glowBlue' : 'bg-brand-100 text-brand-600')
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-line leading-relaxed ${
                  msg.role === 'user'
                    ? (isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-brand-600 text-white')
                    : (isDarkMode ? 'bg-slate-950/80 border border-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800')
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-neon-glowBlue/20 text-neon-glowBlue' : 'bg-brand-100 text-brand-600'}`}>
                   <Bot size={16} />
                </div>
                <div className={`rounded-lg p-3 text-sm flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border border-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analisando dados...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={`p-4 ${inputAreaClass}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pergunte sobre os dados..."
                className={`flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 border transition-colors ${inputClass}`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                   isDarkMode 
                     ? 'bg-neon-glowBlue text-slate-900 hover:bg-cyan-400' 
                     : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${buttonClass}`}
        title="Abrir Assistente IA"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatBot;
