import { useState, useCallback } from "react";
import { ColumnType, SortState, PaginationConfig } from "../types";

interface UseTableStateProps<T> {
    columns: ColumnType<T>[];
    pagination?: PaginationConfig | false;
    onChange?: (pagination: PaginationConfig | null, filters: Record<string, unknown>, sorter: SortState<T>) => void;
}

export function useTableState<T>({ columns, pagination: paginationProp, onChange }: UseTableStateProps<T>) {
    // 排序状态
    const [sortState, setSortState] = useState<SortState<T>>({
        field: "" as keyof T,
        order: undefined,
    });

    // 展开状态
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>([]);

    // 分页状态
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(10);

    // 固定列位置计算
    const getFixedPosition = useCallback(
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

    // 排序处理
    const handleSort = useCallback(
        (column: ColumnType<T>) => {
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
        },
        [sortState, onChange],
    );

    // 展开/折叠处理
    const handleExpand = useCallback(
        (
            key: string,
            expanded: boolean,
            record: T,
            onExpand?: (expandedKeys: string[], expanded: boolean, record: T) => void,
            controlledExpandedRowKeys?: string[],
        ) => {
            const expandedRowKeys = controlledExpandedRowKeys ?? uncontrolledExpanded;
            let next: string[];
            if (expanded) {
                next = expandedRowKeys.concat(key);
            } else {
                next = expandedRowKeys.filter(k => k !== key);
            }
            if (onExpand) onExpand(next, expanded, record);
            if (!controlledExpandedRowKeys) setUncontrolledExpanded(next);
        },
        [uncontrolledExpanded],
    );

    // 分页处理
    const handlePageChange = useCallback(
        (page: number, pageSize: number) => {
            const pagination = paginationProp === false ? false : paginationProp || {};
            if (pagination !== false && pagination.onChange) pagination.onChange(page, pageSize);
            if (paginationProp === undefined) setInternalPage(page);
        },
        [paginationProp],
    );

    const handlePageSizeChange = useCallback(
        (newSize: number) => {
            const pagination = paginationProp === false ? false : paginationProp || {};
            if (pagination !== false && pagination.onPageSizeChange) pagination.onPageSizeChange(1, newSize);
            if (pagination !== false && pagination.onChange) pagination.onChange(1, newSize);
            if (paginationProp === undefined) {
                setInternalPage(1);
                setInternalPageSize(newSize);
            }
        },
        [paginationProp],
    );

    return {
        sortState,
        uncontrolledExpanded,
        internalPage,
        internalPageSize,
        getFixedPosition,
        handleSort,
        handleExpand,
        handlePageChange,
        handlePageSizeChange,
    };
}
