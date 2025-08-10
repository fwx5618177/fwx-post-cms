/**
 * 统计编辑器内容：字符、词数、预计阅读时长
 * - 词数：英文按单词、中文按汉字统计
 * - 阅读时长：统一按每分钟 250 词（或 300 汉字）估算，取两者中较大者再向上取整
 */
export function computeEditorStats(text: string) {
    const raw = text || "";
    // 英文单词（含数字）
    const englishWords = raw.match(/\b[\w'-]+\b/g) || [];
    // 中文字符（CJK）
    const cjkChars = raw.match(/[\u4E00-\u9FFF]/g) || [];
    const wordCount = englishWords.length + cjkChars.length;
    const charCount = raw.replace(/\s+/g, "").length;

    const readingByWords = Math.ceil(wordCount / 250);
    const readingByChars = Math.ceil(charCount / 300);
    const readingTimeMin = Math.max(1, Math.max(readingByWords, readingByChars));

    return { charCount, wordCount, readingTimeMin };
}
