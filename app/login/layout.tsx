import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login | NoteX",
  description: "Add Notes Online/Offline",
};

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};