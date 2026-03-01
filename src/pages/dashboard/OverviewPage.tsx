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
  ResponsiveContainer
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
  HardDrive
} from 'lucide-react'
import { chatService } from '@/lib/chat'
import { useAppStore } from '@/lib/store'
import type { SessionInfo } from '../../../worker/types'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
export function OverviewPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const prompts = useAppStore(s => s.prompts)
  const scripts = useAppStore(s => s.scripts)
  const skills = useAppStore(s => s.skills)
  const [latencyData] = useState([
    { time: '08:00', load: 12 },
    { time: '10:00', load: 45 },
    { time: '12:00', load: 30 },
    { time: '14:00', load: 85 },
    { time: '16:00', load: 40 },
    { time: '18:00', load: 25 },
    { time: '20:00', load: 15 },
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
            <CardHeader>
              <CardTitle>Inference Load</CardTitle>
              <CardDescription>Activity levels across recent cycles.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Quick Launch</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link to="/app/assistant" className="group">
                <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-bold">New Mission</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
              <Link to="/app/prompts" className="group">
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Library className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-bold">Asset Manager</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                </div>
              </Link>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 border-none shadow-soft">
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
                      <Badge variant="outline" className="text-[10px] opacity-70">
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