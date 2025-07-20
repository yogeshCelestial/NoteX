import { CopyIcon, Edit, Pin, PinOff, Trash2 } from "lucide-react";
import { Note, NoteDetails } from "./Notes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { useRef } from "react";
import { toast } from "sonner";
import useNote from "@/store/useNoteStore";
import useNotesStore from "@/store/useNotesStore";

export const NoteCard = (props: NoteDetails) => {
    const { note, deleteNote } = props;
    const { title, description, bg_color, id, is_pinned } = note;
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    const notesStore = useNotesStore() as {
        pinNote: (id: string, patch: boolean) => void
    }

    const { pinNote } = notesStore;

    const noteState = useNote() as {
        editNote: (n: Note) => void
    }

    const { editNote } = noteState;

    const copyContent = () => {
        const text = descriptionRef?.current?.innerText || '';
        if (text) {
            navigator.clipboard.writeText(text);
            toast('Copied to Clipboard!');
        } else {
            toast('Failed to Copy!!');
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card className={`relative ${bg_color} ${(bg_color && bg_color !== 'bg-white') ? 'text-white' : 'text-black'}`}>
                    <CardHeader>
                        <Button className="absolute top-0 right-0 rounded cursor-pointer" onClick={() => pinNote(id, !is_pinned)} variant='ghost'>
                            {is_pinned ? <PinOff /> : <Pin />}
                        </Button>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p
                            ref={descriptionRef}
                            className="break-words"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </CardContent>
                    <CardFooter />
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="cursor-pointer" onClick={copyContent}><CopyIcon /> Copy</ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={() => editNote(note)}><Edit /> Edit</ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={() => deleteNote(id)}><Trash2 /> Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}