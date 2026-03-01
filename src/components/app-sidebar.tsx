import React, { useEffect, useState } from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Library,
  ScrollText,
  Wrench,
  Settings,
  UserCircle,
  ChevronUp,
  LogOut,
  CreditCard,
  Zap,
  Brain,
  Server
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { chatService } from "@/lib/chat"
export function AppSidebar(): JSX.Element {
  const location = useLocation()
  const [sessionCount, setSessionCount] = useState<number>(0)
  useEffect(() => {
    const fetchCount = async () => {
      const res = await chatService.listSessions()
      if (res.success && res.data) {
        setSessionCount(res.data.length)
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="h-16 border-b flex items-center px-4 overflow-hidden">
        <Link to="/" className="flex items-center gap-3 w-full">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">Aether Studio</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/overview"}
                tooltip="Overview"
              >
                <Link to="/app/overview">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/assistant"}
                tooltip="AI Assistant"
              >
                <Link to="/app/assistant">
                  <MessageSquare className="w-4 h-4" />
                  <span>Assistant</span>
                  {sessionCount > 0 && (
                    <Badge variant="secondary" className="ml-auto px-1.5 h-4 text-[10px] bg-indigo-500/10 text-indigo-500 border-none group-data-[collapsible=icon]:hidden">
                      {sessionCount}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Libraries</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/prompts"}
                tooltip="Prompts"
              >
                <Link to="/app/prompts">
                  <Library className="w-4 h-4" />
                  <span>Prompts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/scripts"}
                tooltip="Scripts"
              >
                <Link to="/app/scripts">
                  <ScrollText className="w-4 h-4" />
                  <span>Scripts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/mcp"}
                tooltip="MCP Servers"
              >
                <Link to="/app/mcp">
                  <Server className="w-4 h-4" />
                  <span>MCP Servers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/agent-skills"}
                tooltip="Agent Skills"
              >
                <Link to="/app/agent-skills">
                  <Brain className="w-4 h-4" />
                  <span>Agent Skills</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/tools"}
                tooltip="Tool Forge"
              >
                <Link to="/app/tools">
                  <Wrench className="w-4 h-4" />
                  <span>Tool Forge</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse group-data-[collapsible=icon]:hidden" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/app/settings"}
                tooltip="Settings"
              >
                <Link to="/app/settings">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 w-full hover:bg-muted/50 rounded-xl transition-all">
              <UserCircle className="w-5 h-5 shrink-0 text-muted-foreground" />
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden overflow-hidden flex-1 px-1">
                <span className="text-xs font-bold truncate w-full text-foreground">Alex Rivers</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">alex@aether.studio</span>
              </div>
              <ChevronUp className="w-3.5 h-3.5 group-data-[collapsible=icon]:hidden opacity-40 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-[200px] rounded-xl shadow-xl">
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer">
              <UserCircle className="mr-2 w-4 h-4 opacity-70" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer">
              <CreditCard className="mr-2 w-4 h-4 opacity-70" />
              Billing Tier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive py-2.5 rounded-lg cursor-pointer focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}