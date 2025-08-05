import { ColumnType } from "@components/Table";
import { Article } from "../../types/IArticleList";
import styles from "@styles/pages/article-list.module.scss";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// 筛选项配置
export const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Programming", label: "Programming" },
];

export const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
];

// columns 配置（actions render 需注入 handler）
export const getArticleListColumns = (handlers: {
    onView: (record: Article) => void;
    onEdit: (record: Article) => void;
    onDelete: (record: Article) => void;
}): ColumnType<Article>[] => [
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
        render: value => <span style={{ color: value > 1000 ? "#6366f1" : "inherit" }}>{value.toLocaleString()}</span>,
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
        render: (_: unknown, record: Article) => (
            <div className={styles.actions}>
                <button onClick={() => handlers.onView(record)} title="View">
                    <FaEye />
                </button>
                <button onClick={() => handlers.onEdit(record)} title="Edit">
                    <FaEdit />
                </button>
                <button onClick={() => handlers.onDelete(record)} title="Delete">
                    <FaTrash />
                </button>
            </div>
        ),
    },
];
