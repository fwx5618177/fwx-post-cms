import React from "react";
import styles from "./table.module.scss";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Loading from "../Loading";
import { ColumnType, TableProps, SortState } from "./types";

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
}: TableProps<T>) => {
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
                {typeof emptyText === "string" ? <div className={styles.emptyText}>{emptyText}</div> : emptyText}
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

    return (
        <div className={styles.tableWrapper} style={style}>
            {loading && (
                <div className={styles.loadingMask}>
                    <Loading />
                </div>
            )}
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
                    <table
                        className={tableClasses}
                        style={{
                            width:
                                typeof scroll?.x === "number"
                                    ? `${scroll.x}px`
                                    : typeof scroll?.x === "string"
                                    ? scroll.x
                                    : "100%",
                            minWidth: "800px",
                        }}
                    >
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
                            {dataSource.length > 0 ? (
                                dataSource.map((record, index) => (
                                    <tr key={getRowKey(record, index)} {...(onRow?.(record, index) || {})}>
                                        {columns.map((column, columnIndex) => {
                                            const fixed = column.fixed === true ? "left" : column.fixed;
                                            const fixedPosition = getFixedPosition(columnIndex, fixed);
                                            return (
                                                <td
                                                    key={column.key || String(column.dataIndex) || columnIndex}
                                                    style={{
                                                        width: column.width,
                                                        minWidth: column.width,
                                                        left: fixed === "left" ? fixedPosition : undefined,
                                                        right: fixed === "right" ? fixedPosition : undefined,
                                                    }}
                                                    data-align={column.align}
                                                    data-fixed={fixed}
                                                >
                                                    {renderCell(column, record, index)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length}>{renderEmpty()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
