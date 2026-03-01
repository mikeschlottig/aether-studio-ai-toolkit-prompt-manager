import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Settings2, 
  ChevronDown, 
  Sparkles, 
  Eraser,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { chatService, MODELS } from '@/lib/chat'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Message, ChatState } from '../../../worker/types'
import { toast } from '@/components/ui/sonner'
export function AssistantPage() {
  const [model, setModel] = useState(MODELS[0].id)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    loadMessages()
  }, [])
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  const loadMessages = async () => {
    const res = await chatService.getMessages()
    if (res.success && res.data) {
      setMessages(res.data.messages)
    }
  }
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return
    const userMessage = input.trim()
    setInput('')
    setIsProcessing(true)
    // Optimistic update
    const tempId = crypto.randomUUID()
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }])
    const res = await chatService.sendMessage(userMessage, model)
    if (res.success) {
      await loadMessages()
    } else {
      toast.error('Failed to send message')
    }
    setIsProcessing(false)
  }
  const handleClear = async () => {
    const res = await chatService.clearMessages()
    if (res.success) {
      setMessages([])
      toast.success('Conversation cleared')
    }
  }
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto">
      {/* Header / Config Bar */}
      <div className="p-4 border-b flex items-center justify-between bg-card/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">AI Assistant</h2>
            <p className="text-2xs text-muted-foreground">Ready for production</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <Settings2 className="w-3.5 h-3.5 mr-2 opacity-70" />
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-xs">{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClear}>
            <Eraser className="w-4 h-4 opacity-70" />
          </Button>
        </div>
      </div>
      {/* Message Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4">
          <div className="max-w-3xl mx-auto py-8 space-y-8">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <div className="text-center py-20 space-y-4 opacity-50">
                  <Sparkles className="w-12 h-12 mx-auto text-indigo-500" />
                  <p className="text-sm font-medium">How can I help you today?</p>
                </div>
              ) : (
                messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-secondary' : 'bg-indigo-600'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`space-y-2 max-w-[85%] ${m.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-muted border border-border'
                      }`}>
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                      <p className="text-2xs text-muted-foreground px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-muted rounded-2xl p-2 border border-border focus-within:border-indigo-500/50 transition-colors">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Describe a prompt or script..."
            className="flex-1 min-h-[44px] max-h-40 bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-2 shadow-none"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isProcessing}
            size="icon"
            className="rounded-xl h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-bold opacity-30">
          Aether Studio v1.0 • AI-Powered Agency OS
        </p>
      </div>
    </div>
  )
}