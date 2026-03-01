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
  Clock,
  ArrowUpRight,
  Activity,
  History,
  Terminal,
  Library,
  ChevronRight
} from 'lucide-react'
import { chatService } from '@/lib/chat'
import type { SessionInfo } from '../../../worker/types'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
export function OverviewPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [latencyData] = useState([
    { time: '10:00', ms: 420 },
    { time: '11:00', ms: 580 },
    { time: '12:00', ms: 390 },
    { time: '13:00', ms: 610 },
    { time: '14:00', ms: 440 },
    { time: '15:00', ms: 510 },
    { time: '16:00', ms: 430 },
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
  const stats = [
    { label: 'AI Requests', value: '1,284', change: '+12.5%', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Chat Sessions', value: sessions.length.toString(), change: '+3.2%', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Avg Latency', value: '484ms', change: '-40ms', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Connected Tools', value: '3', change: 'Stable', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ]
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studio Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time observability and workspace metrics.</p>
        </div>
        {/* Stats Grid */}
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
                  <div className="text-xs text-muted-foreground flex items-center mt-2">
                    <Badge variant="outline" className="mr-2 h-5 border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                      {stat.change}
                    </Badge>
                    vs previous period
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latency Chart */}
          <Card className="lg:col-span-2 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Efficiency</CardTitle>
                <CardDescription>Response latency distribution over today's cycle.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-secondary/50">LIVE</Badge>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="latencyColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 800]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ms"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#latencyColor)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* Quick Actions */}
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Quick Launch</CardTitle>
              <CardDescription>Jump straight back into your work.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link to="/app/assistant" className="group">
                <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-bold">New Assistant Task</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold opacity-70">Agent Workspace</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-500 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link to="/app/prompts" className="group">
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Library className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-bold">Access Library</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold opacity-70">Asset Management</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-orange-500 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </CardContent>
          </Card>
          {/* Recent Sessions */}
          <Card className="lg:col-span-3 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest managed chat sessions and their status.</CardDescription>
              </div>
              <Link to="/app/assistant" className="text-xs text-indigo-500 font-bold hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex flex-col p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-black flex items-center justify-center shadow-sm">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                      </div>
                      <Badge variant="outline" className="text-[10px] opacity-70">
                        {new Date(session.lastActive).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold truncate group-hover:text-indigo-500 transition-colors">{session.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">ID: {session.id.slice(0, 8)}...</p>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl opacity-40">
                    <History className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm font-medium">No session history found</p>
                    <Link to="/app/assistant" className="text-xs text-indigo-500 font-bold mt-2 inline-block">Start your first chat</Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}