import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { MessageSquare, X, Send, Plane, Minus, Sparkles, BrainCircuit } from 'lucide-react-native';
import { getTravelAIResponse } from '../../../src/utils/geminiChat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUGGESTED_QUESTIONS = [
  "Best time to visit?",
  "Packing list suggestions?",
  "Budget tips?",
  "Safety for travelers?",
  "Top 5 local foods?",
  "Transportation options?",
];

const INITIAL_MESSAGE = {
  id: 'init-1',
  role: 'ai',
  content: "Hi! I'm your AI Travel Assistant. Ask me anything about your trip!",
  timestamp: Date.now()
};

export default function TravelChatbot({ tripContext, isVisible, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('chatbot-history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Failed to load history");
    }
  };

  const saveHistory = async (newMessages) => {
    try {
      const historyToSave = newMessages.slice(-15);
      await AsyncStorage.setItem('chatbot-history', JSON.stringify(historyToSave));
    } catch (e) {
      console.log("Failed to save history");
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('chatbot-history');
      setMessages([INITIAL_MESSAGE]);
    } catch (e) {
      console.log("Failed to clear history");
    }
  };

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

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const chatHistory = updatedMessages
        .filter(m => m.id !== 'init-1')
        .map(m => ({ role: m.role, content: m.content }));
        
      const response = await getTravelAIResponse(
        textToSend.trim(), 
        chatHistory, 
        tripContext, 
        apiKey
      );
      
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, newAiMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);

    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `⚠️ Error: ${error.message || "Connection failed"}. Please check your Gemini API key or quota.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="bg-gray-900 h-[85%] rounded-t-[40px] border-t border-gray-800"
        >
          {/* Header */}
          <View className="bg-gray-800/50 p-6 rounded-t-[40px] flex-row justify-between items-center border-b border-gray-700">
            <View className="flex-row items-center gap-3">
              <View className="bg-cyan-600 p-2.5 rounded-2xl shadow-lg">
                <BrainCircuit color="white" size={24} />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">AI Assistant</Text>
                {tripContext && (
                  <Text className="text-cyan-400 text-xs font-bold">Tuned for {tripContext.destination?.split(',')[0]}</Text>
                )}
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={clearHistory} className="bg-red-500/10 p-2 rounded-full mr-1">
                <X color="#ef4444" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} className="bg-gray-700/50 p-2 rounded-full">
                <X color="#9ca3af" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1 p-5"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View key={msg.id} className={`mb-6 flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <View 
                  className={`max-w-[85%] px-5 py-3.5 rounded-3xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 rounded-br-none' 
                      : 'bg-gray-800 border border-gray-700 rounded-bl-none'
                  }`}
                >
                  <Text className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-200'}`}>
                    {msg.content}
                  </Text>
                  <Text className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>
            ))}

            {messages.length === 1 && (
              <View className="flex-row flex-wrap gap-2 mb-10">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <TouchableOpacity 
                    key={idx}
                    onPress={() => handleSendMessage(q)}
                    className="bg-gray-800 border border-cyan-500/20 px-4 py-2 rounded-full"
                  >
                    <Text className="text-cyan-400 text-xs font-bold">{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {isTyping && (
              <View className="flex-row items-center gap-2 mb-10 bg-gray-800/30 self-start px-4 py-2 rounded-full">
                <ActivityIndicator size="small" color="#0891b2" />
                <Text className="text-gray-500 text-xs font-medium italic">Thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View className="p-6 bg-gray-800/80 border-t border-gray-700 bottom-0">
            <View className="flex-row items-center bg-gray-900 rounded-full px-5 py-2.5 border border-gray-700">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Ask travel experts..."
                placeholderTextColor="#6b7280"
                className="flex-1 text-white text-base mr-3"
                multiline={false}
              />
              <TouchableOpacity 
                disabled={!inputValue.trim() || isTyping}
                onPress={() => handleSendMessage()}
                className={`w-10 h-10 rounded-full items-center justify-center ${inputValue.trim() ? 'bg-cyan-600' : 'bg-gray-700'}`}
              >
                <Send color="white" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
