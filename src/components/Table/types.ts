/**
 * 表格列的配置接口
 * @template T - 数据源中每一行的类型
 */
export interface ColumnType<T> {
    /** 列标题 */
    title: string;
    /** 列数据在数据项中对应的路径 */
    dataIndex: keyof T;
    /** 列的唯一标识，如果没有指定，则使用 dataIndex */
    key?: string;
    /** 列宽度，可以是数字或字符串，如：120 或 '120px' 或 '20%' */
    width?: number | string;
    /** 设置列的对齐方式 */
    align?: "left" | "center" | "right";
    /**
     * 生成复杂数据的渲染函数，用于自定义单元格内容
     * @param value - 当前单元格的值
     * @param record - 当前行的完整数据
     * @param index - 当前行的索引
     * @returns 返回需要渲染的React节点
     * @example
     * ```tsx
     * render: (value, record) => (
     *   <Tooltip title={record.description}>
     *     <span className="ellipsis">{value}</span>
     *   </Tooltip>
     * )
     * ```
     */
    render?: (value: any, record: T, index: number) => React.ReactNode;
    /** 是否可排序 */
    sortable?: boolean;
    /** 支持的排序方式，默认同时支持升序和降序 */
    sortDirections?: Array<"ascend" | "descend">;
    /**
     * 列是否固定，可选 true(等效于 left) 'left' 'right'
     * @description
     * - true/'left': 固定在左侧
     * - 'right': 固定在右侧
     * - 设置后，列会固定在表格两侧，不随横向滚动条滚动
     * @example
     * ```tsx
     * fixed: 'left' // 固定在左侧
     * fixed: 'right' // 固定在右侧
     * ```
     */
    fixed?: boolean | "left" | "right";
    /**
     * 设置单元格的 className
     * @description 可以是字符串或根据数据返回字符串的函数
     */
    className?: string | ((value: any, record: T, index: number) => string);
    /**
     * 设置单元格的样式
     * @description 可以是样式对象或根据数据返回样式对象的函数
     */
    style?: React.CSSProperties | ((value: any, record: T, index: number) => React.CSSProperties);
}

/**
 * 表格组件的属性接口
 * @template T - 数据源中每一行的类型
 */
export interface TableProps<T> {
    /** 表格列的配置描述 */
    columns: ColumnType<T>[];
    /** 数据数组 */
    dataSource: T[];
    /**
     * 表格行 key 的取值，可以是字符串或一个函数
     * @default 'id'
     */
    rowKey?: keyof T | ((record: T) => string);
    /** 页面是否加载中 */
    loading?: boolean;
    /** 是否展示外边框和列边框 */
    bordered?: boolean;
    /** 是否显示间隔色 */
    striped?: boolean;
    /** 是否显示表头 */
    showHeader?: boolean;
    /** 空数据时显示的内容 */
    emptyText?: React.ReactNode;
    /** 表格的 className */
    className?: string;
    /** 表格的 style */
    style?: React.CSSProperties;
    /**
     * 设置行属性
     * @param record - 当前行的数据
     * @param index - 当前行的索引
     */
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    /**
     * 分页、排序、筛选变化时触发
     * @param pagination - 分页信息
     * @param filters - 筛选信息
     * @param sorter - 排序信息
     */
    onChange?: (pagination: any, filters: Record<string, any>, sorter: SortState<T>) => void;
    /**
     * 是否固定表头
     * @description
     * - 设置为 true 时，表头会固定在顶部，不随纵向滚动条滚动
     * - 需要同时设置 scroll.y 才能生效
     */
    sticky?: boolean;
    /**
     * 表格是否可滚动，也可以指定滚动区域的宽、高
     * @description
     * - x: 设置横向滚动，也可以设置为 true 或具体像素
     * - y: 设置纵向滚动，也可以设置为具体像素
     * @example
     * ```tsx
     * scroll={{ x: 1500, y: 300 }}
     * ```
     */
    scroll?: {
        x?: number | true;
        y?: number;
    };
    /**
     * Tree table support
     * @param treeChildrenKey children field name, default 'children'
     * @param rowIndent indent px per level, default 24
     * @param expandedRowKeys expanded row keys (controlled)
     * @param onExpand (expandedKeys, expanded, record) => void
     */
    treeChildrenKey?: string;
    rowIndent?: number;
    expandedRowKeys?: string[];
    onExpand?: (expandedKeys: string[], expanded: boolean, record: T) => void;
    /**
     * 分页配置
     */
    pagination?: PaginationConfig | false;
    /** 新增：错误态支持 */
    isError?: boolean;
}

/**
 * 排序状态接口
 * @template T - 数据源中每一行的类型
 */
export interface SortState<T> {
    /** 排序的字段 */
    field: keyof T;
    /** 排序的方向 */
    order: "ascend" | "descend" | undefined;
}

/**
 * 分页配置
 */
export interface PaginationConfig {
    /** 当前页码（从1开始） */
    current?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 总记录数 */
    total?: number;
    /** 可选的每页条数 */
    pageSizeOptions?: number[];
    /** 页码改变时回调 (page, pageSize) */
    onChange?: (page: number, pageSize: number) => void;
    /** 每页条数改变时回调 (page, pageSize) */
    onPageSizeChange?: (page: number, pageSize: number) => void;
    /** 是否隐藏分页 */
    hideOnSinglePage?: boolean;
}
