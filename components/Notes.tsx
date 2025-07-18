'use client'

import React, { useEffect } from "react";
import { httpHelper } from "@/lib/httpHelper";
import { toast } from "sonner";
import Masonry from 'react-masonry-css'
import './notes.css'
import useNotesStore from "@/store/useNotesStore";
import Loader from "./Loader";
import { NoteCard } from "./NoteCard";

export type Note = {
    id: string,
    title: string,
    description: string,
    bg_color: string,
    is_pinned: boolean,
    created_at?: string,
    updated_at?: string,
}

export type NoteDetails = {
    title: string,
    description: string,
    bg_color: string
    id: string
    is_pinned: boolean
    pinClickHandler: (id: string, patch: boolean) => void
    deleteNote: (id: string) => void

}
const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    300: 1
};

export default function Notes() {
    const notesStore = useNotesStore() as {
        notes: Note[],
        isLoading: boolean,
        error: any,
        fetchNotes: () => void
        deleteNote: (id: string) => void
    };
    const { notes, isLoading, error, fetchNotes, deleteNote } = notesStore;

    useEffect(() => {
        fetchNotes();
    }, []);

    const handlePin = async (id: string, patch: boolean) => {
        await httpHelper(
            { endpoint: `/api/note/${id}`, method: 'PATCH', data: { is_pinned: patch.toString() } },
            (response) => { toast('Pinned!'); console.log(response?.data); fetchNotes(); },
            (error) => { toast('Operation Failed!', { description: error?.message || "Try Again" }) }
        );
    }

    return (
        <React.Fragment>
            {!isLoading ? (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {notes.map((note) => (
                        <NoteCard key={note.id} title={note.title} description={note.description} bg_color={note.bg_color} id={note.id} is_pinned={note.is_pinned === true} pinClickHandler={handlePin} deleteNote={deleteNote} />
                    ))}
                </Masonry>
            )
                : (<Loader />) // will be replace by shimmer UI later
            }
        </React.Fragment>
    )
}