import { useState } from 'react'
import { supabase } from '../supabaseClient'
import ItemCard from '../components/ItemCard'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const systemMessage = {
  role: "system",
  content: 'You are an expert engineer. The user will provide a project idea. Your job is to recommend exactly 10 parts that are relevant for completing this project. \n\nOutput **only valid JSON**, with **no extra text, explanations, or markdown**. The JSON must be an array of 10 objects, where each object has exactly the following keys:\n\n- "name": the name of the component or tool (string)\n- "description": what it is used for in the project (string)\n- "source": optional string suggesting where the user might obtain it (can be empty or null)\n\nExample of valid output:\n\n[\n  {"name": "Arduino Uno", "description": "Microcontroller board used to control sensors and actuators", "source": "online electronics stores"},\n  {"name": "DHT11 Sensor", "description": "Temperature and humidity sensor for monitoring environment", "source": "Amazon or Adafruit"},\n  ...\n]\n\nDo **not** add any extra text before or after the JSON. Only return the JSON array.'
}

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm the SpareSwap Assistant! Tell me about your project idea.",
      sentTime: "just now",
      sender: "System",
      senderName: "System"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Retry function for failed messages
  const retryLastMessage = async () => {
    if (messages.length < 2) return;
    if (retryCount >= 3) {
      setError("Maximum retry attempts reached. Please try sending a new message.");
      return;
    }
    setIsRetrying(true);
    setError(null);
    const lastUserMessageIndex = messages.findLastIndex(msg => msg.sender === "user");
    if (lastUserMessageIndex === -1) return;
    const messagesToRetry = messages.slice(0, lastUserMessageIndex + 1);
    try {
      await processMessageToChatGPT(messagesToRetry);
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error("Retry failed:", error);
      setError(`Retry failed (${retryCount + 1}/3). Please try again.`);
    } finally {
      setIsRetrying(false);
    }
  };

  const clearError = () => setError(null);

  const handleSend = async (message) => {
    if (!message || message.trim().length === 0) {
      setError("Please enter a message before sending.");
      return;
    }
    if (message.length > 1000) {
      setError("Message is too long. Please keep it under 1000 characters.");
      return;
    }

    setError(null);

    const newMessage = {
      message: message.trim(),
      direction: 'outgoing',
      sender: "user",
      senderName: "User",
      sentTime: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      await processMessageToChatGPT(newMessages);
      setRetryCount(0);
    } catch (error) {
      console.error("Error in handleSend:", error);
      setError("Failed to send message. Please try again.");
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    try {
      if (!API_KEY || API_KEY.trim() === '') throw new Error("API key is not configured.");

      let apiMessages = chatMessages.map(msg => {
        if (!msg || !msg.message) throw new Error("Invalid message format detected.");
        return {
          role: (msg.sender === "System" || msg.sender === "ChatGPT") ? "assistant" : "user",
          content: msg.message
        };
      });

      if (apiMessages.length === 0) throw new Error("No valid messages to send to API.");

      // Send user input to GPT to generate component list
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages],
        max_tokens: 500,
        temperature: 0.7
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = `API request failed with status ${response.status}`;
        if (errorData.error) errorMessage = errorData.error.message || errorMessage;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Parse GPT JSON response
      let suggestedItems = [];
      try {
        suggestedItems = JSON.parse(data.choices[0].message.content);
      } catch (err) {
        console.warn("Failed to parse GPT output:", data.choices[0].message.content);
        suggestedItems = [];
      }

      // Match suggested items to Supabase listings
      const matchedListings = [];
      for (const item of suggestedItems) {
        const { data: listings, error } = await supabase
          .from('listings')
          .select('id, title, image, tags, owner, description')
          .or(`title.ilike.%${item.name}%,description.ilike.%${item.name}%,tags.cs.{${item.name}}`);
        if (error) console.error(error);
        if (listings) matchedListings.push(...listings);
      }

      // Remove duplicates based on listing ID
      const uniqueListings = matchedListings.filter((listing, index, self) => 
        index === self.findIndex(l => l.id === listing.id)
      );

      // Build system message
      let systemText = "";
      if (uniqueListings.length > 0) {
        systemText = `I found ${uniqueListings.length} listings that might help with your project:`;
      } else {
        systemText = `I couldn't find any direct matches in our listings. Here are some components you could consider:\n${suggestedItems.map(i => `- ${i.name}: ${i.description} (${i.source || 'try online or local stores'})`).join('\n')}`;
      }
      setMessages([...chatMessages, {
        message: systemText,
        sentTime: "just now",
        sender: "System",
        senderName: "SpareSwap Assistant",
        matchedListings: uniqueListings.length > 0 ? uniqueListings : undefined
      }]);

      setError(null);

    } catch (error) {
      console.error("Error in processMessageToChatGPT:", error);
      let errorMessage = "Sorry, I'm having trouble connecting right now.";
      if (error.name === 'AbortError') errorMessage = "Request timed out. Please try again.";
      else if (error.message.includes('API key')) errorMessage = "Configuration error. Please contact support.";
      else if (error.message.includes('status 401')) errorMessage = "Authentication failed. Please check API configuration.";
      else if (error.message.includes('status 429')) errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
      else if (error.message.includes('status 500')) errorMessage = "Server error. Please try again in a few moments.";
      else if (error.message) errorMessage = error.message;

      setError(errorMessage);
      setMessages([...chatMessages, {
        message: errorMessage,
        sender: "System",
        senderName: "System",
        sentTime: new Date().toLocaleTimeString(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col z-40" 
      style={{ backgroundColor: '#F9F9F9', marginTop: '64px' }}
    >
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Let's bring your idea to life.</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded flex justify-between items-center">
          <span className="text-sm">{error}</span>
          <div className="flex space-x-2">
            {messages.length > 1 && retryCount < 3 && (
              <button
                onClick={retryLastMessage}
                disabled={isRetrying || isTyping}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs"
              >
                {isRetrying ? "Retrying..." : `Retry (${retryCount}/3)`}
              </button>
            )}
            <button
              onClick={clearError}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F9F9F9', height: 'calc(100vh - 144px)', overflow: 'hidden' }}>
        <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, i) => {
            if (!message || !message.message) return null;
            return (
              <div key={i} className={`mb-4 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user" 
                    ? "bg-[#CFB991] text-gray-800" 
                    : "bg-gray-200 text-gray-800"
                }`}>
                  <div className="text-xs text-gray-600 mb-1">
                    {message.senderName || message.sender}
                  </div>
                  <div>{message.message}</div>
                  
                  {/* Display ItemCard components for matched listings */}
                  {message.matchedListings && message.matchedListings.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {message.matchedListings.map((listing) => (
                        <ItemCard key={listing.id} item={listing} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          }).filter(Boolean)}

          {(isTyping || isRetrying) && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">System</div>
                <div>{isRetrying ? "Retrying..." : "SpareSwap Assistant is typing..."}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center p-4 border-t border-gray-300" style={{ backgroundColor: '#F9F9F9', height: '80px' }}>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-200 rounded-full px-4 py-2 mr-3 border-none outline-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (e.target.value.trim()) {
                  handleSend(e.target.value);
                  e.target.value = '';
                }
              }
            }}
            disabled={isTyping || isRetrying}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]');
              if (input && input.value.trim()) {
                handleSend(input.value);
                input.value = '';
              }
            }}
            disabled={isTyping || isRetrying}
            className="bg-[#CFB991] text-white px-6 py-2 rounded-full hover:bg-[#b8a882] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot;