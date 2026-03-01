import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Settings2,
  Sparkles,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  AlertCircle,
  Library,
  Menu
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { chatService, MODELS } from '@/lib/chat'
import { useAppStore } from '@/lib/store'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Message, SessionInfo } from '../../../worker/types'
import { toast } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
export function AssistantPage() {
  const [model, setModel] = useState(MODELS[0].id)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>(chatService.getSessionId())
  const [isProcessing, setIsProcessing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const prompts = useAppStore(s => s.prompts)
  const loadSessions = useCallback(async () => {
    const res = await chatService.listSessions()
    if (res.success && res.data) {
      setSessions(res.data)
    }
  }, [])
  const loadMessages = useCallback(async () => {
    const res = await chatService.getMessages()
    if (res.success && res.data) {
      setMessages(res.data.messages)
    } else {
      setMessages([])
    }
  }, [])
  useEffect(() => {
    loadSessions()
    loadMessages()
  }, [loadSessions, loadMessages, currentSessionId])
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return
    const userMessage = input.trim()
    setInput('')
    setIsProcessing(true)
    try {
      if (messages.length === 0) {
        await chatService.createSession(undefined, currentSessionId, userMessage)
        await loadSessions()
      }
      const res = await chatService.sendMessage(userMessage, model)
      if (res.success) {
        await loadMessages()
        await loadSessions()
      } else {
        toast.error('Failed to send message')
      }
    } catch (err) {
      toast.error('Critical communication error')
    } finally {
      setIsProcessing(false)
    }
  }
  const handleInjectPrompt = (content: string) => {
    const cursor = textareaRef.current?.selectionStart || input.length
    const newValue = input.slice(0, cursor) + content + input.slice(cursor)
    setInput(newValue)
    toast.success('Prompt context injected')
    textareaRef.current?.focus()
  }
  const handleNewChat = () => {
    chatService.newSession()
    const nextId = chatService.getSessionId()
    setCurrentSessionId(nextId)
    setMessages([])
    setSidebarOpen(false)
    toast.info('New session initialized')
  }
  const switchSession = (id: string) => {
    if (id === currentSessionId) return
    chatService.switchSession(id)
    setCurrentSessionId(id)
    setSidebarOpen(false)
  }
  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const res = await chatService.deleteSession(id)
    if (res.success) {
      toast.success('Session removed')
      loadSessions()
      if (id === currentSessionId) {
        handleNewChat()
      }
    }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-64px)] relative">
      <div className="flex h-full py-6 gap-6 relative">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-card border-r lg:relative lg:border lg:rounded-2xl lg:z-0 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-sm overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 border-b flex items-center justify-between">
            <Button onClick={handleNewChat} className="flex-1 justify-start bg-indigo-600 hover:bg-indigo-700" size="sm">
              <Plus className="w-4 h-4 mr-2" /> New Chat
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden ml-2" onClick={() => setSidebarOpen(false)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {sessions.length === 0 && (
                <div className="p-8 text-center space-y-2 opacity-40">
                  <MessageSquare className="w-8 h-8 mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No History</p>
                </div>
              )}
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                    currentSessionId === session.id
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-xs font-medium truncate">{session.title}</span>
                  <Trash2
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 hover:text-destructive hover:opacity-100 transition-all"
                    onClick={(e) => deleteSession(session.id, e)}
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <div className="flex-1 flex flex-col min-w-0 bg-card border rounded-2xl overflow-hidden shadow-sm">
          <header className="p-3 lg:p-4 border-b flex items-center justify-between bg-muted/20 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 hidden sm:flex">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs lg:text-sm font-bold leading-tight truncate">
                  {sessions.find(s => s.id === currentSessionId)?.title || "Aether Session"}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] lg:text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-emerald-500" />
                    Agent Engine Active
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-[100px] sm:w-[160px] h-7 lg:h-8 text-[10px] lg:text-[11px]">
                  <Settings2 className="w-3 h-3 mr-1 lg:mr-2 opacity-70 hidden xs:block" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-[11px]">{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 space-y-6"
                  >
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-500 animate-pulse">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Aether Intelligence</h3>
                      <p className="text-sm text-muted-foreground mt-1 px-4">Initialize the session with a prompt from your library or a custom query.</p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex gap-4", m.role === 'user' ? 'flex-row-reverse' : '')}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm",
                        m.role === 'user' ? 'bg-secondary' : 'bg-indigo-600'
                      )}>
                        {m.role === 'user' ? <User className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={cn("space-y-1.5 max-w-[85%]", m.role === 'user' ? 'text-right' : '')}>
                        <div className={cn(
                          "inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-muted border border-border'
                        )}>
                          <div className="whitespace-pre-wrap text-left">{m.content}</div>
                        </div>
                        <p className="text-[10px] text-muted-foreground opacity-50 px-1 font-medium uppercase tracking-tighter">
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
          <footer className="p-4 bg-background border-t space-y-4">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="relative flex items-end gap-2 bg-muted rounded-2xl p-2 border focus-within:ring-2 ring-indigo-500/20 ring-offset-2 transition-all">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-indigo-500 rounded-xl">
                      <Library className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" side="top" align="start">
                    <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Context Injection</p>
                      <Badge variant="outline" className="text-[9px]">{prompts.length}</Badge>
                    </div>
                    <ScrollArea className="h-64">
                      <div className="p-1">
                        {prompts.length === 0 && (
                          <div className="p-8 text-center opacity-40">
                            <Library className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase">No Prompts Found</p>
                          </div>
                        )}
                        {prompts.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleInjectPrompt(p.content)}
                            className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors group"
                          >
                            <p className="text-xs font-bold group-hover:text-indigo-500 truncate">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{p.content}</p>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Query workspace or assistant..."
                  className="flex-1 min-h-[44px] max-h-40 bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-1 shadow-none text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  size="icon"
                  className="rounded-xl h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 py-1 bg-amber-500/5 rounded-full border border-amber-500/10 max-w-fit mx-auto px-4">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  Usage Limit: 10 req/min shared pool. Response quality may vary.
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}