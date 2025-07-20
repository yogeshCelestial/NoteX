'use client'

import React, { useEffect, useState } from "react";
import Masonry from 'react-masonry-css'
import './notes.css'
import useNotesStore from "@/store/useNotesStore";
import { NoteCard } from "./NoteCard";
import { NotesSkeleton } from "./NotesSkeleton";
import { useSearch } from "@/store/useNoteStore";

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
    note: Note
    deleteNote: (id: string) => void
}

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    300: 1
};

export default function Notes() {
    console.log('Render!!');
    const notesStore = useNotesStore() as {
        notes: Note[],
        isLoading: boolean,
        fetchNotes: () => void
        deleteNote: (id: string) => void
    };
    const { notes, isLoading, fetchNotes, deleteNote } = notesStore;
    const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
    const [unPinnedNotes, setUnPinnedNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

    const searchStore = useSearch() as {
        query: string,
    };

    const { query } = searchStore;

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (query) {
            const filtered = notes.filter((n) => {
                const text = n.description.replace(/<[^>]*>/g, '');
                return (n.title.includes(query) || text.includes(query));
            });
            setFilteredNotes(filtered);
        } else {
            setFilteredNotes(notes);
        }
    }, [query, notes])

    useEffect(() => {
        setPinnedNotes(filteredNotes.filter((n) => n.is_pinned));
        setUnPinnedNotes(filteredNotes.filter((n) => !n.is_pinned));
    }, [filteredNotes]);

    return (
        <React.Fragment>
            {isLoading && (<NotesSkeleton />)}
            {!isLoading && filteredNotes.length === 0 && (
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center mt-20">
                    notes you add will appear here
                </h3>
            )}
            {!isLoading && filteredNotes.length > 0 && (
                <>
                    {pinnedNotes.length > 0 && (
                        <React.Fragment>
                            <p className="text-muted-foreground font-extrabold text-sm mt-2">
                                PINNED
                            </p>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {pinnedNotes.map((note) => (
                                    <NoteCard key={note.id} note={note} deleteNote={deleteNote} />
                                ))}
                            </Masonry>
                        </React.Fragment>
                    )}
                    {unPinnedNotes.length > 0 && (
                        <React.Fragment>
                            {pinnedNotes.length > 0 && (<p className="text-muted-foreground font-extrabold text-sm mt-2">
                                OTHERS
                            </p>)}
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {unPinnedNotes.map((note) => (
                                    <NoteCard key={note.id} note={note} deleteNote={deleteNote} />
                                ))}
                            </Masonry>
                        </React.Fragment>
                    )}
                </>
            )}

        </React.Fragment>

    )
}