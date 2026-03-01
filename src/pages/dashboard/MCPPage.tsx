import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Trash2,
  ExternalLink,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppStore, type MCPServer as MCPServerType } from '@/lib/store'
import { copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'
const INITIAL_SERVERS: Omit<MCPServerType, 'id' | 'updatedAt'>[] = [
  { name: 'Cloudflare D1', url: 'https://d1.mcp.cloudflare.com', description: 'Access and query managed D1 databases.', status: 'connected' },
  { name: 'Cloudflare R2', url: 'https://r2.mcp.cloudflare.com', description: 'Object storage management and bucket exploration.', status: 'connected' },
  { name: 'Workers Browser', url: 'https://browser.mcp.cloudflare.com', description: 'Headless browser automation and web extraction.', status: 'limited' },
  { name: 'Google Web', url: 'https://search.mcp.google.com', description: 'Advanced search capabilities and knowledge graph access.', status: 'disconnected' },
]
export function MCPPage() {
  const servers = useAppStore(s => s.mcpServers)
  const addServer = useAppStore(s => s.addMCPServer)
  const deleteServer = useAppStore(s => s.deleteMCPServer)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  useEffect(() => {
    if (servers.length === 0) {
      INITIAL_SERVERS.forEach(s => addServer(s))
    }
  }, [servers, addServer])
  const filteredServers = servers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const handleAddServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const url = formData.get('url') as string
    const description = formData.get('description') as string
    addServer({ name, url, description, status: 'disconnected' })
    toast.success('MCP Server added to workspace')
    setIsSheetOpen(false)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
            <p className="text-muted-foreground mt-1">Manage Model Context Protocol connections and data sources.</p>
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
            <Button onClick={() => setIsSheetOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6">
              <Plus className="w-4 h-4 mr-2" />
              Register Server
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search servers..."
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
              {filteredServers.map((server) => (
                <Card key={server.id} className="hover:border-indigo-500/50 transition-all shadow-soft flex flex-col group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Server className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(server.url, "Endpoint URL copied")}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteServer(server.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4 truncate">{server.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        server.status === 'connected' ? "bg-emerald-500" :
                        server.status === 'limited' ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{server.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {server.description}
                    </p>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50 border font-mono text-[10px] break-all text-muted-foreground">
                        {server.url}
                      </div>
                      <Button variant="outline" size="sm" className="w-full rounded-lg hover:bg-indigo-500/5 hover:text-indigo-500 hover:border-indigo-500/20">
                        <Activity className="w-3.5 h-3.5 mr-2" /> Inspect Capabilities
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
                      <TableHead>Server Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServers.map((server) => (
                      <TableRow key={server.id} className="group">
                        <TableCell>
                          <div>
                            <p className="font-bold">{server.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{server.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-bold",
                            server.status === 'connected' ? "text-emerald-500 border-emerald-500/20" :
                            server.status === 'limited' ? "text-amber-500 border-amber-500/20" : "text-red-500 border-red-500/20"
                          )}>
                            {server.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-[10px] font-mono opacity-60">{server.url}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(server.url)}>
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteServer(server.id)}>
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="sm:max-w-xl">
            <form onSubmit={handleAddServer} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Register MCP Server</SheetTitle>
                <SheetDescription>
                  Connect a new Model Context Protocol server to your agent ecosystem.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-6 py-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Server Name</label>
                  <Input name="name" placeholder="e.g. Jira Sync Server" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SSE/Transport URL</label>
                  <Input name="url" placeholder="https://mcp.your-app.com/sse" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea name="description" placeholder="What capabilities does this server provide?" />
                </div>
              </div>
              <SheetFooter className="border-t pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Connect Server
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}