import React from "react"
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
  CreditCard
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
const navigation = {
  workspace: [
    { title: "Overview", icon: LayoutDashboard, url: "/app/overview" },
    { title: "Assistant", icon: MessageSquare, url: "/app/assistant" },
  ],
  libraries: [
    { title: "Prompts", icon: Library, url: "/app/prompts" },
    { title: "Scripts", icon: ScrollText, url: "/app/scripts" },
    { title: "Tool Forge", icon: Wrench, url: "/app/tools" },
  ],
  system: [
    { title: "Settings", icon: Settings, url: "/app/settings" },
  ]
}
export function AppSidebar(): JSX.Element {
  const location = useLocation()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">Aether Studio</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.workspace.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Libraries</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.libraries.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.system.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 w-full">
              <UserCircle className="w-5 h-5" />
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden overflow-hidden">
                <span className="text-sm font-medium truncate w-full">Alex Rivers</span>
                <span className="text-2xs text-muted-foreground truncate w-full">alex@aether.studio</span>
              </div>
              <ChevronUp className="ml-auto w-4 h-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-[200px]">
            <DropdownMenuItem>
              <UserCircle className="mr-2 w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 w-4 h-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}