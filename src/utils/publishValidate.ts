export interface PublishFields {
    title?: string;
    content?: string;
    tags?: string[];
    coverUrl?: string;
    excerpt?: string;
}

export function validateForPublish(fields: PublishFields) {
    const issues: string[] = [];

    const title = (fields.title || "").trim();
    if (title.length < 5 || title.length > 80) issues.push("标题需 5-80 个字符");

    const content = (fields.content || "").trim();
    if (!content) issues.push("内容不能为空");

    const tags = fields.tags || [];
    if (tags.length === 0 || tags.length > 5) issues.push("标签需 1-5 个");

    if (!fields.coverUrl) issues.push("请上传封面图");

    const excerpt = (fields.excerpt || "").trim();
    if (excerpt.length < 30) issues.push("摘要需至少 30 字");

    return { ok: issues.length === 0, issues };
}
