"use client"

import { Navbar } from "@/components/NavBar";
import Notes, { Note } from "@/components/Notes";
import TakeNote from "@/components/TakeNote";
import { AuthProvider } from "@/context/auth";
import { httpHelper } from "@/lib/httpHelper";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      await httpHelper(
        { endpoint: '/api/note', method: 'GET' },
        (response) => {
          if (response && Array.isArray(response.notes)) {
            setNotes(response.notes);
          } else {
            setNotes([]);
          }
        },
        (error) => { toast('Error Fetching Notes!', { description: error?.message || "Try Again" }) }
      );
    };
    getNotes();
  }, []);

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
          <Notes notes={notes} />
        </div>
      </main>
    </AuthProvider>
  );
}
