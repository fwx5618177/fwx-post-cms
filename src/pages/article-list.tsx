import React, { useState } from "react";
import styles from "@styles/pages/article-list.module.scss";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

    // Mock data
    const articles: Article[] = [
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
        // Add more mock articles as needed
    ];

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

    const handleEdit = (id: number) => {
        navigate(`/content/article/edit/${id}?mode=edit`);
    };

    const handleDelete = (id: number) => {
        console.log("Delete article:", id);
        // TODO: Implement delete functionality
    };

    const handleView = (id: number) => {
        navigate(`/content/article/edit/${id}?mode=view`);
    };

    const handleCreate = () => {
        navigate("/content/article/edit");
    };

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

            <div className={styles.articleList}>
                <div className={styles.tableHeader}>
                    <div className={styles.title}>Title</div>
                    <div className={styles.category}>Category</div>
                    <div className={styles.status}>Status</div>
                    <div className={styles.author}>Author</div>
                    <div className={styles.date}>Date</div>
                    <div className={styles.views}>Views</div>
                    <div className={styles.actions}>Actions</div>
                </div>

                {filteredArticles.map(article => (
                    <div key={article.id} className={styles.articleItem}>
                        <div className={styles.title}>{article.title}</div>
                        <div className={styles.category}>{article.category}</div>
                        <div className={`${styles.status} ${styles[article.status]}`}>{article.status}</div>
                        <div className={styles.author}>{article.author}</div>
                        <div className={styles.date}>{article.publishDate}</div>
                        <div className={styles.views}>{article.views}</div>
                        <div className={styles.actions}>
                            <button onClick={() => handleView(article.id)} title="View">
                                <FaEye />
                            </button>
                            <button onClick={() => handleEdit(article.id)} title="Edit">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(article.id)} title="Delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticleList;
