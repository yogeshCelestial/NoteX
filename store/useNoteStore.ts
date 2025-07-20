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

const useSearch = create((set) => ({
    query: '',

    setQuery: (query: string) => set({ query: query }),
}))

export { useSearch };
export default useNote;