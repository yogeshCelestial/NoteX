// components/navbar.tsx

import { Input } from "./ui/input";

export function Navbar() {
  return (
    <header className="w-full h-16 bg-sidebar px-4 flex items-center justify-between">
      <div className="text-2xl font-semibold">NoteX</div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search Notes" className="" />
      </div>
      <div>
      </div>
    </header>
  )
}
