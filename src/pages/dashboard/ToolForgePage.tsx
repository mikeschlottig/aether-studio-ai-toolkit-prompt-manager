import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Search,
  ExternalLink,
  Cpu,
  Cloud,
  ShieldCheck,
  RefreshCcw,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Trash2,
  Settings2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore, type CustomTool } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const nativeTools = [
  { id: 't1', name: 'Web Search', provider: 'Native', status: 'connected', description: 'Real-time web browsing and information retrieval.', icon: Search, config: 'native_search_engine' },
  { id: 't2', name: 'Weather API', provider: 'Native', status: 'connected', description: 'Global weather conditions and forecasts.', icon: Cloud, config: 'native_weather_provider' },
  { id: 't3', name: 'D1 Database', provider: 'Cloudflare', status: 'limited', description: 'Query and manage production D1 SQL databases.', icon: Cpu, config: 'cf_d1_binding' },
]
export function ToolForgePage() {
  const customTools = useAppStore(s => s.customTools)
  const addCustomTool = useAppStore(s => s.addCustomTool)
  const deleteCustomTool = useAppStore(s => s.deleteCustomTool)
  const [toolsViewMode, setToolsViewMode] = useState<'grid' | 'table'>('grid')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const allTools = [
    ...nativeTools.map(t => ({ ...t, isNative: true })),
    ...customTools.map(t => ({ 
      id: t.id, 
      name: t.name, 
      provider: 'Custom', 
      status: 'connected', 
      description: `Custom ${t.type.toUpperCase()} tool.`, 
      icon: Settings2, 
      config: t.config, 
      isNative: false 
    }))
  ]
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Tool configuration copied')
  }
  const handleAddTool = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const type = formData.get('type') as CustomTool['type']
    const config = formData.get('config') as string
    addCustomTool({ name, type, config })
    toast.success('Custom tool added to forge')
    setIsSheetOpen(false)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tool Forge</h1>
            <p className="text-muted-foreground mt-1">Configure and manage AI tool connections and MCP servers.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full h-11 px-6">
              Connect Server
            </Button>
            <Button onClick={() => setIsSheetOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6 shadow-lg shadow-indigo-500/20">
              <Plus className="w-4 h-4 mr-2" /> Add Tool
            </Button>
          </div>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 uppercase font-bold text-[10px] tracking-widest px-2.5">Active Tools</Badge>
            </div>
            <ToggleGroup
              type="single"
              value={toolsViewMode}
              onValueChange={(v) => v && setToolsViewMode(v as 'grid' | 'table')}
              className="bg-muted/50 p-1 rounded-full border scale-90 origin-right"
            >
              <ToggleGroupItem value="grid" className="rounded-full h-8 w-8 p-0">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" className="rounded-full h-8 w-8 p-0">
                <TableIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <AnimatePresence mode="wait">
            {toolsViewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {allTools.map((tool) => (
                  <Card key={tool.id} className="group hover:shadow-md transition-shadow border-none shadow-soft flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/5 flex items-center justify-center">
                        <tool.icon className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{tool.name}</CardTitle>
                        <CardDescription className="text-xs">{tool.provider}</CardDescription>
                      </div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${tool.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{tool.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(tool.config)}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy Config</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {!tool.isNative && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteCustomTool(tool.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs px-3 rounded-lg hover:bg-indigo-500/5 hover:text-indigo-500">
                          Configure <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-none shadow-soft overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Tool Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[40%]">Config Preview</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allTools.map((tool) => (
                        <TableRow key={tool.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded bg-indigo-500/5 flex items-center justify-center">
                                <tool.icon className="w-3.5 h-3.5 text-indigo-500" />
                              </div>
                              <span className="font-bold text-sm">{tool.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-medium">{tool.provider}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${tool.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="text-xs capitalize">{tool.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-[10px] font-mono opacity-60 truncate block max-w-[250px]">{tool.config}</code>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(tool.config)}>
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Configure <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="sm:max-w-xl">
            <form onSubmit={handleAddTool} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Forge New Tool</SheetTitle>
                <SheetDescription>Define a custom AI capability for your agents.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tool Name</label>
                  <Input name="name" placeholder="e.g. Analytics Engine" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interface Type</label>
                  <Select name="type" defaultValue="json">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON API</SelectItem>
                      <SelectItem value="yaml">YAML Spec</SelectItem>
                      <SelectItem value="baml">BAML Typed</SelectItem>
                      <SelectItem value="worker">Cloudflare Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Configuration / Spec</label>
                  <Textarea
                    name="config"
                    placeholder="Paste tool definition or endpoint configuration..."
                    className="min-h-[250px] font-mono text-xs"
                    required
                  />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Add to Forge</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}