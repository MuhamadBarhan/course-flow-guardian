
import React, { useState, useRef, useEffect } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const mockAIResponses: Record<string, string[]> = {
  html: [
    "HTML (HyperText Markup Language) is the standard markup language for creating web pages.",
    "The basic structure of an HTML document includes the DOCTYPE declaration, html, head, and body elements.",
    "HTML tags are used to structure content on a webpage, like headings, paragraphs, lists, and links."
  ],
  css: [
    "CSS (Cascading Style Sheets) is used to style HTML elements and control the layout of web pages.",
    "You can apply CSS to HTML elements using selectors, properties, and values.",
    "CSS can be added to HTML in three ways: inline, internal, and external stylesheets."
  ],
  javascript: [
    "JavaScript is a programming language that allows you to implement complex features on web pages.",
    "With JavaScript, you can manipulate the DOM (Document Object Model) to change HTML content dynamically.",
    "JavaScript has various data types like strings, numbers, booleans, objects, and arrays."
  ],
  react: [
    "React is a JavaScript library for building user interfaces, particularly single-page applications.",
    "React uses a virtual DOM to efficiently update the UI when data changes.",
    "Components are the building blocks of React applications, allowing you to split the UI into independent, reusable pieces."
  ]
};

const AITutor: React.FC = () => {
  const { currentLesson, isAITutorOpen, toggleAITutor } = useCourse();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      content: "Hi! I'm your AI tutor. How can I help you with this lesson?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check if the message contains any of our keywords
    for (const [keyword, responses] of Object.entries(mockAIResponses)) {
      if (lowerCaseMessage.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if no keyword is found
    const defaultResponses = [
      `I see you're working on ${currentLesson?.title || 'this course'}. What specific concept are you struggling with?`,
      "Could you provide more details about what you're trying to understand?",
      "That's an interesting question. Let me guide you through this concept step by step.",
      "I'm here to help! Let's break down this problem together."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isAITutorOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-96 shadow-lg z-50 flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot size={20} className="text-primary" />
            <span>AI Tutor</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={toggleAITutor}
          >
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2",
                  message.sender === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'ai' ? (
                    <Bot size={16} className="text-primary" />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-xs opacity-70">
                    {message.sender === 'ai' ? 'AI Tutor' : 'You'}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} className="text-primary" />
                  <span className="text-xs opacity-70">AI Tutor</span>
                </div>
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <form 
          className="flex w-full gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AITutor;
