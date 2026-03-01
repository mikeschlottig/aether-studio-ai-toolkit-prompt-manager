import React from 'react'
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  RefreshCcw,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tool Forge</h1>
            <p className="text-muted-foreground mt-1">Configure and manage AI tool connections and MCP servers.</p>
          </div>
          <Button className="bg-indigo-600">
            <Plus className="w-4 h-4 mr-2" /> Connect Server
          </Button>
        </div>
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Active Tools</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTools.map((tool) => (
              <Card key={tool.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <tool.icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <CardDescription className="text-xs">{tool.provider}</CardDescription>
                  </div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${tool.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">PRODUCTION</Badge>
                    <Button variant="ghost" size="sm" className="h-8 text-xs px-2">
                      Configure <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">MCP Servers</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Refresh All
            </Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Server Name</th>
                    <th className="text-left p-4 font-medium">Endpoint</th>
                    <th className="text-left p-4 font-medium">Capabilities</th>
                    <th className="text-left p-4 font-medium">Latency</th>
                    <th className="text-right p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mcpServers.map((server) => (
                    <tr key={server.name} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{server.name}</td>
                      <td className="p-4 font-mono text-xs opacity-70">{server.url}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {server.capabilities.map(c => (
                            <Badge key={c} variant="outline" className="text-[10px] py-0">{c}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{server.latency}</td>
                      <td className="p-4 text-right">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0">Online</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
        <Card className="bg-indigo-600 text-white border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Secure Tool Access</h3>
              </div>
              <p className="text-indigo-100 max-w-lg">
                Your tool configurations are encrypted at rest and only accessible by your authorized agents. 
                Manage permissions and API keys in your settings.
              </p>
            </div>
            <Button variant="secondary" className="h-12 px-8 font-bold">
              Upgrade Security
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}