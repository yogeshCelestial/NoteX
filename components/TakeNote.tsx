"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { httpHelper } from "@/lib/httpHelper";
import { toast } from "sonner";
import { Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type FormData = {
    title: string;
    description: string;
    bg_color: string;
    is_pinned: boolean;
};
import { Editor } from 'primereact/editor';

const colors = ["bg-red-900", "bg-blue-900", "bg-green-900", "bg-yellow-900", "bg-purple-900", "bg-orange-900", "bg-pink-900", "bg-white"]

const customToolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['clean'], // Remove formatting
];

const TakeNote = () => {
    const initialState = {
        title: "",
        description: "",
        bg_color: "bg-white",
        is_pinned: false
    }
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialState);

    const success = () => {
        toast("Saved!", {
            description: "",
        });
    };

    const error = (error: Error) => {
        toast("Not Saved!", {
            description: error.message || 'Try Again.',
        });
    }

    const save = async () => {
        setOpenModal(false);
        console.log("Note saved:", formData);
        setFormData(initialState);
        await httpHelper({ endpoint: '/api/note', method: 'POST', data: formData }, success, error)
    }

    return (
        <div>
            <Input placeholder="Take a note..." className={cn(['border-1 border-black'])} onFocus={() => setOpenModal(true)} />
            <Dialog open={openModal} onOpenChange={(open) => {
                if (!open) {
                    setOpenModal(false);
                    setFormData(initialState)
                }
            }}>
                <DialogContent className="p-4 w-full">
                    <DialogHeader>
                        <DialogTitle className="mb-4 text-center">Take a note</DialogTitle>
                        <div>
                            <Input placeholder="Title" className={cn(['border-1 border-black mb-2'])} value={formData.title} onChange={((e) => setFormData((prev: FormData) => { return { ...prev, title: e.target.value } }))} />
                            <Editor
                                value={formData.description}
                                placeholder="Description"
                                onTextChange={(e) =>
                                    setFormData((prev: FormData) => ({
                                        ...prev,
                                        description: e.htmlValue ?? "",
                                    }))
                                }
                                modules={{ toolbar: customToolbar }}
                                showHeader={false}
                                style={{ height: '320px', width: '100%', marginBottom: '10px' }}
                            />

                            <div className="flex justify-between">
                                <div className="flex justify-start gap-2 items-center">
                                    <div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='outline'><Palette className="w-2 h-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="right" align="start" className="w-full">
                                                <DropdownMenuRadioGroup onValueChange={(value) => { setFormData((prev: FormData) => { return { ...prev, bg_color: value } }) }} className="flex flex-row justify-between">
                                                    {colors.map((color) => (
                                                        <DropdownMenuRadioItem className="px-1 py-0" key={color} value={color}>
                                                            <div className={cn([`w-5 h-5 rounded-full ${color} ${(formData.bg_color === color || color === 'bg-white') ? 'border-1 border-black' : 'border-0'}`])} />
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    {formData?.bg_color && (
                                        <div className={cn([`w-6 h-6 rounded-full border-1 border-black ${formData?.bg_color}`])} />
                                    )}
                                    <Label htmlFor="cb">Pin to top</Label>
                                    <Checkbox id="cb" onCheckedChange={(value) => { setFormData((prev: FormData) => { return { ...prev, is_pinned: !!value } }) }} className="w-6 h-6" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => { setOpenModal(false); setFormData(initialState) }}>Close</Button>
                                    <Button onClick={save}>Save</Button>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TakeNote;