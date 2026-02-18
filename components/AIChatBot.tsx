
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Minus, BrainCircuit } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am your AI Math Tutor. Ask me anything about your math lessons!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await geminiService.chat(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-[90vw] md:w-[400px] h-[550px] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-amber-100 mb-4 animate-in zoom-in duration-200">
          <div className="bg-indigo-950 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <BrainCircuit size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">DeepSeek R1 Tutor</h3>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Active Reasoning</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Minus size={20} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 bg-amber-50/20"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-amber-500 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-indigo-950 border border-amber-100 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-amber-100 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <span className="text-[10px] font-bold text-gray-400 ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-amber-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your math doubt..."
                className="flex-grow px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="p-3 bg-indigo-950 text-white rounded-xl hover:bg-indigo-900 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-indigo-950 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 hover:bg-amber-500 transition-all flex items-center gap-3 group ${isOpen ? 'hidden' : ''}`}
      >
        <div className="relative">
          <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-indigo-950 rounded-full"></div>
        </div>
        <span className="hidden md:inline font-black text-xs uppercase tracking-widest">Math AI Help</span>
      </button>
    </div>
  );
};

export default AIChatBot;
