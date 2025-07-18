import { Note } from '@/components/Notes';
import { httpHelper } from '@/lib/httpHelper';
import { toast } from 'sonner';
import { create } from 'zustand';

// Define the store
const useNotesStore = create((set) => ({
    notes: [],
    isLoading: false,
    error: null,

    // fetch Notes from API
    fetchNotes: async () => {
        set({ isLoading: true, error: null });
        await httpHelper(
            { endpoint: '/api/note', method: 'GET' },
            (response) => {
                set({ isLoading: false, error: null });
                if (response && Array.isArray(response.notes)) {
                    set({ notes: response.notes });
                } else {
                    set({ notes: [] });
                }
            },
            (error) => { set({ error: error }) }
        );
    },

    addNote: async (formData: Note) => {
        set({ error: null });
        await httpHelper({ endpoint: '/api/note', method: 'POST', data: formData },
            (response) => {
                set({ isLoading: false, error: null });
                if (response && response?.note) {
                    set((state: { notes: Note[]; isLoading: boolean; error: any }) => ({
                        notes: [...state.notes, response.note],
                        isLoading: false,
                    }));
                }
                toast('Note Saved Successfully!');
            },
            (error) => {
                toast('Not Saved!!', { description: error?.message || 'Try Again!' });
            }
        )
    },

    deleteNote: async (id: string) => {
        set({ error: null });
        await httpHelper(
            { endpoint: `/api/note/${id}`, method: 'DELETE' },
            (response) => {
                console.log(response);
                set({ isLoading: false, error: null });
                if (response && response?.id) {
                    set((state: { notes: Note[] }) => ({ notes: state.notes.filter(note => note.id !== response.id) }));
                    toast('Deleted Success!');
                }
            },
            (error) => {
                toast('Not Deleted!!', { description: error?.message || 'Try Again!' });
            }
        );
    },
}));

export default useNotesStore;