'use client'

import Notes from "@/components/Notes";
import TakeNote from "@/components/TakeNote";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Navbar } from "./NavBar";
import Loader from "./Loader";

export default function HomeInside() {
    const user = useAuth();
    const router = useRouter()

    useEffect(() => {
        if (!user.loading && !user.isAuthenticated) router.replace('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <main className="flex flex-col w-full min-h-screen">
            {
                (!user.loading && user.isAuthenticated)
                    ? (
                        (
                            <React.Fragment>
                                <Navbar user={user} />
                                <div className="mx-auto w-1/2 p-4">
                                    <TakeNote />
                                </div>
                                <br />
                                <div className="mx-auto w-4/5 p-4">
                                    <Notes />
                                </div>
                            </React.Fragment>
                        )
                    )
                    : (<Loader />)
            }
        </main>
    )
}