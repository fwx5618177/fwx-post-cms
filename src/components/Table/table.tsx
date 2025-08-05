import React from "react";
import styles from "./table.module.scss";
import Loading from "../Loading";
import { TableProps } from "./types";
import { EmptyState, ErrorState } from "./components/EmptyState";
import { TableHeader } from "./components/TableHeader";
import { TablePagination } from "./components/TablePagination";
import { TableRow } from "./components/TableRow";
import { useTableState } from "./hooks/useTableState";

const defaultPageSizeOptions = [10, 20, 50, 100, 200];

const Table = <T extends Record<string, unknown>>({
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
    // 使用自定义hook管理状态
    const {
        sortState,
        uncontrolledExpanded,
        internalPage,
        internalPageSize,
        getFixedPosition,
        handleSort,
        handleExpand,
        handlePageChange,
        handlePageSizeChange,
    } = useTableState({
        columns,
        pagination: paginationProp,
        onChange,
    });

    // 展开状态管理
    const expandedRowKeys = controlledExpandedRowKeys ?? uncontrolledExpanded;
    const isRowExpanded = (key: string) => expandedRowKeys.includes(key);
    const handleExpandWrapper = (key: string, expanded: boolean, record: T) => {
        handleExpand(key, expanded, record, onExpand, controlledExpandedRowKeys);
    };

    const getRowKey = (record: T, index: number): string => {
        if (typeof rowKey === "function") {
            return rowKey(record);
        }
        return String(record[rowKey] ?? index);
    };

    const tableClasses = [styles.table, bordered && styles.bordered, striped && styles.striped, className]
        .filter(Boolean)
        .join(" ");

    // 分页逻辑
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
        handlePageChange(page, pageSize);
    };

    const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        handlePageSizeChange(newSize);
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
                        <ErrorState />
                    ) : (
                        <table className={tableClasses}>
                            {showHeader && (
                                <TableHeader
                                    columns={columns}
                                    sortState={sortState}
                                    onSort={handleSort}
                                    getFixedPosition={getFixedPosition}
                                    sticky={sticky}
                                />
                            )}
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={columns.length} className={styles.loadingCell}>
                                            <Loading type="wave" />
                                        </td>
                                    </tr>
                                ) : pagedData.length > 0 ? (
                                    pagedData.map((record, index) => (
                                        <TableRow
                                            key={getRowKey(record, index)}
                                            record={record}
                                            index={index}
                                            columns={columns}
                                            rowKey={rowKey}
                                            rowIndent={rowIndent}
                                            isRowExpanded={isRowExpanded}
                                            handleExpand={handleExpandWrapper}
                                            getFixedPosition={getFixedPosition}
                                            treeChildrenKey={treeChildrenKey}
                                            onRow={onRow}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length}>
                                            <EmptyState emptyText={emptyText} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {/* 分页区 */}
            {pagination !== false && !hidePagination && (
                <TablePagination
                    pagination={pagination}
                    total={total}
                    pageSize={pageSize}
                    current={current}
                    pageCount={pageCount}
                    pageSizeOptions={pageSizeOptions}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </div>
    );
};

export default Table;
