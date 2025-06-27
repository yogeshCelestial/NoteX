import { NotebookIcon, NotebookPenIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import React from "react"

export function Sidebar() {
  const items = [
    {
      href: "/#notes",
      label: "Notes",
      icon: <NotebookPenIcon className="h-4 w-4" />
    },
    {
      href: "/#labels",
      label: "Labels",
      icon: <NotebookIcon className="h-4 w-4" />
    },
    {
      href: "/#trash",
      label: "Trash",
      icon: <Trash2 className="h-4 w-4" />
    }
  ]
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] pr-4 py-4">
      <nav className="space-y-2">
        {items.map((item) => (
            <Link
            key={item.href}
              href={item.href}
              className="flex items-center text-lg px-2 py-1 rounded-r-full hover:bg-gray-200"
            >
              <span className="flex items-center gap-2 px-2">
                {item.icon}
                {item.label}
              </span>
            </Link>
        ))}


      </nav>
    </aside>
  )
}
