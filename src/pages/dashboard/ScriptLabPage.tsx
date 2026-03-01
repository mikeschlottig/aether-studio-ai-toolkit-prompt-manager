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
  CheckCircle,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppStore, type Script } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

export function ScriptLabPage() {
  const scripts = useAppStore(s => s.scripts)
  const addScript = useAppStore(s => s.addScript)
  const updateScript = useAppStore(s => s.updateScript)
  const deleteScript = useAppStore(s => s.deleteScript)
  const [activeScript, setActiveScript] = useState<Script | null>(scripts[0] || null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  
  React.useEffect(() => {
    if (activeScript) {
      setEditValue(activeScript.code)
    }
  }, [activeScript])
  const handleRun = () => {
    if (!activeScript) return
    setConsoleOutput(prev => [`[${new Date().toLocaleTimeString()}] Executing ${activeScript.name}...`, ...prev])
    setTimeout(() => {
      setConsoleOutput(prev => [`[${new Date().toLocaleTimeString()}] SUCCESS: Runtime completed (124ms)`, `> Result: { "status": "processed", "id": "${activeScript.id.slice(0, 8)}" }`, ...prev])
      toast.success('Script executed successfully')
    }, 800)
  }
  const handleSave = () => {
    if (!activeScript) return
    updateScript(activeScript.id, { code: editValue })
    setIsEditing(false)
    toast.success('Changes committed to memory')
  }
  const handleCopy = () => {
    if (!activeScript) return
    navigator.clipboard.writeText(activeScript.code)
    toast.success('Copied to clipboard')
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 flex flex-col h-[calc(100vh-64px)] gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Script Lab</h1>
            <p className="text-muted-foreground mt-1">IDE for agentic logic and post-processing scripts.</p>
          </div>
          <Button onClick={() => {
            const newScript = { name: 'Untitled Script', code: '# Start coding...', language: 'python' as const, description: '' }
            addScript(newScript)
            toast.success('New script workspace initialized')
          }} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
            <Plus className="w-4 h-4 mr-2" /> New Script
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* Script Inventory */}
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
                  <button
                    key={script.id}
                    onClick={() => {
                      setActiveScript(script)
                      setIsEditing(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeScript?.id === script.id 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 ${activeScript?.id === script.id ? 'text-indigo-500' : 'opacity-40'}`} />
                    <span className="truncate flex-1 text-left">{script.name}</span>
                    {activeScript?.id === script.id && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
          {/* Code Workbench */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-hidden">
            {activeScript ? (
              <>
                <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-soft bg-[#0d1117] rounded-2xl">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                      <Separator orientation="vertical" className="h-4 mx-2 bg-white/10" />
                      <span className="text-xs font-mono text-white/70 font-medium">{activeScript.name}</span>
                      <Badge variant="secondary" className="text-[10px] h-5 bg-white/5 text-white/60 border-white/10">{activeScript.language}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={handleCopy} className="text-white/50 hover:text-white h-8 w-8">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteScript(activeScript.id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-4 mx-2 bg-white/10" />
                      {isEditing ? (
                        <Button size="sm" onClick={handleSave} className="h-8 bg-indigo-600 hover:bg-indigo-700">
                          <Save className="w-4 h-4 mr-2" /> Commit
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => { setEditValue(activeScript.code); setIsEditing(true); }} className="h-8 border-white/10 text-white/80 hover:bg-white/5">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      )}
                      <Button size="sm" onClick={handleRun} className="h-8 bg-emerald-600 hover:bg-emerald-700">
                        <Play className="w-4 h-4 mr-2" /> Run
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
                        customStyle={{ margin: 0, padding: '2rem', background: 'transparent', height: '100%', fontSize: '0.9rem', lineHeight: '1.6' }}
                      >
                        {activeScript.code || '# No code content'}
                      </SyntaxHighlighter>
                    )}
                  </div>
                </Card>
                {/* Terminal Output */}
                <Card className="h-48 border-none shadow-soft bg-black rounded-2xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 bg-white/5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Aether Terminal v1.0.4</span>
                  </div>
                  <ScrollArea className="h-[calc(100%-36px)]">
                    <div className="p-4 font-mono text-[11px] text-emerald-500 leading-relaxed space-y-1">
                      {consoleOutput.length === 0 ? (
                        <span className="opacity-30 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Kernel idle. Waiting for execution...
                        </span>
                      ) : (
                        consoleOutput.map((line, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="opacity-30 shrink-0 select-none">[{i}]</span>
                            <span className={line.includes('SUCCESS') ? 'text-emerald-400' : 'text-emerald-500/80'}>{line}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl opacity-20 bg-muted/20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Code2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold">No Active Script</h3>
                <p className="text-sm mt-2">Initialize a new script or select one from the inventory.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}