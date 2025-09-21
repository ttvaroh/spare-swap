import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ItemCard from '../components/ItemCard'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

const systemMessage = {
  role: "system",
  content: 'You are an expert engineer. The user will provide a project idea. Your job is to recommend exactly 10 parts that are relevant for completing this project. \n\nOutput **only valid JSON**, with **no extra text, explanations, or markdown**. The JSON must be an array of 10 objects, where each object has exactly the following keys:\n\n- "name": the name of the component or tool (string)\n- "description": what it is used for in the project (string)\n- "source": optional string suggesting where the user might obtain it (can be empty or null)\n\nExample of valid output:\n\n[\n  {"name": "Arduino Uno", "description": "Microcontroller board used to control sensors and actuators", "source": "online electronics stores"},\n  {"name": "DHT11 Sensor", "description": "Temperature and humidity sensor for monitoring environment", "source": "Amazon or Adafruit"},\n  ...\n]\n\nDo **not** add any extra text before or after the JSON. Only return the JSON array.'
}

function ChatBot() {
  const [userId, setUserId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
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

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await loadSavedSessions(session.user.id);
      }
    };
    getUser();
  }, []);

  // Load saved chat sessions
  const loadSavedSessions = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSavedSessions(data || []);
    } catch (error) {
      console.error('Error loading saved sessions:', error);
    }
  };

  // Create new chat session
  const createNewSession = async (firstMessage = null) => {
    if (!userId) return null;

    try {
      let title = "New Project";
      if (firstMessage && firstMessage.length > 0) {
        title = firstMessage.length > 50 
          ? firstMessage.substring(0, 50) + "..." 
          : firstMessage;
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: userId, title }])
        .select()
        .single();

      if (error) throw error;

      await enforceSessionLimit();
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  // Enforce 5 session limit per user
  const enforceSessionLimit = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (sessions && sessions.length > 5) {
        const sessionsToDelete = sessions.slice(5);
        const idsToDelete = sessionsToDelete.map(s => s.id);
        
        await supabase
          .from('chat_sessions')
          .delete()
          .in('id', idsToDelete);
      }
    } catch (error) {
      console.error('Error enforcing session limit:', error);
    }
  };

  // Save message to database
  const saveMessage = async (sessionId, message) => {
    try {
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          message: message.message,
          sender: message.sender,
          sender_name: message.senderName,
          matched_listings: message.matchedListings || null,
          is_error: message.isError || false
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Load chat session - THIS IS THE KEY FUNCTION FOR RELOADING CHATS
  const loadChatSession = async (sessionId) => {
    try {
      console.log('Loading chat session:', sessionId);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages = data.map(msg => ({
        message: msg.message,
        sender: msg.sender,
        senderName: msg.sender_name,
        sentTime: new Date(msg.created_at).toLocaleTimeString(),
        matchedListings: msg.matched_listings,
        isError: msg.is_error
      }));

      console.log('Loaded messages:', loadedMessages);
      setMessages(loadedMessages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  // Start new project (new chat)
  const startNewProject = () => {
    setMessages([
      {
        message: "Hello, I'm the SpareSwap Assistant! Tell me about your project idea.",
        sentTime: "just now",
        sender: "System",
        senderName: "System"
      }
    ]);
    setCurrentSessionId(null);
    setError(null);
    setRetryCount(0);
  };

  // Delete chat session
  const deleteChatSession = async (sessionId, e) => {
    e.stopPropagation();
    
    try {
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      await loadSavedSessions(userId);

      if (sessionId === currentSessionId) {
        startNewProject();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

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
      await processMessageToChatGPT(messagesToRetry, currentSessionId);
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

    let sessionId = currentSessionId;
    if (!sessionId && userId) {
      sessionId = await createNewSession(message.trim());
      setCurrentSessionId(sessionId);
      await loadSavedSessions(userId);
    }

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    if (sessionId) {
      await saveMessage(sessionId, newMessage);
    }

    try {
      await processMessageToChatGPT(newMessages, sessionId);
      setRetryCount(0);
    } catch (error) {
      console.error("Error in handleSend:", error);
      setError("Failed to send message. Please try again.");
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages, sessionId = null) {
    try {
      let apiMessages = chatMessages.map(msg => {
        if (!msg || !msg.message) throw new Error("Invalid message format detected.");
        return {
          role: (msg.sender === "System" || msg.sender === "ChatGPT") ? "assistant" : "user",
          content: msg.message
        };
      });

      if (apiMessages.length === 0) throw new Error("No valid messages to send to API.");

      // Call our Netlify function instead of OpenAI directly
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages],
        max_tokens: 500,
        temperature: 0.7
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Use the Netlify function endpoint
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = `Request failed with status ${response.status}`;
        if (errorData.error) errorMessage = errorData.error;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      let suggestedItems = [];
      try {
        suggestedItems = JSON.parse(data.choices[0].message.content);
      } catch (err) {
        console.warn("Failed to parse GPT output:", data.choices[0].message.content);
        suggestedItems = [];
      }

      const matchedListings = [];
      for (const item of suggestedItems) {
        const { data: listings, error } = await supabase
          .from('listings')
          .select('id, title, image, tags, owner, description')
          .or(`title.ilike.%${item.name}%,description.ilike.%${item.name}%,tags.cs.{${item.name}}`);
        if (error) console.error(error);
        if (listings) matchedListings.push(...listings);
      }

      const uniqueListings = matchedListings.filter((listing, index, self) => 
        index === self.findIndex(l => l.id === listing.id)
      );

      let systemText = "";
      if (uniqueListings.length > 0) {
        systemText = `I found ${uniqueListings.length} listings that might help with your project:`;
      } else {
        systemText = `I couldn't find any direct matches in our listings. Here are some components you could consider:\n${suggestedItems.map(i => `- ${i.name}: ${i.description} (${i.source || 'try online or local stores'})`).join('\n')}`;
      }

      const systemResponse = {
        message: systemText,
        sentTime: "just now",
        sender: "System",
        senderName: "SpareSwap Assistant",
        matchedListings: uniqueListings.length > 0 ? uniqueListings : undefined
      };

      setMessages([...chatMessages, systemResponse]);

      const activeSessionId = sessionId || currentSessionId;
      if (activeSessionId) {
        await saveMessage(activeSessionId, systemResponse);
      }

      setError(null);

    } catch (error) {
      console.error("Error in processMessageToChatGPT:", error);
      let errorMessage = "Sorry, I'm having trouble connecting right now.";
      if (error.name === 'AbortError') errorMessage = "Request timed out. Please try again.";
      else if (error.message.includes('Server configuration error')) errorMessage = "Configuration error. Please contact support.";
      else if (error.message.includes('status 401')) errorMessage = "Authentication failed. Please check API configuration.";
      else if (error.message.includes('status 429')) errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
      else if (error.message.includes('status 500')) errorMessage = "Server error. Please try again in a few moments.";
      else if (error.message) errorMessage = error.message;

      const errorResponse = {
        message: errorMessage,
        sender: "System",
        senderName: "System",
        sentTime: new Date().toLocaleTimeString(),
        isError: true
      };

      setError(errorMessage);
      setMessages([...chatMessages, errorResponse]);

      const activeSessionId = sessionId || currentSessionId;
      if (activeSessionId) {
        await saveMessage(activeSessionId, errorResponse);
      }
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 flex z-40" 
      style={{ backgroundColor: '#F9F9F9', marginTop: '64px' }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* New Project Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={startNewProject}
            className="w-full bg-[#CFB991] hover:bg-[#b8a882] text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Saved Sessions */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">RECENT PROJECTS</h3>
            <div className="space-y-2">
              {savedSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    currentSessionId === session.id
                      ? 'bg-[#CFB991] bg-opacity-20 border border-[#CFB991]'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => loadChatSession(session.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChatSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {savedSessions.length === 0 && (
                <p className="text-sm text-gray-500 italic">No saved projects yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F9F9F9', overflow: 'hidden' }}>
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
                    <div className="whitespace-pre-wrap">{message.message}</div>
                    
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
    </div>
  )
}

export default ChatBot;