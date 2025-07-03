"use client"

import TakeNote from "@/components/TakeNote";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  const logoutSuccess = () => {
  localStorage.removeItem('refresh_token');
  router.push('/login');
};

  const logoutHandler = () => {
    request({
      endpoint: '/auth/logout', headers: {
        Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
      }
    }, logoutSuccess, () => { })
  }

  return (
    <main className="flex flex-col w-full min-h-screen">
      <Button onClick={logoutHandler}>Logout</Button>
      <div className="mx-auto w-1/2 p-4">
        <TakeNote />
      </div>
      <br />
      <div className="mx-auto w-4/5 p-4">
      </div>
    </main>
  );
}
