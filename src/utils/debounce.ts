/**
 * 防抖函数类型定义
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): void;
    cancel: () => void;
};

/**
 * 创建防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): DebouncedFunction<T> {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (...args: Parameters<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, wait);
    } as DebouncedFunction<T>;

    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}
