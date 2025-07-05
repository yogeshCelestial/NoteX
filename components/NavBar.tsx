'use client'

import { useAuth } from "@/context/auth";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { logoutHandler } from "@/lib/logout";

export function Navbar() {
  const user = useAuth();

  useEffect(() => {
    if (!user.loading && !user.isAuthenticated) redirect('/login');
  }, [user]);

  const logout = () => {
    logoutHandler(true);
    user.setUser(null);
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
