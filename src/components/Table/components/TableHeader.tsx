import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { ColumnType, SortState } from "../types";
import styles from "../table.module.scss";

interface TableHeaderProps<T> {
    columns: ColumnType<T>[];
    sortState: SortState<T>;
    onSort: (column: ColumnType<T>) => void;
    getFixedPosition: (columnIndex: number, fixed: "left" | "right" | boolean | undefined) => string | undefined;
    sticky: boolean;
}

export function TableHeader<T>({ columns, sortState, onSort, getFixedPosition, sticky }: TableHeaderProps<T>) {
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

    return (
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
                            onClick={() => onSort(column)}
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
    );
}
