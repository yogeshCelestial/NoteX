import { NotebookIcon, NotebookPenIcon, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    url: "/#notes",
    title: "Notes",
    icon: NotebookPenIcon
  },
  {
    url: "/#labels",
    title: "Labels",
    icon: NotebookIcon
  },
  {
    url: "/#trash",
    title: "Trash",
    icon: Trash2
  }
]

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        <div className="text-2xl font-semibold p-3">NoteX</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
