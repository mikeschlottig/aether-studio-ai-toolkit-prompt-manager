import React, { useEffect } from 'react'
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
  Zap
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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleNavigate('/app/overview')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Overview</span>
            <CommandShortcut>��O</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/assistant')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>AI Assistant</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/prompts')}>
            <Library className="mr-2 h-4 w-4" />
            <span>Prompt Library</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/scripts')}>
            <ScrollText className="mr-2 h-4 w-4" />
            <span>Script Lab</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/agent-skills')}>
            <Brain className="mr-2 h-4 w-4" />
            <span>Agent Skills</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/app/tools')}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>Tool Forge</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat Session</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => { toggleTheme(); setOpen(false); }}>
            <Sun className="mr-2 h-4 w-4 dark:hidden" />
            <Moon className="mr-2 h-4 w-4 hidden dark:block" />
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}