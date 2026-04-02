import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Plane, Minus, Maximize2 } from 'lucide-react';
import { getTravelAIResponse } from '../utils/geminiChat';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_QUESTIONS = [
  "What's the best time to visit this destination?",
  "What should I pack for this trip?",
  "How much budget should I plan for this place?",
  "Is this destination safe for travelers?",
  "What are the best restaurants here?",
  "How do I travel from airport to city center?",
];

const INITIAL_MESSAGE = {
  id: 'init-1',
  role: 'ai',
  content: "Hi! I'm your AI Travel Assistant. Ask me anything about destinations, packing, budgets, food, or travel tips.",
  timestamp: Date.now()
};

export default function TravelChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tripContext, setTripContext] = useState(null);
  
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // 1. Context Extraction based on URL
  useEffect(() => {
    const fetchContext = async () => {
      if (location.pathname.startsWith('/view-trip/')) {
        const tripId = location.pathname.split('/').pop();
        if (tripId) {
          try {
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.userSelection) {
                setTripContext({
                  destination: data.userSelection.location,
                  duration: data.userSelection.totalDays,
                  budget: data.userSelection.budget,
                  travelers: data.userSelection.traveler
                });
              }
            }
          } catch (e) {
            console.error("Failed to extract trip context:", e);
          }
        }
      } else {
        setTripContext(null); // Clear context if navigating away from ViewTrip
      }
    };
    fetchContext();
  }, [location.pathname]);

  // 2. Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatbot-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([INITIAL_MESSAGE]);
      }
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  // 3. Save History to LocalStorage (cap at 15 messages max)
  useEffect(() => {
    if (messages.length > 0) {
      const messagesToSave = messages.slice(-15);
      localStorage.setItem('chatbot-history', JSON.stringify(messagesToSave));
    }
  }, [messages]);

  // 4. Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // 5. Send Message Core Logic
  const handleSendMessage = async (textOverride = null) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    if (!textOverride) setInputValue('');

    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Pass the previous 15 messages as history buffer to memory
      const chatHistory = messages
        .filter(m => m.id !== 'init-1') // Don't feed generic init string to history
        .map(m => ({ role: m.role, content: m.content }));
        
      const aiResponseText = await getTravelAIResponse(
        textToSend.trim(), 
        chatHistory, 
        tripContext, 
        import.meta.env.VITE_GEMINI_API_KEY
      );
      
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newAiMsg]);

    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `⚠️ Connect Error: ${error.message || "Connection failed"}. Please ensure your Gemini API key is valid and has sufficient quota.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('chatbot-history');
    setMessages([INITIAL_MESSAGE]);
  };

  const formatTime = (ts) => {
    if (!ts || isNaN(new Date(ts).getTime())) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-cyan-600 to-teal-500 rounded-full shadow-[0_10px_40px_-10px_rgba(8,145,178,0.7)] flex items-center justify-center hover:scale-110 transition-transform duration-300 z-[9999] group border-4 border-white/10"
        >
          <MessageSquare className="w-7 h-7 text-white" />
          {/* Label tooltip */}
          <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
            Travel Assistant
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-[380px] h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-[10000] border border-gray-200 overflow-hidden font-sans transform origin-bottom-right animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">🌍 Travel Assistant</h3>
                {tripContext && (
                  <p className="text-teal-100 text-xs font-medium">Focused on {tripContext.destination.split(',')[0]}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={clearHistory}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors mr-1"
                title="Clear History"
              >
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors">
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            
            {/* Context Notice */}
            {tripContext && (
              <div className="bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs px-3 py-2 rounded-lg text-center mx-4 select-none">
                AI is uniquely tuning answers for your trip to <b>{tripContext.destination.split(',')[0]}</b>
              </div>
            )}

            {/* First time suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="bg-white border border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-800 text-xs font-medium px-3 py-1.5 rounded-full text-left transition-colors shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Bubbles */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <div className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm prose-cyan max-w-none text-gray-800">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (msg.content)}
                  </div>
                  <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="ml-2 text-xs text-gray-500 font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about travel..."
                className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-500"
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-300 flex items-center justify-center transition-colors shrink-0"
              >
                <Plane className="w-4 h-4 text-white -mt-0.5 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">AI Expert Assistant bounds responses to travel metrics.</p>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
