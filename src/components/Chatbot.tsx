import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your SafeTravel AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    try {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    } catch {}
  }, [messages, isOpen, isLoading]);

  const quickReplies = [
    "Emergency help",
    "Nearby attractions",
    "Safety tips",
    "Local guides",
    "Weather info"
  ];

  const generateGeminiResponse = async (userMessage: string): Promise<string> => {
    const apiKeyRaw = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const apiKey = (apiKeyRaw || '').replace(/^\"|\"$/g, '').trim();
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error('Gemini API key is not configured');
      return "I'm sorry, the AI service is not properly configured. Please contact support.";
    }

    const model = 'gemini-1.5-flash';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful travel assistant for SafeTravel. Your name is SafeTravel AI. 
              Keep your responses concise and helpful. Focus on travel safety, local information, 
              and emergency assistance. ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to get response from AI service');
      }

      const data = await response.json();
      
      // Handle different possible response structures
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.text) {
        return data.text;
      } else {
        console.warn('Unexpected API response format:', data);
        return "I received an unexpected response from the AI service. Please try again.";
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('Failed to get response from AI');
      return "I'm having trouble connecting to the AI service. Please try again in a moment.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isLoading) return;

    // Add user message once
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Show typing indicator
    const typingIndicator: Message = { id: 'typing', text: '...', sender: 'bot', timestamp: new Date() };
    setMessages(prev => [...prev, typingIndicator]);

    try {
      // Prefer backend chatbot if available
      const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
      if (apiUrl) {
        try {
          const res = await (await import("@/lib/api")).api.chatbotQuery({ tourist_id: "ST-A7B2C9D1", message: messageText });
          const text = res?.result?.response || "";
          if (text) {
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
            const botResponse: Message = { id: (Date.now() + 1).toString(), text, sender: 'bot', timestamp: new Date() };
            setMessages(prev => [...prev, botResponse]);
            return;
          }
        } catch (e) {
          // fall through to Gemini
        }
      }
      // Fallback to Gemini
      const response = await generateGeminiResponse(messageText);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      const botResponse: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      const errorResponse: Message = { id: (Date.now() + 2).toString(), text: "Sorry, I encountered an error processing your request. Please try again.", sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full btn-hero shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Notification Badge */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Badge className="bg-accent text-accent-foreground px-1 min-w-5 h-5 text-xs">!</Badge>
        </motion.div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-[420px] h-[560px] z-50"
          >
            <Card className="glass-card border-0 shadow-2xl h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>SafeTravel AI</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-4 space-y-4">
                {/* Messages Area */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        }`}>
                          {message.sender === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 break-words whitespace-pre-wrap ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "glass-card"
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs glass-card border-glass-border hover:bg-primary/20"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 glass-card border-glass-border"
                  />
                  {/* Microphone for speech-to-text (Web Speech API) */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      try {
                        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                        if (!SpeechRecognition) {
                          toast.error('Speech recognition not supported in this browser');
                          return;
                        }
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'en-IN';
                        recognition.interimResults = false;
                        recognition.maxAlternatives = 1;
                        recognition.onresult = (event: any) => {
                          const transcript = event.results[0][0].transcript;
                          setInputMessage(transcript);
                        };
                        recognition.onerror = () => toast.error('Speech recognition error');
                        recognition.start();
                      } catch (e) {
                        toast.error('Failed to start microphone');
                      }
                    }}
                    className="px-3"
                  >
                    🎤
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="btn-hero px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;