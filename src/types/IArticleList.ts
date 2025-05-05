export interface Article {
    id: number;
    title: string;
    category: string;
    status: "draft" | "published" | "archived";
    author: string;
    publishDate: string;
    views: number;
    description: string;
    tags: string[];
    priority: number;
    lastModified: string;
    wordCount: number;
    readTime: number;
    likes: number;
    comments: number;
    children?: Article[];
}
