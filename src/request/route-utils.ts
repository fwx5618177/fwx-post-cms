/**
 * 根据路径获取路由键
 * @param pathname 路径名
 * @returns string 路由键
 */
export const queryPathKey = (pathname: string): string => {
    // 移除开头的斜杠并分割路径
    const pathSegments = pathname.replace(/^\//, "").split("/");

    // 如果是根路径，返回默认键
    if (pathSegments.length === 0 || pathSegments[0] === "") {
        return "home";
    }

    // 返回第一个路径段作为路由键
    return pathSegments[0];
};
