"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Lightbulb, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Define initial messages outside the component to avoid initialization issues
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your financial assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

// Define AI insights outside the component
const aiInsights = [
  {
    id: "1",
    title: "Spending Insight",
    content:
      "You've spent 30% more on dining this month compared to last month. Consider cooking at home to save money.",
    icon: DollarSign,
  },
  {
    id: "2",
    title: "Budget Alert",
    content:
      "You're on track to exceed your entertainment budget by $75 this month based on current spending patterns.",
    icon: Lightbulb,
  },
  {
    id: "3",
    title: "Savings Opportunity",
    content:
      "Based on your income, you could increase your monthly savings by $350 by reducing non-essential expenses.",
    icon: TrendingUp,
  },
]

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Based on your spending patterns, you could save about $200 more each month by reducing restaurant expenses.",
        "Your biggest expense category this month is Shopping at 32% of your total spending.",
        "You're on track to meet your savings goal for this quarter!",
        "I notice you have a bill due in 3 days. Would you like me to set a reminder?",
        "Your income has increased by 5% compared to last month. Great job!",
        "I've analyzed your spending and found a subscription you might not be using. Consider canceling it to save $15/month.",
        "Based on your current savings rate, you'll reach your emergency fund goal in approximately 4 months.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {isOpen ? (
        <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-lg z-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Financial Assistant</CardTitle>
                  <CardDescription className="text-xs">Powered by AI</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 max-w-[80%] ${
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    placeholder="Ask about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </TabsContent>
            <TabsContent value="insights">
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {aiInsights.map((insight) => (
                      <div key={insight.id} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-primary/10 p-1.5 rounded-full">
                            <insight.icon className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("chat")}>
                  Ask for more insights
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Button
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      )}
    </>
  )
}

