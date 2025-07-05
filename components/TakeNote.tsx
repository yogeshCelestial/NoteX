"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils";
import { httpHelper } from "@/lib/httpHelper";
import { toast } from "sonner";

type FormData = {
    title: string;
    description: string;
}
const TakeNote = () => {
    const [mainFocused, setMainFocused] = useState(false);
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
    const onInputFocus = () => {
        setMainFocused(true);
    }
    const blueCapture = async () => {
        setMainFocused(false);
        console.log("Note saved:", formData);
        setFormData({ title: "", description: "" });
        await httpHelper({ endpoint: '/note', method: 'POST', data: formData }, success , error)
    }

    return (
        <div>
            <Input placeholder="Take a note..." className={cn(['border-1 border-black'], mainFocused ? ['border-b-0'] : [''])} onFocus={onInputFocus} value={formData.title} onChange={((e) => setFormData((prev: FormData) => { return { ...prev, title: e.target.value } }))} />
            {mainFocused && (
                <Textarea
                    value={formData.description}
                    onChange={((e) => setFormData((prev: FormData) => { return { ...prev, description: e.target.value } }))}
                    placeholder="Description"
                    className="w-full border-1 border-black border-t-0 resize-none"
                    onBlurCapture={blueCapture}
                />
            )}
        </div>
    )
}

export default TakeNote;