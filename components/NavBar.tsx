// components/navbar.tsx

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="w-full h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="text-lg font-semibold">My App</div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Log in</Button>
      </div>
    </header>
  )
}
