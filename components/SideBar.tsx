import { Home, Settings } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r bg-muted px-4 py-6">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link href="/settings" className="flex items-center gap-2 text-sm font-medium">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </aside>
  )
}
