"use client"

import { Navbar } from "@/components/NavBar";
import TakeNote from "@/components/TakeNote";
import { AuthProvider } from "@/context/auth";


export default function Home() {

  return (
    <AuthProvider>
      <main className="flex flex-col w-full min-h-screen">
        <Navbar />
        {/* <Button onClick={logoutHandler}>Logout</Button> */}
        <div className="mx-auto w-1/2 p-4">
          <TakeNote />
        </div>
        <br />
        <div className="mx-auto w-4/5 p-4">
        </div>
      </main>
    </AuthProvider>
  );
}
