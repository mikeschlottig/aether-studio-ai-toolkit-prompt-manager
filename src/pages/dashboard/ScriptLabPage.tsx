import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Plus,
  Search,
  Code2,
  Play,
  Save,
  Trash2,
  Terminal,
  FileCode,
  Edit,
  Copy,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { copyToClipboard } from '@/lib/utils'
export function ScriptLabPage() {
  const scripts = useAppStore(s => s.scripts)
  const addScript = useAppStore(s => s.addScript)
  const updateScript = useAppStore(s => s.updateScript)
  const deleteScript = useAppStore(s => s.deleteScript)
  const [activeScriptId, setActiveScriptId] = useState<string | null>(scripts[0]?.id || null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<{msg: string, time: string, id: string}[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const activeScript = scripts.find(s => s.id === activeScriptId)
  React.useEffect(() => {
    if (activeScript && !isEditing) {
      setEditValue(activeScript.code)
    }
  }, [activeScript, isEditing])
  const handleRun = () => {
    if (!activeScript) return
    setIsRunning(true)
    const timestamp = new Date().toLocaleTimeString()
    setConsoleOutput(prev => [{ msg: `[INIT] Executing ${activeScript.name}...`, time: timestamp, id: crypto.randomUUID() }, ...prev])
    setTimeout(() => {
      setConsoleOutput(prev => [
        { msg: `> SUCCESS: Runtime completed (124ms)`, time: new Date().toLocaleTimeString(), id: crypto.randomUUID() },
        { msg: `> Result: { "status": "processed" }`, time: new Date().toLocaleTimeString(), id: crypto.randomUUID() },
        ...prev
      ])
      setIsRunning(false)
      toast.success('Script execution complete')
    }, 1200)
  }
  const handleSave = async () => {
    if (!activeScriptId) return
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateScript(activeScriptId, { code: editValue })
    setIsEditing(false)
    setIsSaving(false)
    toast.success('Script persisted to workspace')
  }
  const handleCreateScript = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const language = formData.get('language') as any
    const description = formData.get('description') as string
    const code = formData.get('code') as string
    addScript({ name, language, description, code })
    toast.success('New script created')
    setIsNewDialogOpen(false)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 flex flex-col h-[calc(100vh-64px)] gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Script Lab</h1>
            <p className="text-muted-foreground mt-1">IDE for agentic logic and post-processing scripts.</p>
          </div>
          <Button onClick={() => setIsNewDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" /> New Script
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
          <Card className="col-span-12 lg:col-span-3 flex flex-col overflow-hidden border-none shadow-soft">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Input placeholder="Filter scripts..." className="pl-9 h-9 text-xs bg-muted/50 border-none rounded-xl" />
              </div>
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {scripts.map((script) => (
                  <div key={script.id} className="group relative">
                    <button
                      onClick={() => {
                        setActiveScriptId(script.id)
                        setIsEditing(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeScriptId === script.id
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <FileCode className={`w-4 h-4 ${activeScriptId === script.id ? 'text-indigo-500' : 'opacity-40'}`} />
                      <span className="truncate flex-1 text-left">{script.name}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(script.code); }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-hidden">
            {activeScript ? (
              <>
                <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-soft bg-[#0d1117] rounded-2xl">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 mr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-xs font-mono text-white/70 truncate max-w-[200px]">{activeScript.name}</span>
                      <Badge variant="secondary" className="text-[10px] h-5 bg-white/5 text-white/60">{activeScript.language}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(editValue)} className="text-white/50 hover:text-white h-8 w-8">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Workbench Code</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button size="icon" variant="ghost" onClick={() => { deleteScript(activeScript.id); setActiveScriptId(null); }} className="text-red-400 hover:text-red-500 h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-4 mx-2 bg-white/10" />
                      {isEditing ? (
                        <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 bg-indigo-600 hover:bg-indigo-700 min-w-[90px]">
                          {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Commit
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="h-8 border-white/10 text-white/80 hover:bg-white/5">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      )}
                      <Button size="sm" onClick={handleRun} disabled={isRunning} className="h-8 bg-emerald-600 hover:bg-emerald-700 min-w-[80px]">
                        {isRunning ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />} Run
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {isEditing ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-full bg-transparent text-indigo-300 p-8 font-mono text-sm outline-none resize-none leading-relaxed"
                        spellCheck={false}
                        autoFocus
                      />
                    ) : (
                      <SyntaxHighlighter
                        language={activeScript.language}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '2rem', background: 'transparent', height: '100%', fontSize: '0.9rem' }}
                      >
                        {activeScript.code || '# No code content'}
                      </SyntaxHighlighter>
                    )}
                  </div>
                </Card>
                <Card className="h-48 border-none shadow-soft bg-black rounded-2xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 bg-white/5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Runtime Output</span>
                  </div>
                  <ScrollArea className="h-[calc(100%-36px)]">
                    <div className="p-4 font-mono text-[11px] text-emerald-500 space-y-1">
                      {consoleOutput.length === 0 ? (
                        <span className="opacity-30 italic">Kernel idle...</span>
                      ) : (
                        consoleOutput.map((log) => (
                          <div key={log.id} className="flex gap-2">
                            <span className="opacity-20 text-[9px]">[{log.time}]</span>
                            <span className={log.msg.includes('SUCCESS') ? 'text-emerald-300 font-bold' : ''}>{log.msg}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl opacity-20 bg-muted/20">
                <Code2 className="w-10 h-10 mb-6" />
                <h3 className="text-xl font-bold">No Active Workspace</h3>
              </div>
            )}
          </div>
        </div>
        <Sheet open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <SheetContent side="right" className="sm:max-w-xl">
            <form onSubmit={handleCreateScript} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>New Agent Script</SheetTitle>
                <SheetDescription>Initialize a new logic file in the Script Lab.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Script Name</label>
                  <Input name="name" placeholder="e.g. data_cleaner.py" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Runtime Language</label>
                  <Select name="language" defaultValue="python">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input name="description" placeholder="Agent utility description..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Code</label>
                  <Textarea name="code" placeholder="# Start coding..." className="min-h-[200px] font-mono text-xs" />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Create Script</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}