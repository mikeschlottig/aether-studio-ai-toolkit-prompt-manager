import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  Copy
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore, type Prompt } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
export function PromptLibraryPage() {
  const prompts = useAppStore(s => s.prompts)
  const addPrompt = useAppStore(s => s.addPrompt)
  const updatePrompt = useAppStore(s => s.updatePrompt)
  const deletePrompt = useAppStore(s => s.deletePrompt)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const filteredPrompts = prompts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const handleCopy = (content: string) => {
    copyToClipboard(content, "Prompt logic copied")
  }
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const content = formData.get('content') as string
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, { name, content, tags })
      toast.success('Prompt updated')
    } else {
      addPrompt({ name, content, tags, version: 'v1.0' })
      toast.success('New prompt created')
    }
    setIsNewDialogOpen(false)
    setEditingPrompt(null)
  }
  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setIsNewDialogOpen(true)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
            <p className="text-muted-foreground mt-1">Manage and version your collection of specialized prompts.</p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as 'grid' | 'table')}
              className="bg-muted/50 p-1 rounded-full border"
            >
              <ToggleGroupItem value="grid" className="rounded-full h-8 w-8 p-0" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" className="rounded-full h-8 w-8 p-0" aria-label="Table view">
                <TableIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => { setEditingPrompt(null); setIsNewDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search library..."
            className="pl-10 h-11 bg-muted/30 border-none rounded-xl"
          />
        </div>
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="hover:border-indigo-500/50 transition-colors group cursor-pointer h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg truncate pr-2">{prompt.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleCopy(prompt.content); }}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(prompt)}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deletePrompt(prompt.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardDescription>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col" onClick={() => handleEdit(prompt)}>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {prompt.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {prompt.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase tracking-tight">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                        <span className="font-mono">{prompt.version}</span>
                        <span className="flex items-center gap-1 font-bold text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[100px]">Version</TableHead>
                      <TableHead className="w-[150px]">Updated</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrompts.map((prompt) => (
                      <TableRow key={prompt.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="font-bold">{prompt.name}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[300px]">
                          {prompt.content}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {prompt.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[9px] py-0 px-1.5 uppercase font-bold tracking-tighter">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs opacity-70">{prompt.version}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(prompt.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(prompt.content)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(prompt)}>
                                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deletePrompt(prompt.id)} className="text-destructive">
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
        <Sheet open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <SheetContent side="right" className="sm:max-w-xl">
            <form onSubmit={handleSave} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</SheetTitle>
                <SheetDescription>
                  Define your prompt logic and tags for better categorization.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" defaultValue={editingPrompt?.name} placeholder="e.g. Code Reviewer" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    name="content"
                    defaultValue={editingPrompt?.content}
                    placeholder="Enter your system prompt instructions..."
                    className="min-h-[300px] font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input name="tags" defaultValue={editingPrompt?.tags.join(', ')} placeholder="System, Coding, Creative" />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">
                  {editingPrompt ? 'Update Prompt' : 'Create Prompt'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}