import React from "react";
import styles from "./table.module.scss";
import { FaSort, FaSortUp, FaSortDown, FaExclamationTriangle, FaInbox } from "react-icons/fa";
import Loading from "../Loading";
import { ColumnType, TableProps, SortState } from "./types";

const EmptyIcon = () => <FaInbox className={styles.emptyIcon} size={64} />;

const defaultPageSizeOptions = [10, 20, 50, 100, 200];

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

const Table = <T extends Record<string, any>>({
    columns,
    dataSource,
    rowKey = "id",
    loading = false,
    bordered = false,
    striped = true,
    showHeader = true,
    emptyText = "No Data",
    className = "",
    style,
    onRow,
    onChange,
    sticky = false,
    scroll,
    treeChildrenKey = "children",
    rowIndent = 24,
    expandedRowKeys: controlledExpandedRowKeys,
    onExpand,
    pagination: paginationProp = false,
    isError = false,
}: TableProps<T>) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState<string[]>([]);
    const expandedRowKeys = controlledExpandedRowKeys ?? uncontrolledExpanded;
    const isRowExpanded = (key: string) => expandedRowKeys.includes(key);
    const handleExpand = (key: string, expanded: boolean, record: T) => {
        let next: string[];
        if (expanded) {
            next = expandedRowKeys.concat(key);
        } else {
            next = expandedRowKeys.filter(k => k !== key);
        }
        if (onExpand) onExpand(next, expanded, record);
        if (!controlledExpandedRowKeys) setUncontrolledExpanded(next);
    };

    const [sortState, setSortState] = React.useState<SortState<T>>({
        field: "" as keyof T,
        order: undefined,
    });

    // Calculate fixed columns positions
    const getFixedPosition = React.useCallback(
        (columnIndex: number, fixed: "left" | "right" | boolean | undefined) => {
            if (!fixed) return undefined;

            let position = 0;
            if (fixed === "left") {
                for (let i = 0; i < columnIndex; i++) {
                    if (columns[i].fixed === "left" || columns[i].fixed === true) {
                        position += Number(columns[i].width?.toString().replace(/px$/, "") || 0);
                    }
                }
                return `${position}px`;
            }

            if (fixed === "right") {
                for (let i = columns.length - 1; i > columnIndex; i--) {
                    if (columns[i].fixed === "right") {
                        position += Number(columns[i].width?.toString().replace(/px$/, "") || 0);
                    }
                }
                return `${position}px`;
            }

            return undefined;
        },
        [columns],
    );

    const handleSort = (column: ColumnType<T>) => {
        if (!column.sortable) return;

        const newOrder =
            sortState.field === column.dataIndex
                ? sortState.order === "ascend"
                    ? "descend"
                    : sortState.order === "descend"
                    ? undefined
                    : "ascend"
                : "ascend";

        const newSortState: SortState<T> = {
            field: column.dataIndex,
            order: newOrder,
        };

        setSortState(newSortState);
        onChange?.(null, {}, newSortState);
    };

    const renderSortIcon = (column: ColumnType<T>) => {
        if (!column.sortable) return null;

        if (sortState.field === column.dataIndex) {
            return sortState.order === "ascend" ? (
                <FaSortUp className={styles.sortIcon} />
            ) : sortState.order === "descend" ? (
                <FaSortDown className={styles.sortIcon} />
            ) : (
                <FaSort className={styles.sortIcon} />
            );
        }

        return <FaSort className={styles.sortIcon} />;
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <div className={styles.empty}>
                <EmptyIcon />
                <div className={styles.emptyText}>{typeof emptyText === "string" ? emptyText : emptyText}</div>
            </div>
        );
    };

    const getRowKey = (record: T, index: number): string => {
        if (typeof rowKey === "function") {
            return rowKey(record);
        }
        return String(record[rowKey] ?? index);
    };

    const renderCell = (column: ColumnType<T>, record: T, index: number) => {
        const value = record[column.dataIndex];
        const cellStyle = typeof column.style === "function" ? column.style(value, record, index) : column.style;
        const cellClassName =
            typeof column.className === "function" ? column.className(value, record, index) : column.className;

        if (column.render) {
            return (
                <div
                    style={{
                        textAlign: column.align || "left",
                        ...cellStyle,
                    }}
                    className={cellClassName}
                >
                    {column.render(value, record, index)}
                </div>
            );
        }
        return value;
    };

    const tableClasses = [styles.table, bordered && styles.bordered, striped && styles.striped, className]
        .filter(Boolean)
        .join(" ");

    // 渲染树形行
    const renderRows = (rows: T[], level = 0): React.ReactElement[] => {
        return rows.reduce<React.ReactElement[]>((acc, record, idx) => {
            const key = typeof rowKey === "function" ? rowKey(record) : String(record[rowKey] ?? idx);
            const children = (record[treeChildrenKey] ?? []) as T[];
            const expanded = isRowExpanded(key);
            const hasChildren = Array.isArray(children) && children.length > 0;
            const rowProps = onRow?.(record, idx) || {};
            const rowNodes: React.ReactElement[] = [
                <tr
                    key={key}
                    {...rowProps}
                    className={[
                        rowProps.className || "",
                        hasChildren ? styles.treeParentRow : styles.treeRow,
                        level > 0 ? styles.treeChildRow : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {columns.map((column, colIdx) => {
                        const fixed = column.fixed === true ? "left" : column.fixed;
                        const fixedPosition = getFixedPosition(colIdx, fixed);
                        let cellContent = renderCell(column, record, idx);
                        // only first column: add expand/collapse icon and indent
                        if (colIdx === 0) {
                            cellContent = (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ display: "inline-block", width: level * rowIndent }} />
                                    {hasChildren && (
                                        <span
                                            className={styles.treeExpandIcon}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleExpand(key, !expanded, record);
                                            }}
                                            style={{ cursor: "pointer", marginRight: 4 }}
                                        >
                                            {expanded ? (
                                                <svg width="12" height="12" viewBox="0 0 12 12">
                                                    <polyline
                                                        points="2,4 6,8 10,4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg width="12" height="12" viewBox="0 0 12 12">
                                                    <polyline
                                                        points="2,8 6,4 10,8"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                    )}
                                    {cellContent}
                                </div>
                            );
                        }
                        return (
                            <td
                                key={column.key || String(column.dataIndex) || colIdx}
                                style={{
                                    width: column.width,
                                    minWidth: column.width,
                                    left: fixed === "left" ? fixedPosition : undefined,
                                    right: fixed === "right" ? fixedPosition : undefined,
                                }}
                                data-align={column.align}
                                data-fixed={fixed}
                            >
                                {cellContent}
                            </td>
                        );
                    })}
                </tr>,
            ];
            if (hasChildren && expanded) {
                rowNodes.push(...renderRows(children, level + 1));
            }
            return acc.concat(rowNodes);
        }, []);
    };

    // 分页逻辑
    const [internalPage, setInternalPage] = React.useState(1);
    const [internalPageSize, setInternalPageSize] = React.useState(10);
    const pagination = paginationProp === false ? false : paginationProp || {};
    const pageSizeOptions =
        pagination !== false && pagination.pageSizeOptions ? pagination.pageSizeOptions : defaultPageSizeOptions;
    const total = pagination !== false && typeof pagination.total === "number" ? pagination.total : dataSource.length;
    const pageSize =
        pagination !== false && typeof pagination.pageSize === "number" ? pagination.pageSize : internalPageSize;
    const current = pagination !== false && typeof pagination.current === "number" ? pagination.current : internalPage;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const hidePagination = pagination !== false && pagination.hideOnSinglePage && pageCount <= 1;
    const onPageChange = (page: number) => {
        if (pagination !== false && pagination.onChange) pagination.onChange(page, pageSize);
        if (paginationProp === undefined) setInternalPage(page);
    };
    const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        if (pagination !== false && pagination.onPageSizeChange) pagination.onPageSizeChange(1, newSize);
        if (pagination !== false && pagination.onChange) pagination.onChange(1, newSize);
        if (paginationProp === undefined) {
            setInternalPage(1);
            setInternalPageSize(newSize);
        }
    };
    // 当前页数据
    const pagedData =
        pagination === false ? dataSource : dataSource.slice((current - 1) * pageSize, current * pageSize);

    return (
        <div className={styles.tableWrapper} style={style}>
            <div
                className={styles.scrollContainer}
                data-has-scroll={!!scroll?.y}
                style={
                    scroll?.y
                        ? ({
                              "--table-height": typeof scroll.y === "number" ? `${scroll.y}px` : scroll.y,
                          } as React.CSSProperties)
                        : undefined
                }
            >
                <div className={styles.innerContainer}>
                    {isError ? (
                        <div className={styles.errorState}>
                            <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: 12 }} />
                            <div className={styles.errorText}>加载失败，请重试</div>
                        </div>
                    ) : (
                        <table className={tableClasses}>
                            {showHeader && (
                                <thead data-sticky={sticky}>
                                    <tr>
                                        {columns.map((column, index) => {
                                            const fixed = column.fixed === true ? "left" : column.fixed;
                                            const fixedPosition = getFixedPosition(index, fixed);
                                            return (
                                                <th
                                                    key={column.key || String(column.dataIndex) || index}
                                                    style={{
                                                        width: column.width,
                                                        minWidth: column.width,
                                                        left: fixed === "left" ? fixedPosition : undefined,
                                                        right: fixed === "right" ? fixedPosition : undefined,
                                                    }}
                                                    className={column.sortable ? styles.sortable : ""}
                                                    onClick={() => handleSort(column)}
                                                    data-align={column.align}
                                                    data-fixed={fixed}
                                                >
                                                    <div className={styles.headerCell}>
                                                        {column.title}
                                                        {renderSortIcon(column)}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={columns.length} className={styles.loadingCell}>
                                            <Loading type="wave" />
                                        </td>
                                    </tr>
                                ) : pagedData.length > 0 ? (
                                    renderRows(pagedData)
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length}>{renderEmpty()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {/* 分页区 */}
            {pagination !== false && !hidePagination && (
                <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>
                        共 <b>{total}</b> 条
                    </div>
                    <div className={styles.paginationControls}>
                        <button
                            className={styles.pageBtn}
                            disabled={current === 1}
                            onClick={() => onPageChange(current - 1)}
                        >
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
                            // 只渲染数字页码，且active只给当前页
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
            )}
        </div>
    );
};

export default Table;
