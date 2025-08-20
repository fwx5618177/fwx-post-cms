import { useCallback, useMemo, useRef, useState } from "react";
import { validateForPublish } from "@/utils/publishValidate";
import { articleApi } from "@/services/api";

export interface PublishFormState {
    title: string;
    content: string;
    tags: string[];
    type: string;
    status: "draft" | "published";
    auditStatus: "pending" | "approved" | "rejected";
    section?: string;
    scheduledAt?: string | null;
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
        auditStatus: "pending",
        section: "general",
        scheduledAt: null,
        coverUrl: "",
        excerpt: "",
        ...initial,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const [lastPublishedAt, setLastPublishedAt] = useState<number | null>(null);
    const [lastError, setLastError] = useState<string | null>(null);
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
            setLastSavedAt(Date.now());
            setLastError(null);
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
        try {
            await articleApi.publish({ ...form, status: "published" });
            setIsDirty(false);
            setLastPublishedAt(Date.now());
            setLastError(null);
            return result;
        } catch (e: any) {
            const message = e?.message || "发布失败，请稍后重试";
            setLastError(message);
            return { ok: false, issues: [message] } as ReturnType<typeof validateForPublish>;
        }
    }, [form]);

    return {
        form,
        setForm,
        update,
        setContent,
        isSaving,
        isDirty,
        issues,
        scheduleAutoSave,
        autoSave,
        publish,
        lastSavedAt,
        lastPublishedAt,
        lastError,
    };
}
