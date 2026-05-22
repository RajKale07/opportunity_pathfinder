import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 20v-2M17 20v-2M9 11V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi there! 👋 I\'m your Career Pathfinder AI Assistant. I can help you with career guidance, scholarship eligibility, resume tips, skill development, and so much more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsStreaming(true);

    try {
      // Prepare messages array for API
      const apiMessages = messages
        .filter(m => m.role !== 'assistant' || m.content.trim()) // Skip placeholder messages
        .map(m => ({
          role: m.role,
          content: m.content,
        }))
        .concat([{ role: 'user', content: userMessage.content }]);

      // Call backend
      const response = await api.post('/ai/chat', { messages: apiMessages });

      if (response.data.reply) {
        const assistantMessage = {
          id: messages.length + 2,
          role: 'assistant',
          content: response.data.reply,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        toast.error('No response received');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to get response');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'Which scholarships am I eligible for?',
    'How can I improve my career prospects?',
    'What skills should I learn for my target role?',
    'Help me prepare for interviews',
    'Government schemes I can apply for?',
    'How to optimize my resume for ATS?',
  ];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b t-border p-4 bg-gradient-to-r from-transparent via-transparent to-transparent"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg t-surface2">
            <BotIcon />
          </div>
          <div>
            <p className="font-mono text-xs t-dim uppercase tracking-widest">AI Assistant</p>
            <h1 className="text-lg font-semibold t-text">Career Pathfinder</h1>
          </div>
        </div>
        <p className="text-sm t-dim">Get personalized career guidance, scholarship tips, and opportunity recommendations</p>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 pt-1">
                  <div className="p-2 rounded-lg t-surface2 flex items-center justify-center">
                    <BotIcon />
                  </div>
                </div>
              )}

              <div
                className={`max-w-md rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 't-text bg-blue-600 bg-opacity-20 border border-blue-600 border-opacity-30'
                    : 't-text t-surface border t-border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 't-dim' : 't-dim'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 pt-1">
                  <div className="p-2 rounded-lg bg-blue-600 bg-opacity-20 border border-blue-600 border-opacity-30 flex items-center justify-center">
                    <UserIcon />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 pt-1">
              <div className="p-2 rounded-lg t-surface2 flex items-center justify-center">
                <BotIcon />
              </div>
            </div>
            <div className="t-text t-surface border t-border rounded-lg px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs t-dim">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (shown when not many messages) */}
      {messages.length <= 1 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-2 border-t t-border"
        >
          <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Quick suggestions:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="text-left text-xs p-2 rounded border t-border hover:t-surface2 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="border-t t-border p-4 bg-gradient-to-t from-transparent to-transparent">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about careers, scholarships, skills..."
            className="flex-1 rounded-lg border t-border p-3 text-sm outline-none transition-colors resize-none"
            style={{ backgroundColor: 'var(--surface2)', color: 'var(--text)' }}
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center px-4 py-3 rounded-lg t-btn font-medium transition-colors disabled:opacity-40 flex-shrink-0"
          >
            {loading ? (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
        <p className="text-xs t-dim mt-2">
          💡 Tip: Share details from your profile to get more personalized advice
        </p>
      </div>
    </div>
  );
}
