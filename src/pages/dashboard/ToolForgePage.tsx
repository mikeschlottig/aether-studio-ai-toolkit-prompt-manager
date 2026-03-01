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
  Table as TableIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const activeTools = [
  { name: 'Web Search', provider: 'Native', status: 'connected', description: 'Real-time web browsing and information retrieval.', icon: Search },
  { name: 'Weather API', provider: 'Native', status: 'connected', description: 'Global weather conditions and forecasts.', icon: Cloud },
  { name: 'D1 Database', provider: 'Cloudflare', status: 'limited', description: 'Query and manage production D1 SQL databases.', icon: Cpu },
]
const mcpServers = [
  { name: 'Browser MCP', url: 'https://mcp.aether.studio/browser', capabilities: ['Read', 'Write'], latency: '42ms' },
  { name: 'File System MCP', url: 'local://fs-server', capabilities: ['Read'], latency: '12ms' },
]
export function ToolForgePage() {
  const [toolsViewMode, setToolsViewMode] = useState<'grid' | 'table'>('grid')
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tool Forge</h1>
            <p className="text-muted-foreground mt-1">Configure and manage AI tool connections and MCP servers.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-6 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" /> Connect Server
          </Button>
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
              <ToggleGroupItem value="grid" className="rounded-full h-8 w-8 p-0" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" className="rounded-full h-8 w-8 p-0" aria-label="Table view">
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
                {activeTools.map((tool) => (
                  <Card key={tool.name} className="hover:shadow-md transition-shadow border-none shadow-soft">
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
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">Production</Badge>
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
                        <TableHead className="w-[200px]">Tool Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[400px]">Description</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTools.map((tool) => (
                        <TableRow key={tool.name} className="hover:bg-muted/30 transition-colors">
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
                          <TableCell className="text-muted-foreground text-sm">
                            {tool.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              Configure <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                            </Button>
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase font-bold text-[10px] tracking-widest px-2.5">MCP Servers</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-8 rounded-lg">
              <RefreshCcw className="w-3.5 h-3.5 mr-2 opacity-50" /> Refresh All
            </Button>
          </div>
          <Card className="border-none shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Server Name</th>
                    <th className="text-left p-4 font-medium">Endpoint</th>
                    <th className="text-left p-4 font-medium">Capabilities</th>
                    <th className="text-left p-4 font-medium">Latency</th>
                    <th className="text-right p-4 font-medium">Status</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mcpServers.map((server) => (
                    <TableRow key={server.name} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold">{server.name}</TableCell>
                      <TableCell className="font-mono text-xs opacity-70">{server.url}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {server.capabilities.map(c => (
                            <Badge key={c} variant="outline" className="text-[9px] py-0 px-1.5 uppercase font-bold">{c}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{server.latency}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0.5 text-[10px] uppercase font-bold">Online</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>
        <Card className="bg-indigo-600 text-white border-none shadow-lg overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Secure Tool Access</h3>
              </div>
              <p className="text-indigo-100 max-w-lg leading-relaxed">
                Your tool configurations are encrypted at rest and only accessible by your authorized agents.
                Manage permissions and API keys in your settings.
              </p>
            </div>
            <Button variant="secondary" className="h-12 px-8 font-bold rounded-full bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-xl">
              Upgrade Security
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}