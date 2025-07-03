'use client'

import { useAuth } from "@/context/auth";
import { Input } from "./ui/input";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { request } from "@/lib/utils";
import { Button } from "./ui/button";

export function Navbar() {
  const user = useAuth();

  useEffect(() => {
    if (!user.loading && !user.isAuthenticated) redirect('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter();

  const logoutSuccess = () => {
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const logoutHandler = () => {
    request({
      endpoint: '/auth/logout', authorization: false, headers: {
        Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
      }
    }, logoutSuccess, () => { })
  }

  return (
    <header className="w-full h-16 bg-sidebar px-4 flex items-center justify-between">
      <div className="text-2xl font-semibold">NoteX</div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search Notes" className="" />
      </div>
      <div>
        <Button variant='outline' onClick={logoutHandler}>Logout</Button>
      </div>
    </header>
  )
}
