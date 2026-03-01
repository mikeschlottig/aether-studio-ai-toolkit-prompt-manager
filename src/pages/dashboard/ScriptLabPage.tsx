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
  ChevronRight, 
  Terminal,
  FileCode
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore, type Script } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
export function ScriptLabPage() {
  const scripts = useAppStore(s => s.scripts)
  const addScript = useAppStore(s => s.addScript)
  const updateScript = useAppStore(s => s.updateScript)
  const deleteScript = useAppStore(s => s.deleteScript)
  const [activeScript, setActiveScript] = useState<Script | null>(scripts[0] || null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const handleRun = () => {
    if (!activeScript) return
    setConsoleOutput(prev => [`[${new Date().toLocaleTimeString()}] Executing ${activeScript.name}...`, ...prev])
    setTimeout(() => {
      setConsoleOutput(prev => [`[${new Date().toLocaleTimeString()}] Success: Execution completed in 124ms.`, ...prev])
      toast.success('Script executed successfully')
    }, 1000)
  }
  const handleSave = () => {
    if (!activeScript) return
    updateScript(activeScript.id, { code: editValue })
    setIsEditing(false)
    toast.success('Changes saved')
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 flex flex-col h-[calc(100vh-64px)] gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Script Lab</h1>
            <p className="text-muted-foreground mt-1">Develop and test logic for your AI agents.</p>
          </div>
          <Button onClick={() => {
            const newScript = { name: 'Untitled Script', code: '', language: 'python' as const, description: '' }
            addScript(newScript)
            toast.success('New script added')
          }} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> New Script
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
          {/* Sidebar */}
          <Card className="col-span-12 md:col-span-3 flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Search scripts..." className="pl-9 h-8 text-xs" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {scripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => {
                      setActiveScript(script)
                      setIsEditing(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeScript?.id === script.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 ${activeScript?.id === script.id ? 'text-indigo-500' : ''}`} />
                    <span className="truncate">{script.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
          {/* Editor Area */}
          <div className="col-span-12 md:col-span-9 flex flex-col gap-4 overflow-hidden">
            {activeScript ? (
              <>
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-medium font-mono">{activeScript.name}</span>
                      <Badge variant="outline" className="ml-2 text-[10px] uppercase">{activeScript.language}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => deleteScript(activeScript.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {isEditing ? (
                        <Button size="sm" onClick={handleSave} className="h-8 bg-indigo-600">
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => { setEditValue(activeScript.code); setIsEditing(true); }} className="h-8">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      )}
                      <Button size="sm" onClick={handleRun} className="h-8 bg-emerald-600 hover:bg-emerald-700">
                        <Play className="w-4 h-4 mr-2" /> Run
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                    {isEditing ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-full bg-transparent text-white p-6 font-mono text-sm outline-none resize-none"
                        spellCheck={false}
                      />
                    ) : (
                      <SyntaxHighlighter
                        language={activeScript.language}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', height: '100%', fontSize: '0.875rem' }}
                      >
                        {activeScript.code}
                      </SyntaxHighlighter>
                    )}
                  </div>
                </Card>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="console" className="border-none">
                    <Card className="rounded-t-none border-t-0">
                      <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                          <Terminal className="w-3.5 h-3.5" />
                          Console Output
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        <div className="bg-black/90 p-4 font-mono text-xs text-emerald-500 h-32 overflow-y-auto space-y-1">
                          {consoleOutput.length === 0 ? (
                            <span className="opacity-40 italic">Waiting for execution...</span>
                          ) : (
                            consoleOutput.map((line, i) => <div key={i}>{line}</div>)
                          )}
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl opacity-40">
                <FileCode className="w-12 h-12 mb-4" />
                <p>Select or create a script to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}