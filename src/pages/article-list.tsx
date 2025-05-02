import React, { useState, useEffect } from "react";
import styles from "@styles/pages/article-list.module.scss";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table, { ColumnType, SortState } from "../components/Table";

interface Article {
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

const ArticleList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(123);

    // Fetch articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockArticles: Article[] = [
                    {
                        id: 1,
                        title: "Getting Started with React - A Comprehensive Guide for Beginners",
                        category: "Frontend",
                        status: "published",
                        author: "John Doe",
                        publishDate: "2024-03-15",
                        lastModified: "2024-03-16",
                        views: 1234,
                        description:
                            "Learn the basics of React and start building your first application with this comprehensive guide.",
                        tags: ["React", "JavaScript", "Web Development"],
                        priority: 9,
                        wordCount: 2500,
                        readTime: 12,
                        likes: 45,
                        comments: 12,
                        children: [
                            {
                                id: 101,
                                title: "React useState Deep Dive",
                                category: "Frontend",
                                status: "published",
                                author: "John Doe",
                                publishDate: "2024-03-15",
                                lastModified: "2024-03-16",
                                views: 234,
                                description: "A deep dive into useState hook.",
                                tags: ["React", "Hooks"],
                                priority: 7,
                                wordCount: 1200,
                                readTime: 6,
                                likes: 12,
                                comments: 3,
                                children: [
                                    {
                                        id: 201,
                                        title: "React useState Advanced Patterns",
                                        category: "Frontend",
                                        status: "draft",
                                        author: "John Doe",
                                        publishDate: "2024-03-15",
                                        lastModified: "2024-03-16",
                                        views: 54,
                                        description: "Advanced patterns for useState.",
                                        tags: ["React", "Hooks"],
                                        priority: 5,
                                        wordCount: 800,
                                        readTime: 4,
                                        likes: 2,
                                        comments: 0,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 2,
                        title: "Advanced TypeScript Tips and Best Practices for Large Scale Applications",
                        category: "Programming",
                        status: "draft",
                        author: "Jane Smith",
                        publishDate: "2024-03-14",
                        lastModified: "2024-03-15",
                        views: 856,
                        description:
                            "Deep dive into TypeScript features and patterns that will help you build better applications.",
                        tags: ["TypeScript", "Programming", "Best Practices"],
                        priority: 7,
                        wordCount: 3200,
                        readTime: 16,
                        likes: 32,
                        comments: 8,
                    },
                    {
                        id: 3,
                        title: "Node.js Best Practices - Performance Optimization Guide",
                        category: "Backend",
                        status: "published",
                        author: "Mike Johnson",
                        publishDate: "2024-03-13",
                        lastModified: "2024-03-14",
                        views: 2341,
                        description: "Learn how to optimize your Node.js applications for better performance.",
                        tags: ["Node.js", "Performance", "Backend"],
                        priority: 8,
                        wordCount: 4100,
                        readTime: 20,
                        likes: 67,
                        comments: 15,
                    },
                    // Add more mock data to demonstrate scrolling
                    ...Array.from({ length: 50 }, (_, i) => ({
                        id: i + 4,
                        title: `Sample Article ${i + 4}`,
                        category: ["Frontend", "Backend", "Programming"][i % 3],
                        status: ["published", "draft", "archived"][i % 3] as Article["status"],
                        author: ["John Doe", "Jane Smith", "Mike Johnson"][i % 3],
                        publishDate: "2024-03-" + String(12 - (i % 12)).padStart(2, "0"),
                        lastModified: "2024-03-" + String(13 - (i % 12)).padStart(2, "0"),
                        views: Math.floor(Math.random() * 5000),
                        description: `This is a sample article ${i + 4} description.`,
                        tags: ["Sample", `Tag${i + 1}`],
                        priority: Math.floor(Math.random() * 10) + 1,
                        wordCount: Math.floor(Math.random() * 5000) + 1000,
                        readTime: Math.floor(Math.random() * 25) + 5,
                        likes: Math.floor(Math.random() * 100),
                        comments: Math.floor(Math.random() * 30),
                    })),
                ];

                setArticles(mockArticles);
                setTotal(123);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page, pageSize, searchTerm, selectedCategory, selectedStatus]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || article.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleEdit = (record: Article) => {
        navigate(`/content/article/edit/${record.id}?mode=edit`);
    };

    const handleDelete = (record: Article) => {
        console.log("Delete article:", record);
        // TODO: Implement delete functionality
    };

    const handleView = (record: Article) => {
        navigate(`/content/article/edit/${record.id}?mode=view`);
    };

    const handleCreate = () => {
        navigate("/content/article/edit");
    };

    const handleTableChange = (_pagination: any, _filters: any, sorter: SortState<Article>) => {
        console.log("Table changed:", { pagination: _pagination, filters: _filters, sorter });
    };

    const getRowClassName = (record: Article, index: number) => {
        const classes = [];
        if (record.priority > 8) classes.push(styles.highPriority);
        if (record.status === "archived") classes.push(styles.archivedRow);
        return classes.join(" ");
    };

    const columns: ColumnType<Article>[] = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sortable: true,
            fixed: "left",
            width: 320,
            render: (value, record) => (
                <div
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "280px",
                        cursor: "pointer",
                    }}
                    title={record.description}
                >
                    {value}
                    {record.priority > 8 && (
                        <span
                            style={{
                                marginLeft: "8px",
                                color: "#ef4444",
                                fontSize: "0.75rem",
                            }}
                        >
                            ★
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            sortable: true,
            width: 220,
            align: "center",
            render: value => (
                <span
                    style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "#6366f1",
                        fontSize: "0.875rem",
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: "center",
            render: (value: Article["status"]) => <span className={`${styles.status} ${styles[value]}`}>{value}</span>,
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
            width: 150,
            render: value => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                        }}
                    >
                        {value.charAt(0)}
                    </div>
                    {value}
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "publishDate",
            key: "publishDate",
            sortable: true,
            width: 120,
            align: "center",
        },
        {
            title: "Last Modified",
            dataIndex: "lastModified",
            key: "lastModified",
            width: 120,
            align: "center",
        },
        {
            title: "Words",
            dataIndex: "wordCount",
            key: "wordCount",
            width: 100,
            align: "right",
            render: value => `${(value / 1000).toFixed(1)}k`,
        },
        {
            title: "Read Time",
            dataIndex: "readTime",
            key: "readTime",
            width: 100,
            align: "right",
            render: value => `${value} min`,
        },
        {
            title: "Views",
            dataIndex: "views",
            key: "views",
            align: "right",
            sortable: true,
            width: 100,
            render: value => (
                <span style={{ color: value > 1000 ? "#6366f1" : "inherit" }}>{value.toLocaleString()}</span>
            ),
        },
        {
            title: "Engagement",
            dataIndex: "likes",
            key: "engagement",
            width: 220,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <span title="Likes">❤️ {record.likes}</span>
                    <span title="Comments">💬 {record.comments}</span>
                </div>
            ),
        },
        {
            title: "Actions",
            dataIndex: "id",
            key: "actions",
            fixed: "right",
            width: 150,
            align: "center",
            render: (_: any, record: Article) => (
                <div className={styles.actions}>
                    <button onClick={() => handleView(record)} title="View">
                        <FaEye />
                    </button>
                    <button onClick={() => handleEdit(record)} title="Edit">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(record)} title="Delete">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.articleListPage}>
            <div className={styles.header}>
                <h1>Articles</h1>
                <button className={styles.createButton} onClick={handleCreate}>
                    Create New Article
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <FaSearch />
                    <input type="text" placeholder="Search articles..." value={searchTerm} onChange={handleSearch} />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <FaFilter />
                        <select value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="all">All Categories</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Programming">Programming</option>
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <FaFilter />
                        <select value={selectedStatus} onChange={handleStatusChange}>
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            <Table<Article>
                columns={columns}
                dataSource={filteredArticles}
                loading={loading}
                striped
                rowKey="id"
                onChange={handleTableChange}
                sticky
                scroll={{ x: 1600, y: 800 }}
                treeChildrenKey="children"
                rowIndent={24}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                    onPageSizeChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onRow={(record, index) => ({
                    onClick: () => console.log("Row clicked:", record),
                    onMouseEnter: () => console.log("Mouse enter:", record),
                    className: getRowClassName(record, index),
                })}
            />
        </div>
    );
};

export default ArticleList;
