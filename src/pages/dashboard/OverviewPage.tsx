import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import {
  Zap,
  MessageSquare,
  Activity,
  History,
  Terminal,
  Library,
  ChevronRight,
  Brain,
  HardDrive,
  Wifi,
  Clock
} from 'lucide-react'
import { chatService } from '@/lib/chat'
import { useAppStore } from '@/lib/store'
import type { SessionInfo } from '../../../worker/types'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
export function OverviewPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const prompts = useAppStore(s => s.prompts)
  const scripts = useAppStore(s => s.scripts)
  const skills = useAppStore(s => s.skills)
  const mcpServers = useAppStore(s => s.mcpServers)
  const [telemetryData] = useState([
    { time: '08:00', load: 12, accuracy: 92 },
    { time: '10:00', load: 45, accuracy: 94 },
    { time: '12:00', load: 30, accuracy: 91 },
    { time: '14:00', load: 85, accuracy: 98 },
    { time: '16:00', load: 40, accuracy: 96 },
    { time: '18:00', load: 25, accuracy: 95 },
    { time: '20:00', load: 15, accuracy: 97 },
  ])
  useEffect(() => {
    const fetchSessions = async () => {
      const res = await chatService.listSessions()
      if (res.success && res.data) {
        setSessions(res.data)
      }
    }
    fetchSessions()
  }, [])
  const storageUsage = (prompts.length * 1.2 + scripts.length * 2.5 + sessions.length * 0.5).toFixed(1)
  const stats = [
    { label: 'Prompt Library', value: prompts.length.toString(), change: 'Sync: Active', icon: Library, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Cloud Sessions', value: sessions.length.toString(), change: 'Durable State', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Agent Skills', value: skills.length.toString(), change: 'Runtime', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Storage Est.', value: `${storageUsage} KB`, change: 'Optimal', icon: HardDrive, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ]
  // Derived activity feed (mocked dates mixed with real names)
  const recentActivities = [
    ...prompts.map(p => ({ type: 'Prompt', name: p.name, time: p.updatedAt })),
    ...scripts.map(s => ({ type: 'Script', name: s.name, time: s.updatedAt }))
  ].sort((a, b) => b.time - a.time).slice(0, 5)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspace Telemetry</h1>
            <p className="text-muted-foreground mt-1">Integrated observability for your Aether Studio assets.</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 bg-indigo-500/5 text-indigo-500 border-indigo-500/20 font-bold">
            <Activity className="w-3 h-3 mr-2" /> LIVE SYNC ENABLED
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-soft overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-2 font-bold text-indigo-500">
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inference Performance</CardTitle>
                <CardDescription>Activity levels vs Response Accuracy.</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold uppercase opacity-60">Load</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase opacity-60">Accuracy</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="accColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="load"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#loadColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#accColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft flex flex-col">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Gateway connectivity status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              {mcpServers.slice(0, 4).map(server => (
                <div key={server.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      server.status === 'connected' ? "bg-emerald-500/10 text-emerald-500" :
                      server.status === 'limited' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                    )}>
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold truncate max-w-[120px]">{server.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase border-none bg-background">
                    {server.status}
                  </Badge>
                </div>
              ))}
              {mcpServers.length === 0 && (
                <div className="text-center py-10 opacity-40">
                  <WifiOff className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Gateways</p>
                </div>
              )}
            </CardContent>
            <div className="p-4 border-t bg-muted/10">
              <Button asChild variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/5 hover:text-indigo-500">
                <Link to="/app/mcp">Manage Servers <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </Card>
          <Card className="border-none shadow-soft lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 opacity-40" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{act.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{act.type} • Updated</p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && <p className="text-xs text-muted-foreground italic">No recent changes.</p>}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Persistent History</CardTitle>
                <CardDescription>Managed Durable Object instances.</CardDescription>
              </div>
              <Link to="/app/assistant" className="text-xs text-indigo-500 font-bold hover:underline">View Intelligence</Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => { chatService.switchSession(session.id); navigate('/app/assistant'); }}
                    className="flex flex-col p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                      </div>
                      <Badge variant="outline" className="text-[10px] opacity-70 border-none bg-background/50">
                        {new Date(session.lastActive).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold truncate group-hover:text-indigo-500 transition-colors">{session.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}