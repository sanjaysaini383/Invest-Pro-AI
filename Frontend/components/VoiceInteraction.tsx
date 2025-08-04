'use client';

import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

export default function VoiceInteraction() {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState([
    { id: 1, text: 'Invest ₹500 in Green Energy Fund', timestamp: '2 minutes ago' },
    { id: 2, text: 'Show my portfolio balance', timestamp: '5 minutes ago' },
    { id: 3, text: 'Find low risk investments', timestamp: '10 minutes ago' }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const newCommand = {
          id: commands.length + 1,
          text: 'Check ESG funds under ₹3000',
          timestamp: 'just now'
        };
        setCommands([newCommand, ...commands]);
      }, 3000);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
          <i className="ri-mic-fill text-indigo-600 w-6 h-6 flex items-center justify-center"></i>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Voice Assistant</h3>
          <p className="text-gray-600">Speak your investment commands</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          <i
            className={`w-8 h-8 flex items-center justify-center text-white ${
              isListening ? 'ri-stop-fill' : 'ri-mic-fill'
            }`}
          ></i>
        </button>
        <p className="text-sm text-gray-600 mt-3">
          {isListening ? 'Listening...' : 'Tap to speak'}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Recent Commands</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {commands.map((command) => (
            <div key={command.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                <i className="ri-chat-voice-fill text-indigo-600 w-3 h-3 flex items-center justify-center"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{command.text}</p>
                <p className="text-xs text-gray-500 mt-1">{command.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 mb-2">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Show my balance',
            'Find tech stocks',
            'Invest in ESG funds',
            'Check portfolio'
          ].map((suggestion, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs cursor-pointer hover:bg-indigo-100"
              onClick={() => {
                const newCommand = {
                  id: commands.length + 1,
                  text: suggestion,
                  timestamp: 'just now'
                };
                setCommands([newCommand, ...commands]);
              }}
            >
              "{suggestion}"
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}