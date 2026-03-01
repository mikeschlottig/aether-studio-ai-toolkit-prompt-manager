import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Library,
  ScrollText,
  Wrench,
  Brain,
  Plus,
  Moon,
  Sun,
  Zap,
  FileCode,
  StickyNote,
  Search
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command'
import { useAppStore } from '@/lib/store'
import { chatService } from '@/lib/chat'
import { useTheme } from '@/hooks/use-theme'
import { toast } from '@/components/ui/sonner'
export function CommandPalette() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const isOpen = useAppStore(s => s.isCommandPaletteOpen)
  const setOpen = useAppStore(s => s.setCommandPaletteOpen)
  const prompts = useAppStore(s => s.prompts)
  const scripts = useAppStore(s => s.scripts)
  const mcpServers = useAppStore(s => s.mcpServers)
  const handleNavigate = (path: string) => {
    navigate(path)
    setOpen(false)
  }
  const handleNewChat = () => {
    chatService.newSession()
    handleNavigate('/app/assistant')
    toast.info('New chat session started')
  }
  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <div className="p-2 border-b bg-indigo-500/5">
        <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest opacity-70">
          <Zap className="w-3 h-3" />
          Aether Command
        </div>
      </div>
      <CommandInput placeholder="Search assets, scripts, commands..." />
      <CommandList>
        <CommandEmpty>No matching intelligence found.</CommandEmpty>
        <CommandGroup heading="System Navigation">
          <CommandItem onSelect={() => handleNavigate('/app/overview')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Overview</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/assistant')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>AI Assistant</span>
          </CommandItem>
        </CommandGroup>
        {prompts.length > 0 && (
          <CommandGroup heading="Deep Search: Prompts">
            {prompts.map(p => (
              <CommandItem 
                key={p.id} 
                onSelect={() => handleNavigate(`/app/prompts`)}
                value={`${p.name} ${p.content} ${p.tags.join(' ')}`}
              >
                <StickyNote className="mr-2 h-4 w-4 text-orange-500" />
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{p.content.slice(0, 60)}...</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {scripts.length > 0 && (
          <CommandGroup heading="Deep Search: Scripts">
            {scripts.map(s => (
              <CommandItem 
                key={s.id} 
                onSelect={() => handleNavigate(`/app/scripts`)}
                value={`${s.name} ${s.code} ${s.description}`}
              >
                <FileCode className="mr-2 h-4 w-4 text-indigo-500" />
                <div className="flex flex-col">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{s.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {mcpServers.length > 0 && (
          <CommandGroup heading="MCP Infrastructure">
            {mcpServers.map(server => (
              <CommandItem key={server.id} onSelect={() => handleNavigate('/app/mcp')}>
                <Search className="mr-2 h-4 w-4 text-emerald-500" />
                <span>{server.name} Gateway</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Quick Intelligence Actions">
          <CommandItem onSelect={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Initialize New Session</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => { toggleTheme(); setOpen(false); }}>
            <Sun className="mr-2 h-4 w-4 dark:hidden" />
            <Moon className="mr-2 h-4 w-4 hidden dark:block" />
            <span>Toggle UI Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/tools')}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>Open Tool Forge</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}