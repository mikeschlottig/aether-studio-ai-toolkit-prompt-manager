import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Search,
  ExternalLink,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Trash2,
  Settings2,
  Box
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
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { copyToClipboard } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export function ToolForgePage() {
  const customTools = useAppStore(s => s.customTools)
  const addCustomTool = useAppStore(s => s.addCustomTool)
  const deleteCustomTool = useAppStore(s => s.deleteCustomTool)
  const [toolsViewMode, setToolsViewMode] = useState<'grid' | 'table'>('grid')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
            <p className="text-muted-foreground mt-1">Design and test custom AI tools and agentic interfaces.</p>
          </div>
          <Button onClick={() => setIsSheetOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" /> Add Tool
          </Button>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 uppercase font-bold text-[10px] tracking-widest px-2.5">
                {customTools.length} Custom Tools
              </Badge>
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
            {customTools.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 bg-muted/10 border-2 border-dashed rounded-3xl"
              >
                <Box className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-bold">No custom tools forged</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                  Create your own JSON APIs or BAML definitions for Aether agents.
                </p>
                <Button onClick={() => setIsSheetOpen(true)} variant="outline" className="rounded-full">
                  Create First Tool
                </Button>
              </motion.div>
            ) : toolsViewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {customTools.map((tool) => (
                  <Card key={tool.id} className="group hover:shadow-md transition-shadow border-none shadow-soft flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/5 flex items-center justify-center">
                        <Settings2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{tool.name}</CardTitle>
                        <CardDescription className="text-xs uppercase font-bold tracking-tight">{tool.type}</CardDescription>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="bg-muted/50 rounded-lg p-3 font-mono text-[10px] mb-4 line-clamp-4 flex-1">
                        {tool.config}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(tool.config)}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy Config</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteCustomTool(tool.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs px-3 rounded-lg hover:bg-indigo-500/5 hover:text-indigo-500 font-bold">
                          TEST <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
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
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[50%]">Config Preview</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customTools.map((tool) => (
                        <TableRow key={tool.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="font-bold">{tool.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase">{tool.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-[10px] font-mono opacity-60 truncate block max-w-[400px]">{tool.config}</code>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(tool.config)}>
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteCustomTool(tool.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
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
                <SheetDescription>Define a custom AI capability for your agentic workflows.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6 overflow-y-auto">
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
                    className="min-h-[300px] font-mono text-xs"
                    required
                  />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">Add to Forge</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}