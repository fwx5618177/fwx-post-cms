import React, { useState } from "react";
import styles from "@styles/pages/article-list.module.scss";
import { FaSearch, FaFilter } from "react-icons/fa";
import Table, { SortState } from "../components/Table";
import { Article } from "../types/IArticleList";
import { getArticleListColumns, categoryOptions, statusOptions } from "@settings/article-list/config";
import {
    fetchArticlesService,
    deleteArticleService,
    navigateToEdit,
    navigateToView,
    navigateToCreate,
    FetchParams,
} from "../services/article-list";
import { useQuery, useMutation } from "@tanstack/react-query";

const ArticleList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 查询参数
    const queryParams: FetchParams = {
        page,
        pageSize,
        searchTerm,
        category: selectedCategory,
        status: selectedStatus,
    };

    // 获取文章列表
    const { data, isLoading, isError, refetch } = useQuery<{ data: Article[]; total: number }, Error>({
        queryKey: ["article-list", queryParams],
        queryFn: () => fetchArticlesService(queryParams),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 删除文章
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteArticleService(id),
        onSuccess: () => {
            refetch();
        },
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setPage(1);
    };

    const handleEdit = (record: Article) => {
        navigateToEdit(record.id);
    };

    const handleDelete = async (record: Article) => {
        deleteMutation.mutate(record.id);
    };

    const handleView = (record: Article) => {
        navigateToView(record.id);
    };

    const handleCreate = () => {
        navigateToCreate();
    };

    const handleTableChange = (_pagination: null, _filters: Record<string, unknown>, _sorter: SortState<Article>) => {
        // 可扩展排序逻辑
    };

    const getRowClassName = (record: Article) => {
        const classes = [];
        if (record.priority > 8) classes.push(styles.highPriority);
        if (record.status === "archived") classes.push(styles.archivedRow);
        return classes.join(" ");
    };

    return (
        <div className={styles.articleListPage}>
            <div className={styles.header}>
                <h1>Articles</h1>
                <button className={styles.createButton} onClick={handleCreate}>
                    Create New Article
                </button>
            </div>

            {isError && (
                <div style={{ color: "red", marginBottom: 16 }}>
                    加载失败 <button onClick={() => refetch()}>重试</button>
                </div>
            )}

            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <FaSearch />
                    <input type="text" placeholder="Search articles..." value={searchTerm} onChange={handleSearch} />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterItem}>
                        <FaFilter />
                        <select value={selectedCategory} onChange={handleCategoryChange}>
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <FaFilter />
                        <select value={selectedStatus} onChange={handleStatusChange}>
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <Table<Article>
                columns={getArticleListColumns({
                    onView: handleView,
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                })}
                dataSource={data?.data ?? []}
                loading={isLoading || deleteMutation.isPending}
                isError={isError}
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
                    total: data?.total ?? 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                    onPageSizeChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onRow={record => ({
                    onClick: () => {},
                    onMouseEnter: () => {},
                    className: getRowClassName(record),
                })}
            />
        </div>
    );
};

export default ArticleList;
