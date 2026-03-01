import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { CommandPalette } from '@/components/command-palette'
import { useAppStore } from '@/lib/store'
import { chatService } from '@/lib/chat'
import { toast } from 'sonner'
export function DashboardLayout() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const setCommandPaletteOpen = useAppStore(s => s.setCommandPaletteOpen)
  const isCommandPaletteOpen = useAppStore(s => s.isCommandPaletteOpen)
  const shortcuts = useAppStore(s => s.shortcuts)
  const getShortcutKey = (id: string) => shortcuts.find(s => s.id === id)?.key || ''
  // Global Shortcuts
  useHotkeys(`mod+${getShortcutKey('command-palette')}`, (e) => {
    e.preventDefault()
    setCommandPaletteOpen(!isCommandPaletteOpen)
  }, { enableOnForm: true })
  useHotkeys(`mod+${getShortcutKey('new-chat')}`, (e) => {
    e.preventDefault()
    chatService.newSession()
    toast.info('Starting new AI session')
    window.location.href = '/app/assistant'
  })
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/app">Studio</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.slice(1).map((segment, index) => (
                  <React.Fragment key={segment}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-[10px] font-bold text-muted-foreground">
              <span className="opacity-50">CMD + K</span>
              <span>COMMANDS</span>
            </div>
            <ThemeToggle className="relative top-0 right-0 shadow-none border" />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  )
}