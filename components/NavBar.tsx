'use client'

import { AuthContextType } from "@/context/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { logoutHandler } from "@/lib/logout";

type NavProps = {
  user: AuthContextType
}

export function Navbar(props : NavProps) {
  const { user = null } = props
  

  const logout = () => {
    logoutHandler(true);
    if (user) user.setUser(null);
  }

  return (
    <header className="w-full h-16 bg-sidebar px-4 flex items-center justify-between">
      <div className="text-2xl font-semibold">NoteX</div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search Notes" className="" />
      </div>
      <div>
        <Button variant='outline' onClick={logout}>Logout</Button>
      </div>
    </header>
  )
}
