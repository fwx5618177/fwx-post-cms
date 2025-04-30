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
}

const ArticleList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);

    // Fetch articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
                setArticles([
                    {
                        id: 1,
                        title: "Getting Started with React",
                        category: "Frontend",
                        status: "published",
                        author: "John Doe",
                        publishDate: "2024-03-15",
                        views: 1234,
                    },
                    {
                        id: 2,
                        title: "Advanced TypeScript Tips",
                        category: "Programming",
                        status: "draft",
                        author: "Jane Smith",
                        publishDate: "2024-03-14",
                        views: 856,
                    },
                    {
                        id: 3,
                        title: "Node.js Best Practices",
                        category: "Backend",
                        status: "published",
                        author: "Mike Johnson",
                        publishDate: "2024-03-13",
                        views: 2341,
                    },
                ]);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

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
        // TODO: Implement sorting logic
    };

    const columns: ColumnType<Article>[] = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sortable: true,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            sortable: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (value: Article["status"]) => <span className={`${styles.status} ${styles[value]}`}>{value}</span>,
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
        },
        {
            title: "Date",
            dataIndex: "publishDate",
            key: "publishDate",
            sortable: true,
        },
        {
            title: "Views",
            dataIndex: "views",
            key: "views",
            align: "right",
            sortable: true,
        },
        {
            title: "Actions",
            dataIndex: "id",
            key: "actions",
            width: 150,
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
                bordered
                striped
                rowKey="id"
                onChange={handleTableChange}
            />
        </div>
    );
};

export default ArticleList;
