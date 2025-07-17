"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils";
import { httpHelper } from "@/lib/httpHelper";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type FormData = {
    title: string;
    description: string;
};

const TakeNote = () => {
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: ""
    });

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
        setFormData({ title: "", description: "" });
        await httpHelper({ endpoint: '/api/note', method: 'POST', data: formData }, success, error)
    }

    return (
        <div>
            <Input placeholder="Take a note..." className={cn(['border-1 border-black'])} onFocus={() => setOpenModal(true)} />
            <Dialog open={openModal} onOpenChange={(open) => {
                if (!open) {
                    setOpenModal(false);
                    setFormData({ title: "", description: "" })
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Take a note</DialogTitle>
                        <DialogDescription>
                            <Input placeholder="Title" className={cn(['border-1 border-black mb-2'])} value={formData.title} onChange={((e) => setFormData((prev: FormData) => { return { ...prev, title: e.target.value } }))} />
                            <Textarea
                                value={formData.description}
                                onChange={((e) => setFormData((prev: FormData) => { return { ...prev, description: e.target.value } }))}
                                placeholder="Description"
                                className="w-full border-1 border-black resize-none mb-2"
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => { setOpenModal(false); setFormData({ title: "", description: "" }) }}>Close</Button>
                                <Button onClick={save}>Save</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TakeNote;