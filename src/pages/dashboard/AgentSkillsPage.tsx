import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Brain,
  Copy,
  Trash2,
  Edit,
  LayoutGrid,
  Table as TableIcon,
  PlayCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore, type Skill } from '@/lib/store'
import { chatService } from '@/lib/chat'
import { toast } from '@/components/ui/sonner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
export function AgentSkillsPage() {
  const navigate = useNavigate()
  const skills = useAppStore(s => s.skills)
  const addSkill = useAppStore(s => s.addSkill)
  const updateSkill = useAppStore(s => s.updateSkill)
  const deleteSkill = useAppStore(s => s.deleteSkill)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Capability copied to clipboard')
  }
  const handleTestSkill = (capability: string) => {
    // In a real app we'd inject this into the message input
    toast.info('Opening test session with skill context')
    navigate('/app/assistant')
  }
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const capability = formData.get('capability') as string
    if (editingSkill) {
      updateSkill(editingSkill.id, { name, description, capability })
      toast.success('Skill updated')
    } else {
      addSkill({ name, description, capability })
      toast.success('Skill created')
    }
    setIsSheetOpen(false)
    setEditingSkill(null)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Skills</h1>
            <p className="text-muted-foreground mt-1">Manage reusable logic behaviors and autonomous agent capabilities.</p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as 'grid' | 'table')}
              className="bg-muted/50 p-1 rounded-full border"
            >
              <ToggleGroupItem value="grid" className="rounded-full h-8 w-8 p-0">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" className="rounded-full h-8 w-8 p-0">
                <TableIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => { setEditingSkill(null); setIsSheetOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              New Skill
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-10 h-11 bg-muted/30 border-none rounded-xl"
          />
        </div>
        <AnimatePresence mode="wait">
          {skills.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-muted/10 border-2 border-dashed rounded-3xl"
            >
              <Brain className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-bold">No skills defined</h3>
              <p className="text-sm text-muted-foreground mb-6">Create your first reusable agent capability.</p>
              <Button onClick={() => setIsSheetOpen(true)} variant="outline" className="rounded-full">
                Define First Capability
              </Button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSkills.map((skill) => (
                <Card key={skill.id} className="group hover:border-indigo-500/50 transition-all shadow-soft flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-500" onClick={() => handleTestSkill(skill.capability)}>
                                <PlayCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Test Skill</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSkill(skill); setIsSheetOpen(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteSkill(skill.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4">{skill.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="relative bg-muted/50 rounded-lg p-3 group/code">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Capability String</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/code:opacity-100 transition-opacity" onClick={() => handleCopy(skill.capability)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <code className="text-xs font-mono block break-all text-indigo-500">{skill.capability}</code>
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
                      <TableHead>Skill Name</TableHead>
                      <TableHead>Capability</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSkills.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell>
                          <div>
                            <p className="font-bold">{skill.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{skill.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs font-mono text-indigo-500 bg-indigo-500/5 px-1.5 py-0.5 rounded">{skill.capability}</code>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(skill.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-500" onClick={() => handleTestSkill(skill.capability)}>
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSkill(skill); setIsSheetOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteSkill(skill.id)}>
                              <Trash2 className="w-4 h-4" />
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="sm:max-w-xl">
            <form onSubmit={handleSave} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>{editingSkill ? 'Edit Skill' : 'Define Agent Skill'}</SheetTitle>
                <SheetDescription>Skills are reusable logic primitives that agents can trigger.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" defaultValue={editingSkill?.name} placeholder="e.g. Sentiment Intelligence" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input name="description" defaultValue={editingSkill?.description} placeholder="Short summary of the skills purpose" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capability String / Code</label>
                  <Textarea
                    name="capability"
                    defaultValue={editingSkill?.capability}
                    placeholder="Enter the capability logic or trigger string..."
                    className="min-h-[200px] font-mono text-sm"
                    required
                  />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}