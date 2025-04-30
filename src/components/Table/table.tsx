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
}: TableProps<T>) => {
    const [sortState, setSortState] = React.useState<SortState<T>>({
        field: "" as keyof T,
        order: undefined,
    });

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
            <table className={tableClasses}>
                {showHeader && (
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || String(column.dataIndex) || index}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || "left",
                                    }}
                                    className={column.sortable ? styles.sortable : ""}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className={styles.headerCell}>
                                        {column.title}
                                        {renderSortIcon(column)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {dataSource.length > 0 ? (
                        dataSource.map((record, index) => (
                            <tr key={getRowKey(record, index)} {...(onRow?.(record, index) || {})}>
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={column.key || String(column.dataIndex) || columnIndex}
                                        style={{ textAlign: column.align || "left" }}
                                    >
                                        {column.render
                                            ? column.render(record[column.dataIndex], record, index)
                                            : record[column.dataIndex]}
                                    </td>
                                ))}
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
    );
};

export default Table;
