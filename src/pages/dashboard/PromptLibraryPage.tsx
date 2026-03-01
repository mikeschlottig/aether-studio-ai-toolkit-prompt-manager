import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Tag, MoreHorizontal, Edit, Trash2, Library, Code } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore, type Prompt } from '@/lib/store'
import { toast } from '@/components/ui/sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
export function PromptLibraryPage() {
  const prompts = useAppStore(s => s.prompts)
  const addPrompt = useAppStore(s => s.addPrompt)
  const updatePrompt = useAppStore(s => s.updatePrompt)
  const deletePrompt = useAppStore(s => s.deletePrompt)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
            <p className="text-muted-foreground mt-1">Manage and version your collection of specialized prompts.</p>
          </div>
          <Button onClick={() => setIsNewDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Prompt
          </Button>
        </div>
        <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..." 
              className="pl-10 bg-background border-none shadow-none focus-visible:ring-1" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="hover:border-indigo-500/50 transition-colors group cursor-pointer h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg truncate pr-2">{prompt.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingPrompt(prompt); setIsNewDialogOpen(true); }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deletePrompt(prompt.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
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
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
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