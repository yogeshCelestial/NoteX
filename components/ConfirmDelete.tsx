import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useNotesStore from "@/store/useNotesStore";

export function DeleteNoteDialog(props: { deleteModal: boolean, setDeleteModal: (s: boolean) => void, id: string }) {
    const { deleteModal, setDeleteModal, id } = props;
    const notesStore = useNotesStore() as {

        deleteNote: (id: string) => void
    };
    const { deleteNote } = notesStore;

    const handleOpen = (state: boolean) => {
        if (!state) {
            setDeleteModal(false);
        }
    }

    const deleteFunction = (id: string) => {
        deleteNote(id);
        setDeleteModal(false);
    }

    return (
        <Dialog open={deleteModal} onOpenChange={handleOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Deleting a note can never be undone.
                        Are you sure you want to delete this note?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="cursor-pointer" variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
                    </DialogClose>
                    <Button className="cursor-pointer" type="submit" onClick={() => deleteFunction(id)}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
