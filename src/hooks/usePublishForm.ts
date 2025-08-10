import { useCallback, useMemo, useRef, useState } from "react";
import { validateForPublish } from "@/utils/publishValidate";
import { articleApi } from "@/services/api";

export interface PublishFormState {
    title: string;
    content: string;
    tags: string[];
    type: string;
    status: "draft" | "published";
    coverUrl?: string;
    excerpt?: string;
}

export function usePublishForm(initial?: Partial<PublishFormState>) {
    const [form, setForm] = useState<PublishFormState>({
        title: "",
        content: "",
        tags: [],
        type: "tech",
        status: "draft",
        coverUrl: "",
        excerpt: "",
        ...initial,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const timerRef = useRef<number | null>(null);

    const issues = useMemo(() => validateForPublish(form).issues, [form]);

    const update = useCallback(<K extends keyof PublishFormState>(key: K, value: PublishFormState[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    }, []);

    const setContent = useCallback((content: string) => update("content", content), [update]);

    const autoSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await articleApi.saveDraft({ ...form, status: "draft" });
            setIsDirty(false);
        } finally {
            setIsSaving(false);
        }
    }, [form]);

    const scheduleAutoSave = useCallback(() => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => void autoSave(), 1000);
    }, [autoSave]);

    const publish = useCallback(async () => {
        const result = validateForPublish(form);
        if (!result.ok) return result;
        await articleApi.publish({ ...form, status: "published" });
        setIsDirty(false);
        return result;
    }, [form]);

    return { form, setForm, update, setContent, isSaving, isDirty, issues, scheduleAutoSave, autoSave, publish };
}
