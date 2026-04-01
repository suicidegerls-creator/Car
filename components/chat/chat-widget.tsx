'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper to extract text from UIMessage parts
function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

// Helper to check if message has tool results
function hasToolResults(message: UIMessage): boolean {
  if (!message.parts || !Array.isArray(message.parts)) return false
  return message.parts.some((p) => p.type === 'tool-invocation')
}

// Format tool results for display
function formatToolResults(message: UIMessage): React.ReactNode[] {
  if (!message.parts || !Array.isArray(message.parts)) return []
  
  return message.parts
    .filter((p) => p.type === 'tool-invocation')
    .map((part, idx) => {
      if (part.type !== 'tool-invocation') return null
      const toolPart = part as { type: 'tool-invocation'; toolInvocation: { toolName: string; state: string; output?: unknown } }
      
      if (toolPart.toolInvocation.state !== 'output-available') {
        return (
          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Ищу информацию...</span>
          </div>
        )
      }
      
      const output = toolPart.toolInvocation.output as Record<string, unknown>
      
      // Display search results
      if (toolPart.toolInvocation.toolName === 'searchWheels' && output?.wheels) {
        const wheels = output.wheels as Array<Record<string, string>>
        if (wheels.length === 0) return null
        
        return (
          <div key={idx} className="space-y-2 mt-2">
            <p className="text-xs text-muted-foreground">Найденные диски:</p>
            {wheels.slice(0, 3).map((w, i) => (
              <div key={i} className="bg-secondary/50 rounded p-2 text-xs">
                <p className="font-medium">{w.name}</p>
                <p className="text-muted-foreground">{w.size} | {w.pcd} | {w.et}</p>
                <p className="text-accent font-medium">{w.price}</p>
              </div>
            ))}
          </div>
        )
      }
      
      // Display order status
      if (toolPart.toolInvocation.toolName === 'getOrderStatus' && output?.orders) {
        const orders = output.orders as Array<Record<string, string | number>>
        if (orders.length === 0) return null
        
        return (
          <div key={idx} className="space-y-2 mt-2">
            {orders.map((o, i) => (
              <div key={i} className="bg-secondary/50 rounded p-2 text-xs">
                <p className="font-medium">Заказ #{o.orderNumber}</p>
                <p>Статус: <span className="text-accent">{o.status}</span></p>
                <p className="text-muted-foreground">{o.total} | {o.itemsCount} шт.</p>
              </div>
            ))}
          </div>
        )
      }
      
      return null
    })
    .filter(Boolean)
}

const quickActions = [
  { label: 'Подобрать диски', message: 'Помоги подобрать диски для моего автомобиля' },
  { label: 'Статус заказа', message: 'Хочу узнать статус своего заказа' },
  { label: 'Доставка', message: 'Расскажи о доставке и сроках' },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleQuickAction = (message: string) => {
    sendMessage({ text: message })
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg',
          'bg-accent text-accent-foreground hover:bg-accent/90',
          isOpen && 'hidden'
        )}
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] shadow-xl flex flex-col">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">RIMZONE Консультант</CardTitle>
                <p className="text-xs text-muted-foreground">Онлайн</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-sm">
                      Здравствуйте! Я AI-консультант RIMZONE. Помогу подобрать диски, 
                      отвечу на вопросы о заказе или доставке.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Быстрые действия:</p>
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => handleQuickAction(action.message)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const text = getMessageText(message)
                    const toolResults = formatToolResults(message)
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-2',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <Bot className="w-3 h-3 text-accent-foreground" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'rounded-lg p-3 max-w-[85%]',
                            message.role === 'user'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary'
                          )}
                        >
                          {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
                          {toolResults}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Bot className="w-3 h-3 text-accent-foreground" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите сообщение..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
