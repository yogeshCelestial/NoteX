'use client'

import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Pin, PinOff, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { httpHelper } from "@/lib/httpHelper";
import { toast } from "sonner";
import Masonry from 'react-masonry-css'
import './notes.css'

export type Note = {
    id: string,
    title: string,
    description: string,
    bg_color: string,
    is_pinned: boolean,
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
    const [notes, setNotes] = useState<Note[]>([]);

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

    useEffect(() => {
        getNotes();
    }, []);

    const handlePin = async (id: string, patch: boolean) => {
        await httpHelper(
            { endpoint: `/api/note/${id}`, method: 'PATCH', data: { is_pinned: patch.toString() } },
            (response) => { toast('Pinned!'); console.log(response?.data); getNotes(); },
            (error) => { toast('Operation Failed!', { description: error?.message || "Try Again" }) }
        );
    }
    const deleteFunc = async (id: string) => {
        await httpHelper(
            { endpoint: `/api/note/${id}`, method: 'DELETE' },
            (response) => { toast('Deleted!'); console.log(response?.data); getNotes(); },
            (error) => { toast('Operation Failed!', { description: error?.message || "Try Again" }) }
        );
    }

    return (
        <React.Fragment>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {notes.map((note) => (
                    <NoteCard key={note.id} title={note.title} description={note.description} bg_color={note.bg_color} id={note.id} is_pinned={note.is_pinned === true} pinClickHandler={handlePin} deleteNote={deleteFunc} />
                ))}
            </Masonry>
        </React.Fragment>
    )
}

export const NoteCard = (props: NoteDetails) => {
    const { title, description, bg_color, id, is_pinned, pinClickHandler, deleteNote } = props;
    return (
        <Card className={`${bg_color} ${bg_color ? 'text-white' : 'text-black'}`}>
            <CardHeader className="relative">
                <Button className="absolute top-0 right-0 rounded" onClick={() => pinClickHandler(id, !is_pinned)} variant='ghost'>
                    {is_pinned ? <Pin /> : <PinOff />}
                </Button>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="break-words">{description}</p>
            </CardContent>
            <CardFooter className="relative">
                <Button className="absolute bottom-0 right-0 rounded" onClick={() => deleteNote(id)} variant='ghost'>
                    <Trash2 />
                </Button>
            </CardFooter>
        </Card>
    )
}