/**
 * 路由接口
 */
export interface RoutesI {
    key: string
    label: string | JSX.Element
    icon: string | JSX.Element
    components: React.LazyExoticComponent<() => JSX.Element>
}
