import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Search, Tag, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
const mockPrompts = [
  { id: 1, name: 'Senior UI Architect', version: 'v1.4', tags: ['System', 'Design'], updatedAt: '2h ago' },
  { id: 2, name: 'Copywriter Assistant', version: 'v2.1', tags: ['Marketing', 'Creative'], updatedAt: '5h ago' },
  { id: 3, name: 'SQL Query Optimizer', version: 'v1.0', tags: ['DevTools', 'Database'], updatedAt: '1d ago' },
  { id: 4, name: 'Python Refactor Pro', version: 'v0.9', tags: ['Coding', 'Refactor'], updatedAt: '3d ago' },
]
export function PromptLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground mt-1">Manage and version your collection of specialized prompts.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
      </div>
      <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search library..." className="pl-10 bg-background border-none shadow-none focus-visible:ring-1" />
        </div>
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Tag className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:border-indigo-500/50 transition-colors group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{prompt.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Updated {prompt.updatedAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase tracking-tight">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <span className="font-mono">{prompt.version}</span>
                <span>Active</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Coming Soon Card */}
        <div className="flex items-center justify-center border-2 border-dashed rounded-xl p-12 text-center opacity-40">
          <p className="text-sm font-medium">Advanced filtering and version <br/> control coming in Phase 2.</p>
        </div>
      </div>
    </div>
  )
}