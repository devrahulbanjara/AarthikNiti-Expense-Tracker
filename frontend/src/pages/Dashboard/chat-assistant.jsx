import { useState, useEffect, useRef } from "react";
import { MessageSquare, History, User, X } from "lucide-react";

const fetchChatbotResponse = async (userInput) => {
  try {
    const response = await fetch("http://localhost:8000/profile/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ user_input: userInput }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const rawResponse = await response.text();
    return rawResponse.replace(/^"(.*)"$/, "$1").replace(/<\/?[^>]+(>|$)/g, "").replace(/\\n/g, " ").trim();
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "Oops! Something went wrong.";
  }
};

const Message = ({ message, isConsecutive, darkMode }) => {
  return (
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
        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {message.sender === "user" && !isConsecutive && (
        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
          <User  className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

const ChatHistory = ({ chatMessages, clearChatHistory, darkMode }) => {
  return (
    <div className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Chat History</h3>
        <button onClick={clearChatHistory} className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
          Clear All
        </button>
      </div>
      {chatMessages.length ? (
        chatMessages.map((message) => (
          <div key={message.id} className="mb-2 last:mb-0">
            <div className="flex items-start">
              <div className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 ${message.sender === "bot" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                {message.sender === "bot" ? <MessageSquare className="h-3 w-3" /> : <User  className="h-3 w-3" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{message.text}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No chat history available.</p>
        </div>
      )}
    </div>
  );
};

const QuickReplyButtons = ({ setChatInput, handleSendMessage, darkMode }) => {
  const replies = ["Budget?", "Expenses", "Income?", "Savings?"];
  return (
    <div className={`px-3 py-2 flex flex-wrap gap-2 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border-t`}>
      {replies.map((text) => (
        <button
          key={text}
          onClick={() => {
            setChatInput(text);
            handleSendMessage();
          }}
          className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          {text}
        </button>
      ))}
    </div>
  );
};

const ChatInput = ({ chatInput, setChatInput, handleSendMessage, darkMode }) => {
  return (
    <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} p-3`}>
      <div className="flex items-center">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
        />
        <button
          onClick={handleSendMessage}
          disabled={!chatInput.trim()}
          className={`bg-blue-500 text-white rounded-r-lg px-4 py-2 ${!chatInput.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <div className={`text-xs mt-1 text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {chatInput.length > 0 ? `${chatInput.length} characters` : ""}
      </div>
    </div>
  );
};

const ChatAssistant = ({ darkMode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    return savedMessages ? JSON.parse(savedMessages) : [{ id: 1, text: "Hello! I'm your financial assistant. How can I help you today?", sender: "bot", timestamp: new Date().toISOString() }];
  });
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages));
    if (chatEndRef.current && activeTab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), text: chatInput, sender: "user", timestamp: new Date().toISOString() };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    const botMessage = await fetchChatbotResponse(chatInput);
    setChatMessages((prev) => [...prev, { id: Date.now(), text: botMessage, sender: "bot", timestamp: new Date().toISOString() }]);
    setIsTyping(false);
  };

  const clearChatHistory = () => {
    setChatMessages([{ id: Date.now(), text: "Chat history cleared. How can I help you today?", sender: "bot", timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen ? (
        <button onClick={() => setIsChatOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center">
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className={`rounded-lg shadow-xl flex flex-col w-80 sm:w-96 border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 rounded-full bg-white text-blue-500 mr-2" />
              <h3 className="font-medium">Financial Assistant</h3>
              <span className="text-xs ml-2 bg-blue-600 px-2 py-0.5 rounded-full">Powered by AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:bg-blue-600 rounded p-1" title={isMinimized ? "Expand" : "Minimize"}>
                {isMinimized ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                )}
              </button>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-blue-600 rounded p-1" title="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {["chat", "history"].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <div className="flex items-center justify-center">
                      {tab === "chat" ? <MessageSquare className="h-4 w-4 mr-2" /> : <History className="h-4 w-4 mr-2" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </div>
                  </button>
                ))}
              </div>

              {activeTab === "chat" ? (
                <div className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {chatMessages.length ? (
                    chatMessages.map((message, index) => {
                      const showDate = index === 0 || new Date(message.timestamp).toDateString() !== new Date(chatMessages[index - 1].timestamp).toDateString();
                      const isConsecutive = index > 0 && message.sender === chatMessages[index - 1].sender && new Date(message.timestamp).getTime() - new Date(chatMessages[index - 1].timestamp).getTime() < 60000;

                      return (
                        <div key={message.id}>
                          {showDate && <div className={`text-xs text-center my-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date(message.timestamp).toLocaleDateString()}</div>}
                          <Message message={message} isConsecutive={isConsecutive} darkMode={darkMode} />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No messages yet. Start a conversation!</p>
                    </div>
                  )}
                  {isTyping && (
                    <div className="flex justify-start mb-4 ml-10">
                      <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"} rounded-lg px-4 py-2`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <ChatHistory chatMessages={chatMessages} clearChatHistory={clearChatHistory} darkMode={darkMode} />
              )}

              {activeTab === "chat" && (
                <>
                  <QuickReplyButtons setChatInput={setChatInput} handleSendMessage={handleSendMessage} darkMode={darkMode} />
                  <ChatInput chatInput={chatInput} setChatInput={setChatInput} handleSendMessage={handleSendMessage} darkMode={darkMode} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;