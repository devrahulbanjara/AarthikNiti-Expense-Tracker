"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, History, User, X } from 'lucide-react'

const Chatbot = ({ darkMode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("chat") // 'chat' or 'history'
  const [chatMessages, setChatMessages] = useState(() => {
    // Load chat history from localStorage on initial render
    const savedMessages = localStorage.getItem("chatHistory")
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Hello! I'm your financial assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]
  })
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Group chat messages by date for history view
  const chatHistoryByDate = chatMessages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  // Add this useEffect to save chat messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages))
  }, [chatMessages])

  // Add this useEffect to scroll to bottom of chat when messages change
  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatEndRef.current && activeTab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, activeTab])

  // Handle sending a message
  const handleSendMessage = () => {
    if (chatInput.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)

      let botResponse =
        "I'm not sure how to help with that. Could you try asking about your budget, expenses, or savings?"

      const userInput = chatInput.toLowerCase()
      if (userInput.includes("budget") || userInput.includes("spending")) {
        botResponse = "Your current monthly budget is $2,500. You've spent 65% of it so far."
      } else if (userInput.includes("expense") || userInput.includes("spent")) {
        botResponse = "Your largest expense category this month is Food at $450."
      } else if (userInput.includes("income") || userInput.includes("earn")) {
        botResponse = "Your total income this month is $3,500."
      } else if (userInput.includes("save") || userInput.includes("saving")) {
        botResponse = "You've saved $5,200 this year, which is 15% of your income."
      } else if (userInput.includes("hello") || userInput.includes("hi")) {
        botResponse = "Hello! How can I assist with your financial questions today?"
      } else if (userInput.includes("clear") || userInput.includes("reset")) {
        setChatMessages([
          {
            id: Date.now(),
            text: "Chat history cleared. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ])
        return
      } else if (userInput.includes("help") || userInput.includes("commands")) {
        botResponse = "You can ask me about: budget, expenses, income, savings, or use commands like 'clear history'."
      }

      const botMessage = {
        id: Date.now(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  // Function to clear chat history
  const clearChatHistory = () => {
    setChatMessages([
      {
        id: Date.now(),
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Function to format timestamps
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isChatOpen && (
        <div
          className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-xl flex flex-col w-80 sm:w-96 border overflow-hidden`}
        >
          {/* Chat header */}
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-500 mr-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-medium">Financial Assistant</h3>
              <span className="text-xs ml-2 bg-blue-600 px-2 py-0.5 rounded-full">Powered by AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-blue-600 rounded p-1"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? (
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
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-blue-600 rounded p-1"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === "chat"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("chat")}
                >
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </div>
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === "history"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <div className="flex items-center justify-center">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </div>
                </button>
              </div>

              {/* Chat content - changes based on active tab */}
              {activeTab === "chat" ? (
                // Chat messages view
                <div
                  className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {chatMessages.length > 0 ? (
                    chatMessages.map((message, index) => {
                      // Check if we should show the date
                      const showDate =
                        index === 0 ||
                        new Date(message.timestamp).toDateString() !==
                          new Date(chatMessages[index - 1].timestamp).toDateString()

                      // Check if this is a consecutive message from the same sender
                      const isConsecutive =
                        index > 0 &&
                        message.sender === chatMessages[index - 1].sender &&
                        new Date(message.timestamp).getTime() -
                          new Date(chatMessages[index - 1].timestamp).getTime() <
                          60000

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div
                              className={`text-xs text-center my-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {new Date(message.timestamp).toLocaleDateString()}
                            </div>
                          )}
                          <div className={`mb-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            {message.sender === "bot" && !isConsecutive && (
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                                <MessageSquare className="h-5 w-5" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.sender === "user"
                                  ? "bg-blue-500 text-white"
                                  : darkMode
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-100 text-gray-800"
                              } ${isConsecutive && message.sender === "bot" ? "ml-10" : ""}`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                            {message.sender === "user" && !isConsecutive && (
                              <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No messages yet. Start a conversation!
                      </p>
                    </div>
                  )}
                  {isTyping && (
                    <div className="flex justify-start mb-4 ml-10">
                      <div
                        className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"} rounded-lg px-4 py-2`}
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                // Chat history view
                <div
                  className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Chat History</h3>
                    <button
                      onClick={clearChatHistory}
                      className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                    >
                      Clear All
                    </button>
                  </div>

                  {Object.keys(chatHistoryByDate).length > 0 ? (
                    Object.entries(chatHistoryByDate)
                      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                      .map(([date, messages]) => (
                        <div key={date} className="mb-6">
                          <div className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {new Date(date).toLocaleDateString(undefined, {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            {messages.slice(0, 2).map((message) => (
                              <div key={message.id} className="mb-2 last:mb-0">
                                <div className="flex items-start">
                                  <div
                                    className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 ${
                                      message.sender === "bot" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
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
                                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {formatTime(message.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {messages.length > 2 && (
                              <div
                                className={`text-xs text-center mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {messages.length - 2} more messages
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setActiveTab("chat")
                                // Optionally scroll to the date's messages
                              }}
                              className={`w-full text-center text-xs mt-2 py-1 rounded ${
                                darkMode
                                  ? "bg-gray-600 text-white hover:bg-gray-500"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              View Conversation
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No chat history available.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "chat" && (
                <>
                  {/* Quick reply buttons */}
                  <div
                    className={`px-3 py-2 flex flex-wrap gap-2 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border-t`}
                  >
                    <button
                      onClick={() => {
                        setChatInput("What's my budget?")
                        handleSendMessage()
                      }}
                      className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                      Budget
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("Show my expenses")
                        handleSendMessage()
                      }}
                      className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                      Expenses
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("What's my income?")
                        handleSendMessage()
                      }}
                      className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                      Income
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("How much have I saved?")
                        handleSendMessage()
                      }}
                      className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                      Savings
                    </button>
                  </div>

                  {/* Chat input */}
                  <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} p-3`}>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={chatInput.trim() === ""}
                        className={`bg-blue-500 text-white rounded-r-lg px-4 py-2 ${
                          chatInput.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
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
                    <div className={`text-xs mt-1 text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {chatInput.length > 0 ? `${chatInput.length} characters` : ""}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Chatbot
