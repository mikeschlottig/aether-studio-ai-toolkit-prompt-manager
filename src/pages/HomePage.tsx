import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, Shield, Cpu, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Toaster } from '@/components/ui/sonner'
const features = [
  {
    title: 'Prompt Engineering',
    description: 'Design, version, and deploy high-performance prompts with ease.',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'AI Assistant',
    description: 'A context-aware co-pilot designed to streamline your development workflow.',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Secure by Design',
    description: 'Enterprise-grade security for your AI assets and configurations.',
    icon: Shield,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'MCP Ready',
    description: 'Full integration with Model Context Protocol for advanced tool usage.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500'
  }
]
export function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ThemeToggle />
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-24 pb-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-muted text-muted-foreground border border-border mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
              The Intelligence Operating System
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
              Design the future of <span className="text-indigo-500">Intelligence</span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Aether Studio is a premium workspace for AI engineers. Manage prompts, scripts, and agents in a minimalist environment built for flow state.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
              <Link to="/app">
                Enter Studio
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full">
              View Documentation
            </Button>
          </motion.div>
        </div>
        {/* Feature Grid */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.4 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>
        {/* Footer & Usage Disclosure */}
        <footer className="mt-40 border-t border-border pt-12 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">Aether Studio</span>
            </div>
            <p>© 2025 Aether Agency. Powered by Cloudflare Agents.</p>
            <div className="flex items-center gap-6 font-medium">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">AI Usage Disclosure</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/60 leading-relaxed">
                Aether Studio utilizes advanced AI capabilities. Please be informed that there is a limit on the number of requests that can be made to the AI servers across all user apps in a given time period to ensure stability and fair access.
              </p>
            </div>
          </div>
        </footer>
      </main>
      <Toaster richColors closeButton />
    </div>
  )
}