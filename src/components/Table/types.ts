export interface ColumnType<T> {
    title: string;
    dataIndex: keyof T;
    key?: string;
    width?: number | string;
    align?: "left" | "center" | "right";
    render?: (value: any, record: T, index: number) => React.ReactNode;
    sortable?: boolean;
    sortDirections?: Array<"ascend" | "descend">;
}

export interface TableProps<T> {
    columns: ColumnType<T>[];
    dataSource: T[];
    rowKey?: keyof T | ((record: T) => string);
    loading?: boolean;
    bordered?: boolean;
    striped?: boolean;
    showHeader?: boolean;
    emptyText?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    onChange?: (pagination: any, filters: Record<string, any>, sorter: SortState<T>) => void;
}

export interface SortState<T> {
    field: keyof T;
    order: "ascend" | "descend" | undefined;
}
