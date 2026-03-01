import React from 'react'
import {
  User,
  Palette,
  Key,
  Shield,
  Trash2,
  Plus,
  Monitor,
  Moon,
  Sun,
  Copy,
  AlertTriangle,
  Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTheme } from '@/hooks/use-theme'
import { chatService } from '@/lib/chat'
import { toast } from '@/components/ui/sonner'
export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  const handleClearAll = async () => {
    const res = await chatService.clearAllSessions()
    if (res.success) {
      toast.success(`Purge complete: ${res.data?.deletedCount} sessions cleared.`)
    }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage global preferences and security parameters.</p>
        </div>
        <Tabs defaultValue="general" className="flex flex-col lg:flex-row gap-12">
          <TabsList className="bg-transparent flex-col h-auto items-start space-y-1 w-full lg:w-72 border-r pr-8 rounded-none">
            <TabsTrigger value="general" className="w-full justify-start data-[state=active]:bg-secondary rounded-xl h-11 px-4 text-sm font-medium">
              <User className="w-4 h-4 mr-3 opacity-70" /> General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-secondary rounded-xl h-11 px-4 text-sm font-medium">
              <Palette className="w-4 h-4 mr-3 opacity-70" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="api" className="w-full justify-start data-[state=active]:bg-secondary rounded-xl h-11 px-4 text-sm font-medium">
              <Key className="w-4 h-4 mr-3 opacity-70" /> API Gateway
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start data-[state=active]:bg-secondary rounded-xl h-11 px-4 text-sm font-medium">
              <Shield className="w-4 h-4 mr-3 opacity-70" /> Privacy & Security
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 max-w-3xl">
            <TabsContent value="general" className="space-y-10 mt-0 focus-visible:ring-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Profile Details</h3>
                  <p className="text-sm text-muted-foreground">This information is local to your studio workspace.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Legal Name</label>
                    <Input defaultValue="Alex Rivers" className="rounded-xl border-none bg-muted/50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Identifier</label>
                    <Input defaultValue="alex@aether.studio" className="rounded-xl border-none bg-muted/50 h-11" />
                  </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-11 px-8">Update Core Profile</Button>
              </section>
              <Separator />
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Workspace Policy</h3>
                  <p className="text-sm text-muted-foreground">Default behavior for agent memory and session persistence.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Cloud Sync History</p>
                      <p className="text-xs text-muted-foreground">Auto-persist sessions to the durable object controller.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Anonymous Telemetry</p>
                      <p className="text-xs text-muted-foreground">Help us optimize agent latency via anonymized traces.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="appearance" className="space-y-10 mt-0 focus-visible:ring-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Interface Environment</h3>
                  <p className="text-sm text-muted-foreground">Choose a theme that promotes your best flow state.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => !isDark && toggleTheme()}
                    className={`p-6 rounded-2xl border-2 text-left space-y-4 transition-all group ${!isDark ? 'border-indigo-600 bg-indigo-50/50' : 'border-border hover:border-indigo-500/30 bg-muted/20'}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border">
                      <Sun className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold">Aether Light</p>
                      <p className="text-xs text-muted-foreground">High contrast for daylight focus sessions.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => isDark && toggleTheme()}
                    className={`p-6 rounded-2xl border-2 text-left space-y-4 transition-all group ${isDark ? 'border-indigo-600 bg-indigo-500/5' : 'border-border hover:border-indigo-500/30 bg-muted/20'}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-sm border border-white/10">
                      <Moon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold">Aether Obsidian</p>
                      <p className="text-xs text-muted-foreground">Muted tones for deep work and night mode.</p>
                    </div>
                  </button>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="security" className="space-y-10 mt-0 focus-visible:ring-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Data Sovereignty</h3>
                  <p className="text-sm text-muted-foreground">Manage your session data and access permissions.</p>
                </div>
                <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Purge All Sessions</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          Permanently delete every chat session from the AppController database. This action is irreversible.
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="rounded-full px-6 shrink-0">Execute Purge</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will wipe your entire conversation history across all agents. This data cannot be recovered.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Confirm Deletion
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
                <div className="p-6 rounded-2xl border bg-muted/20 flex items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <Lock className="w-5 h-5 text-indigo-500 opacity-70" />
                    <div>
                      <p className="text-sm font-bold">Advanced Encryption</p>
                      <p className="text-xs text-muted-foreground">Workspace data is encrypted using standard AES-256 protocols at rest.</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="api" className="space-y-8 mt-0 focus-visible:ring-0">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Infrastructure Keys</h3>
                    <p className="text-sm text-muted-foreground">Credentials managed via Cloudflare Secrets.</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl h-9 border-indigo-500/20 text-indigo-500 bg-indigo-500/5">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Key
                  </Button>
                </div>
                <Card className="border-none shadow-soft overflow-hidden">
                  <div className="divide-y border-t">
                    {[
                      { name: 'OpenAI (Proxy)', key: 'sk-proj-•••••••••••••7a2', lastUsed: '2h ago' },
                      { name: 'Aether Edge Runtime', key: 'cf-ai-•••••••••••••0x1', lastUsed: 'Now' },
                      { name: 'SerpAPI Discovery', key: 'serp-•••••••••••••9b4', lastUsed: '1d ago' },
                    ].map((api) => (
                      <div key={api.name} className="p-5 flex items-center justify-between bg-card">
                        <div className="space-y-1">
                          <p className="text-sm font-bold">{api.name}</p>
                          <div className="flex items-center gap-2">
                             <code className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{api.key}</code>
                             <span className="text-[10px] text-muted-foreground/50 italic">Used {api.lastUsed}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><Copy className="w-4 h-4 opacity-50" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-destructive"><Trash2 className="w-4 h-4 opacity-50" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
import { Badge } from '@/components/ui/badge'