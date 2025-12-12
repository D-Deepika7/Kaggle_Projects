import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

const SAMPLE_QUESTIONS = [
  "How often should I water it?",
  "Is this contagious to other plants?",
  "Are organic treatments effective?",
  "Why are the leaves turning yellow?"
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', sender: 'ai', text: "I've analyzed your plant! Do you have any specific questions about the care plan?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await sendChatMessage(text);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting right now.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mt-8 flex flex-col h-[500px]">
      <div className="bg-emerald-600 p-4 flex items-center text-white">
        <HelpCircle className="w-5 h-5 mr-2" />
        <h3 className="font-bold">Ask PlantDoctor</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-stone-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${msg.sender === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
           <div className="flex justify-start mb-4">
             <div className="flex items-center ml-12 bg-white px-4 py-2 rounded-full border border-stone-200">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce mr-1"></div>
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce mr-1 delay-75"></div>
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex gap-2 overflow-x-auto hide-scrollbar">
        {SAMPLE_QUESTIONS.map((q) => (
          <button 
            key={q}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="whitespace-nowrap px-3 py-1 bg-white border border-emerald-100 text-emerald-700 text-xs rounded-full hover:bg-emerald-50 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-stone-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500 bg-stone-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isSending}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
