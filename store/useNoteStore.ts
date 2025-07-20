import { Note } from "@/components/Notes";
import { create } from "zustand";

const useNote = create((set) => ({
    note: null,
    isEdit: false,

    editNote: (note: Note) => {
        set({ note, isEdit: true });
    },

    closeEdit: () => set({ note: null, isEdit: false }),
}));

export default useNote;