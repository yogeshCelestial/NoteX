"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea"

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
    const onInputFocus = () => {
        setMainFocused(true);
    }
    const blueCapture = () => {
        setMainFocused(false);
        alert("Note saved successfully!");
        console.log("Note saved:", formData);
        setFormData({ title: "", description: "" }); // Reset form data after saving

    }

    return (
        <div>
            <Input placeholder="Take a note..." className="w-full" onFocus={onInputFocus} value={formData.title} onChange={((e) => setFormData((prev: FormData) => { return { ...prev, title: e.target.value } }))} />
            {mainFocused && (
                <Textarea
                    value={formData.description}
                    onChange={((e) => setFormData((prev: FormData) => { return { ...prev, description: e.target.value } }))}
                    placeholder="Description"
                    className="w-full border-none resize-none"
                    onBlurCapture={blueCapture}
                />
            )}
        </div>
    )
}

export default TakeNote;