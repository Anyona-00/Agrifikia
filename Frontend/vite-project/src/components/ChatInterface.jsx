import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function ChatInterface() {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I can help with farming in arid regions. Ask me about crops, planting times, or preservation methods.",
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);
  
  // Example quick questions
  const quickQuestions = [
    "What crops grow well in dry areas?",
    "When should I plant sorghum?",
    "How do I store millet for longer?"
  ];
  
  // Handle sending message
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    resetTranscript();
    setIsLoading(true);
    
    try {
      // Call your backend API
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage.text
      });
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { 
        text: response.data.message, 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error processing your request. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle voice input
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ language: 'en-US' });
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md h-[70vh] flex flex-col">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.isUser ? 'text-right' : ''}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-secondary text-neutral-dark' 
                      : 'bg-gray-100 text-neutral-dark'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <textarea
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your question..."
                rows="2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                className={`ml-2 p-2 rounded-full ${listening ? 'bg-red-500' : 'bg-gray-200'}`}
                onClick={toggleListening}
              >
                🎤
              </button>
              <button
                className="ml-2 bg-primary text-white px-4 py-2 rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Questions</h2>
        <ul className="space-y-2">
          {quickQuestions.map((question, index) => (
            <li 
              key={index}
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-secondary transition"
              onClick={() => {
                setInput(question);
              }}
            >
              {question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatInterface;