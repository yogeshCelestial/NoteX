import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Pin } from 'lucide-react';
import { Button } from "./ui/button";

export type Note = {
    [key: string]: string,
}

export type NoteDetails = {
    title: string,
    description: string,
    bg_color: string
}

export default function Notes(props: { notes: Note[] }) {
    const { notes = [] } = props;
    return (
        <React.Fragment>
            {notes.map((note) => (
                <NoteCard key={note.id} title={note.title} description={note.description} bg_color={note.bg_color} />
            ))}
        </React.Fragment>
    )
}

export const NoteCard = (props: NoteDetails) => {
    const { title, description, bg_color } = props;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardAction>
                    <Button variant='ghost'>
                        <Pin />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
            <CardFooter>
                <p>{bg_color}</p>
            </CardFooter>
        </Card>
    )
}