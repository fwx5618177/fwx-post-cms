import React from "react";
import { ColumnType } from "../types";
import styles from "../table.module.scss";

interface TableRowProps<T> {
    record: T;
    index: number;
    columns: ColumnType<T>[];
    rowKey: string | ((record: T) => string);
    level?: number;
    rowIndent: number;
    isRowExpanded: (key: string) => boolean;
    handleExpand: (key: string, expanded: boolean, record: T) => void;
    getFixedPosition: (columnIndex: number, fixed: "left" | "right" | boolean | undefined) => string | undefined;
    treeChildrenKey: string;
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLElement>;
}

export function TableRow<T extends Record<string, unknown>>({
    record,
    index,
    columns,
    rowKey,
    level = 0,
    rowIndent,
    isRowExpanded,
    handleExpand,
    getFixedPosition,
    treeChildrenKey,
    onRow,
}: TableRowProps<T>) {
    const key = typeof rowKey === "function" ? rowKey(record) : String(record[rowKey] ?? index);
    const children = (record[treeChildrenKey] ?? []) as T[];
    const expanded = isRowExpanded(key);
    const hasChildren = Array.isArray(children) && children.length > 0;
    const rowProps = onRow?.(record, index) || {};

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

    const renderRows = (rows: T[], currentLevel = 0): React.ReactElement[] => {
        return rows.reduce<React.ReactElement[]>((acc, row, idx) => {
            const rowKey = typeof rowKey === "function" ? rowKey(row) : String(row[rowKey] ?? idx);
            const rowChildren = (row[treeChildrenKey] ?? []) as T[];
            const rowExpanded = isRowExpanded(rowKey);
            const rowHasChildren = Array.isArray(rowChildren) && rowChildren.length > 0;
            const rowProps = onRow?.(row, idx) || {};

            const rowNodes: React.ReactElement[] = [
                <tr
                    key={rowKey}
                    {...rowProps}
                    className={[
                        rowProps.className || "",
                        rowHasChildren ? styles.treeParentRow : styles.treeRow,
                        currentLevel > 0 ? styles.treeChildRow : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {columns.map((column, colIdx) => {
                        const fixed = column.fixed === true ? "left" : column.fixed;
                        const fixedPosition = getFixedPosition(colIdx, fixed);
                        let cellContent = renderCell(column, row, idx);

                        // 只在第一列添加展开/折叠图标和缩进
                        if (colIdx === 0) {
                            cellContent = (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ display: "inline-block", width: currentLevel * rowIndent }} />
                                    {rowHasChildren && (
                                        <span
                                            className={styles.treeExpandIcon}
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleExpand(rowKey, !rowExpanded, row);
                                            }}
                                            style={{ cursor: "pointer", marginRight: 4 }}
                                        >
                                            {rowExpanded ? (
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

            if (rowHasChildren && rowExpanded) {
                rowNodes.push(...renderRows(rowChildren, currentLevel + 1));
            }
            return acc.concat(rowNodes);
        }, []);
    };

    return <>{renderRows([record], level)}</>;
}
