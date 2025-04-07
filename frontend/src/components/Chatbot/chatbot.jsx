"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, User, X } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const Chatbot = () => {
  // Use the global theme context
  const { darkMode } = useTheme()

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chatMessages, setChatMessages] = useState(() => {
    // Load chat history from localStorage on initial render
    const savedMessages = localStorage.getItem("chatHistory")
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Chat history cleared. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]
  })
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Custom green color - matching the screenshot
  const customGreen = "#065336"

  // Save chat messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages))
  }, [chatMessages])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [isChatOpen, isMinimized])

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

  // Function to format timestamps
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle quick reply button click
  const handleQuickReply = (message) => {
    setChatInput(message)
    setTimeout(() => {
      handleSendMessage()
    }, 10)
  }

  return (
    <div className="fixed bottom-6 right-9 z-50">
      {/* Chat button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-[#065336] hover:bg-[#054328] text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isChatOpen && (
        <div
          className="rounded-lg shadow-xl flex flex-col w-80 border overflow-hidden"
          style={{
            height: isMinimized ? "auto" : "500px",
            backgroundColor: darkMode ? "#111827" : "#065336",
            borderColor: darkMode ? "#1f2937" : "#054328",
          }}
        >
          {/* Chat header */}
          <div className="text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-2"
                style={{ color: darkMode ? "#111827" : "#065336" }}
              >
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-medium">Financial Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`text-white hover:${darkMode ? "bg-[#1f2937]" : "bg-[#054328]"} rounded p-1 w-8 h-8 flex items-center justify-center`}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <span className="text-2xl font-bold">−</span>
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className={`text-white hover:${darkMode ? "bg-[#1f2937]" : "bg-[#054328]"} rounded p-1 w-8 h-8 flex items-center justify-center`}
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Content area with fixed height */}
              <div className="flex-grow bg-gray-100 overflow-hidden flex flex-col">
                {/* Chat messages view */}
                <div
                  className={`flex-grow p-4 overflow-y-auto ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  {chatMessages.length > 0 ? (
                    <>
                      {chatMessages.map((message) => (
                        <div key={message.id} className="mb-4">
                          <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            {message.sender === "bot" && (
                              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 bg-[#065336]">
                                <MessageSquare className="h-5 w-5" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.sender === "user"
                                  ? "bg-[#065336] text-white"
                                  : darkMode
                                    ? "bg-[#1f2937] text-white"
                                    : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "user"
                                    ? "text-green-100"
                                    : darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                            {message.sender === "user" && (
                              <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                  )}

                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 bg-[#065336]">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${darkMode ? "bg-[#1f2937]" : "bg-gray-200"}`}>
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

                {/* Quick reply buttons */}
                <div
                  className={`px-3 py-2 flex flex-wrap gap-2 border-t ${darkMode ? "border-gray-700 bg-[#0f172a]" : "border-gray-200 bg-gray-100"}`}
                >
                  <button
                    onClick={() => handleQuickReply("What's my budget?")}
                    className={`text-sm px-3 py-1 rounded-full ${
                      darkMode
                        ? "bg-[#1f2937] text-gray-200 hover:bg-gray-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Budget
                  </button>
                  <button
                    onClick={() => handleQuickReply("Show my expenses")}
                    className={`text-sm px-3 py-1 rounded-full ${
                      darkMode
                        ? "bg-[#1f2937] text-gray-200 hover:bg-gray-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => handleQuickReply("What's my income?")}
                    className={`text-sm px-3 py-1 rounded-full ${
                      darkMode
                        ? "bg-[#1f2937] text-gray-200 hover:bg-gray-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Income
                  </button>
                </div>

                {/* Chat input */}
                <div
                  className={`border-t ${darkMode ? "border-gray-700 bg-[#0f172a]" : "border-gray-200 bg-white"} p-3`}
                >
                  <div className="flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#065336] ${
                        darkMode
                          ? "bg-[#1f2937] border-gray-700 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-black"
                      }`}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={chatInput.trim() === ""}
                      className={`bg-[#065336] text-white rounded-r-lg px-4 py-2 ${
                        chatInput.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#054328]"
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
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Chatbot
