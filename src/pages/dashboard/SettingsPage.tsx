import React from 'react'
import { 
  User, 
  Palette, 
  Key, 
  Bell, 
  Shield, 
  ChevronRight, 
  Copy,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/use-theme'
export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Preferences and configurations for your Aether account.</p>
        </div>
        <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-12">
          <TabsList className="bg-transparent flex-col h-auto items-start space-y-2 w-full md:w-64 border-r pr-8 rounded-none">
            <TabsTrigger value="general" className="w-full justify-start data-[state=active]:bg-secondary data-[state=active]:shadow-none h-10 px-4">
              <User className="w-4 h-4 mr-3" /> General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-secondary data-[state=active]:shadow-none h-10 px-4">
              <Palette className="w-4 h-4 mr-3" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="api" className="w-full justify-start data-[state=active]:bg-secondary data-[state=active]:shadow-none h-10 px-4">
              <Key className="w-4 h-4 mr-3" /> API Keys
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start data-[state=active]:bg-secondary data-[state=active]:shadow-none h-10 px-4">
              <Shield className="w-4 h-4 mr-3" /> Security
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 max-w-3xl">
            <TabsContent value="general" className="space-y-10 mt-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Profile Details</h3>
                  <p className="text-sm text-muted-foreground">Manage how you appear to the system.</p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input defaultValue="Alex Rivers" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input defaultValue="alex@aether.studio" />
                  </div>
                </div>
                <Button className="bg-indigo-600">Update Profile</Button>
              </section>
              <Separator />
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Workspace Preferences</h3>
                  <p className="text-sm text-muted-foreground">Default settings for new agents and sessions.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Auto-save sessions</p>
                    <p className="text-xs text-muted-foreground">Automatically save conversation history to the cloud.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </section>
            </TabsContent>
            <TabsContent value="appearance" className="space-y-10 mt-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Interface Theme</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred visual environment.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => !isDark && toggleTheme()}
                    className={`p-4 rounded-xl border-2 text-left space-y-3 transition-all ${!isDark ? 'border-indigo-600 bg-secondary' : 'border-border hover:border-indigo-500/50'}`}
                  >
                    <Sun className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm font-bold">Light</p>
                      <p className="text-xs text-muted-foreground">Clean and bright.</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => isDark && toggleTheme()}
                    className={`p-4 rounded-xl border-2 text-left space-y-3 transition-all ${isDark ? 'border-indigo-600 bg-secondary' : 'border-border hover:border-indigo-500/50'}`}
                  >
                    <Moon className="w-6 h-6 text-indigo-500" />
                    <div>
                      <p className="text-sm font-bold">Dark</p>
                      <p className="text-xs text-muted-foreground">Easy on the eyes.</p>
                    </div>
                  </button>
                  <button className="p-4 rounded-xl border-2 border-border opacity-50 cursor-not-allowed text-left space-y-3">
                    <Monitor className="w-6 h-6" />
                    <div>
                      <p className="text-sm font-bold">System</p>
                      <p className="text-xs text-muted-foreground">Sync with OS.</p>
                    </div>
                  </button>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="api" className="space-y-10 mt-0">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold">External API Integrations</h3>
                  <p className="text-sm text-muted-foreground">Manage credentials for tools and agents.</p>
                </div>
                <Card>
                  <div className="divide-y">
                    {[
                      { name: 'OpenAI API', key: 'sk-proj-•••••••••••••7a2', lastUsed: '2h ago' },
                      { name: 'Cloudflare AI', key: 'cf-ai-•••••••••••••0x1', lastUsed: 'Now' },
                      { name: 'SerpAPI', key: 'serp-•••••••••••••9b4', lastUsed: '1d ago' },
                    ].map((api) => (
                      <div key={api.name} className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{api.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{api.key}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add New Key
                </Button>
              </section>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
import { Trash2 } from 'lucide-react'