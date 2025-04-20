"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  History,
  User,
  X,
  Settings,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchChatbotResponse = async (userInput, getToken) => {
  try {
    const token = getToken();
    const response = await fetch(`${BACKEND_URL}/profile/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_input: userInput }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const rawResponse = await response.text();
    return rawResponse
      .replace(/^"(.*)"$/, "$1")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\\n/g, " ")
      .trim();
  } catch (error) {
    return "Oops! Something went wrong.";
  }
};

const Message = ({ message, isConsecutive, darkMode }) => {
  return (
    <div
      className={`mb-2 flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.sender === "bot" && !isConsecutive && (
        <div className="h-8 w-8 rounded-full bg-green-800 flex items-center justify-center text-white mr-2 flex-shrink-0">
          <MessageSquare className="h-5 w-5" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === "user"
            ? "bg-green-800 text-white"
            : darkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-100 text-gray-800"
        } ${isConsecutive && message.sender === "bot" ? "ml-10" : ""}`}
      >
        <p>{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            message.sender === "user"
              ? "text-blue-100"
              : darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {message.sender === "user" && !isConsecutive && (
        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

const ChatHistory = ({ chatMessages, clearChatHistory, darkMode }) => {
  return (
    <div
      className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Chat History</h3>
        <button
          onClick={clearChatHistory}
          className={`text-xs px-2 py-1 rounded ${
            darkMode
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          Clear All
        </button>
      </div>
      {chatMessages.length ? (
        chatMessages.map((message) => (
          <div key={message.id} className="mb-2 last:mb-0">
            <div className="flex items-start">
              <div
                className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 ${
                  message.sender === "bot"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {message.sender === "bot" ? (
                  <MessageSquare className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{message.text}</p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p
            className={`text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No chat history available.
          </p>
        </div>
      )}
    </div>
  );
};

const QuickReplyButtons = ({ setChatInput, handleSendMessage, darkMode }) => {
  const replies = ["Budget?", "Expenses", "Income?", "Savings?"];
  return (
    <div
      className={`px-3 py-2 flex flex-wrap gap-2 ${
        darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
      } border-t`}
    >
      {replies.map((text) => (
        <button
          key={text}
          onClick={() => {
            setChatInput(text);
            handleSendMessage();
          }}
          className={`text-xs px-3 py-1 rounded-full ${
            darkMode
              ? "bg-gray-600 text-white hover:bg-gray-500"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
};

const ChatInput = ({
  chatInput,
  setChatInput,
  handleSendMessage,
  darkMode,
}) => {
  return (
    <div
      className={`border-t ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } p-3`}
    >
      <div className="flex items-center">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-800 ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black"
          }`}
        />
        <button
          onClick={handleSendMessage}
          disabled={!chatInput.trim()}
          className={`bg-green-800 text-white rounded-r-lg px-4 py-2 ${
            !chatInput.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <div
        className={`text-xs mt-1 text-right ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {chatInput.length > 0 ? `${chatInput.length} characters` : ""}
      </div>
    </div>
  );
};

const ChatAssistant = ({ darkMode }) => {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Hello! I'm your financial assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ];
  });
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages));
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isTyping, isOpen]);

  const toggleChat = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    const botMessage = await fetchChatbotResponse(chatInput, getToken);
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: botMessage,
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsTyping(false);
  };

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: Date.now(),
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
    setShowSettings(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChat}
        className={`p-4 rounded-full shadow-xl transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'animate-pulse' : ''
        } ${
          isOpen 
            ? 'rotate-90 bg-red-500 hover:bg-red-600' 
            : `${darkMode ? "bg-[#065336]" : "bg-[#065336]"} hover:scale-110`
        } text-white`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} className="transform transition-transform duration-300" />
        ) : (
          <MessageSquare size={24} className="transform transition-transform duration-300" />
        )}
      </button>

      <div
        className={`fixed bottom-20 right-4 w-full md:w-[400px] lg:w-[480px] max-h-[600px] overflow-hidden rounded-xl shadow-2xl 
        ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
        transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-[600px]">
          <div
            className={`p-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex justify-between items-center bg-[#065336] text-white`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                Aarthik Assistant
              </h2>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full hover:bg-[#054328] transition-colors`}
                aria-label="Settings"
              >
                <Settings size={18} className="text-white" />
              </button>
              <button
                onClick={toggleChat}
                className={`p-2 rounded-full hover:bg-[#054328] transition-colors`}
                aria-label="Close chat"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            {showSettings && (
              <div
                className={`absolute right-2 top-14 mt-1 w-48 rounded-md shadow-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } ring-1 ring-black ring-opacity-5 z-10 transform transition-all duration-300 ease-in-out animate-slideDown`}
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={clearChatHistory}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      darkMode
                        ? "text-white hover:bg-gray-600"
                        : "text-gray-700 hover:bg-gray-100"
                    } transition-colors`}
                    role="menuitem"
                  >
                    <Trash2 size={16} className="mr-2 text-red-500" />
                    <span>Clear Chat History</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            ref={messagesContainerRef}
            className={`flex-1 overflow-y-auto p-4 ${darkMode ? "scrollbar-dark" : "scrollbar-light"}`}
          >
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[85%] transition-all transform animate-messageScale
                    ${
                      message.sender === "user"
                        ? "bg-[#065336] text-white rounded-tr-none animate-messageSlideLeft"
                        : darkMode
                        ? "bg-gray-700 text-white rounded-tl-none animate-messageSlideRight"
                        : "bg-gray-100 text-gray-800 rounded-tl-none animate-messageSlideRight"
                    }
                  `}
                >
                  {message.text}
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-green-200" : darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center animate-fadeIn">
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 max-w-[85%] rounded-tl-none">
                  <div className="flex space-x-2">
                    <div
                      className={`w-2 h-2 ${darkMode ? "bg-gray-400" : "bg-gray-500"} rounded-full animate-bounce`}
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className={`w-2 h-2 ${darkMode ? "bg-gray-400" : "bg-gray-500"} rounded-full animate-bounce`}
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className={`w-2 h-2 ${darkMode ? "bg-gray-400" : "bg-gray-500"} rounded-full animate-bounce`}
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Template Messages */}
          <div
            className={`px-4 py-2 border-t ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
            } transform transition-all duration-300 ease-in-out`}
          >
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => {
                  setChatInput(
                    "Give me recommendations on my spending pattern"
                  );
                  handleSendMessage();
                }}
                className={`p-2 text-sm rounded-lg shadow-sm ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } transition-all duration-300 hover:shadow-md hover:scale-105`}
              >
                Spending Pattern Analysis
              </button>
              <button
                onClick={() => {
                  setChatInput("How can I spend less?");
                  handleSendMessage();
                }}
                className={`p-2 text-sm rounded-lg shadow-sm ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } transition-all duration-300 hover:shadow-md hover:scale-105`}
              >
                Reduce Expenses
              </button>
              <button
                onClick={() => {
                  setChatInput("How can I earn more?");
                  handleSendMessage();
                }}
                className={`p-2 text-sm rounded-lg shadow-sm ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } transition-all duration-300 hover:shadow-md hover:scale-105`}
              >
                Increase Income
              </button>
              <button
                onClick={() => {
                  setChatInput("What are my earnings this month?");
                  handleSendMessage();
                }}
                className={`p-2 text-sm rounded-lg shadow-sm ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } transition-all duration-300 hover:shadow-md hover:scale-105`}
              >
                Monthly Earnings
              </button>
            </div>
          </div>

          <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-green-500 focus:border-green-500"
                } transition-all duration-300 focus:outline-none focus:ring-2`}
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className={`p-3 rounded-lg ${
                  !chatInput.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#065336] hover:bg-[#054328]"
                } text-white transition-all duration-300 transform hover:scale-105`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
