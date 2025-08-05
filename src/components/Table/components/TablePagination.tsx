import React from "react";
import { PaginationConfig } from "../types";
import styles from "../table.module.scss";

interface TablePaginationProps {
    pagination: PaginationConfig;
    total: number;
    pageSize: number;
    current: number;
    pageCount: number;
    pageSizeOptions: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function getPaginationRange(current: number, pageCount: number) {
    current = Number(current);
    pageCount = Number(pageCount);
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const range: (number | string)[] = [];
    if (current <= 4) {
        range.push(1, 2, 3, 4, 5, "...", pageCount);
    } else if (current >= pageCount - 3) {
        range.push(1, "...", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount);
    } else {
        range.push(1, "...", current - 1, current, current + 1, "...", pageCount);
    }
    return range;
}

export function TablePagination({
    total,
    pageSize,
    current,
    pageCount,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) {
    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
                共 <b>{total}</b> 条
            </div>
            <div className={styles.paginationControls}>
                <button className={styles.pageBtn} disabled={current === 1} onClick={() => onPageChange(current - 1)}>
                    &lt;
                </button>
                {getPaginationRange(current, pageCount).map((p, i) => {
                    if (p === "...") {
                        return (
                            <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={`page-${p}`}
                            className={styles.pageBtn + (p === current ? " " + styles.active : "")}
                            onClick={() => typeof p === "number" && onPageChange(p)}
                            disabled={p === current}
                        >
                            {p}
                        </button>
                    );
                })}
                <button
                    className={styles.pageBtn}
                    disabled={current === pageCount}
                    onClick={() => onPageChange(current + 1)}
                >
                    &gt;
                </button>
                <select className={styles.pageSizeSelect} value={pageSize} onChange={onPageSizeChange}>
                    {pageSizeOptions.map(opt => (
                        <option key={opt} value={opt}>
                            {opt}条/页
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
