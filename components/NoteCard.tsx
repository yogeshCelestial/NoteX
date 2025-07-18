import { Pin, PinOff, Trash2 } from "lucide-react";
import { NoteDetails } from "./Notes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export const NoteCard = (props: NoteDetails) => {
    const { title, description, bg_color, id, is_pinned, pinClickHandler, deleteNote } = props;
    return (
        <Card className={`relative ${bg_color} ${(bg_color && bg_color !== 'bg-white') ? 'text-white' : 'text-black'}`}>
            <CardHeader>
                <Button className="absolute top-0 right-0 rounded cursor-pointer" onClick={() => pinClickHandler(id, !is_pinned)} variant='ghost'>
                    {is_pinned ? <Pin /> : <PinOff />}
                </Button>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p
                    className="break-words"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </CardContent>
            <CardFooter className="relative">
                <Button className="absolute bottom-0 right-0 rounded cursor-pointer" onClick={() => deleteNote(id)} variant='ghost'>
                    <Trash2 />
                </Button>
            </CardFooter>
        </Card>
    )
}