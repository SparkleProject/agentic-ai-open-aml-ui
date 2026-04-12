import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  sender: 'analyst' | 'agent';
  text: string;
}

interface AgentChatPanelProps {
  onClose: () => void;
}

export const AgentChatPanel: React.FC<AgentChatPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: "I've completed the initial pass on the Global Trade Corp transactions. I found 3 hidden UBOs mapping to a sanctioned individual. Would you like me to draft an SMR narrative?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), sender: 'analyst', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock agent response delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'agent', 
        text: 'Drafting the Suspicious Matter Report now. I will link the wire transfer IDs and the associated regulatory typologies (Structuring).' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="animate-enter" style={{ 
      width: '380px', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'hsla(var(--bg-surface) / 0.95)', 
      backdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-xl)', 
      border: '1px solid hsla(var(--border))', 
      boxShadow: 'var(--shadow-lg)', 
      overflow: 'hidden' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid hsla(var(--border))' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Investigator Agent</h3>
        <button onClick={onClose} aria-label="Close chat" style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', minHeight: '400px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ 
            alignSelf: msg.sender === 'analyst' ? 'flex-end' : 'flex-start', 
            backgroundColor: msg.sender === 'analyst' ? 'hsl(var(--primary))' : 'hsla(var(--bg-elevated))', 
            color: msg.sender === 'analyst' ? '#fff' : 'hsl(var(--text-primary))',
            padding: '12px 16px', 
            borderRadius: msg.sender === 'analyst' ? '16px 16px 0 16px' : '16px 16px 16px 0', 
            maxWidth: '85%',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{msg.text}</p>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 16px', backgroundColor: 'hsla(var(--bg-elevated))', borderRadius: '16px 16px 16px 0' }}>
            <div style={{ display: 'flex', gap: '4px' }} className="typing-indicator">
              <span style={{ width: '6px', height: '6px', backgroundColor: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <span style={{ width: '6px', height: '6px', backgroundColor: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out 0.2s' }} />
              <span style={{ width: '6px', height: '6px', backgroundColor: 'hsl(var(--text-muted))', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out 0.4s' }} />
            </div>
          </div>
        )}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
        <div ref={endOfMessagesRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid hsla(var(--border))', display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="Message agent..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', border: '1px solid hsla(var(--border))', background: 'hsla(var(--bg-color))', color: 'inherit', outline: 'none', transition: 'border-color 0.2s' }} 
        />
        <Button variant="primary" size="md" onClick={handleSend} style={{ borderRadius: '50%', padding: '0', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};
