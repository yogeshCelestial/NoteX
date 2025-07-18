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
      <div className="text-2xl font-semibold flex-2">NoteX</div>
      <div className="flex justify-center gap-2 flex-3">
        <Input placeholder="Search Notes" className="" />
      </div>
      <div className=" flex flex-2 justify-end">
        <Button variant='outline' onClick={logout}>Logout</Button>
      </div>
    </header>
  )
}
