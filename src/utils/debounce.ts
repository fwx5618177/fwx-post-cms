/**
 * 防抖函数配置选项
 */
export interface DebounceOptions {
    leading?: boolean; // 是否在延迟开始前调用
    trailing?: boolean; // 是否在延迟结束后调用
    maxWait?: number; // 最大等待时间
}

/**
 * 防抖函数类型定义
 */
export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
};

/**
 * 增强的防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 防抖后的函数及控制方法
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
    options: DebounceOptions = {},
): DebouncedFunction<T> {
    const { leading = false, trailing = true, maxWait } = options;

    let lastCallTime: number | undefined;
    let lastInvokeTime = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | undefined;
    let result: ReturnType<T>;

    function invokeFunc(time: number): ReturnType<T> {
        const args = lastArgs!;
        lastArgs = undefined;
        lastInvokeTime = time;
        result = func(...args) as ReturnType<T>;
        return result;
    }

    function shouldInvoke(time: number): boolean {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
        );
    }

    function timerExpired(): void {
        const time = Date.now();
        if (shouldInvoke(time)) {
            if (trailing && lastArgs) {
                invokeFunc(time);
            }
            timerId = null;
            lastArgs = undefined;
        } else {
            const remaining = wait - (time - (lastCallTime || 0));
            timerId = setTimeout(timerExpired, remaining);
        }
    }

    const debounced = function (...args: Parameters<T>): void {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === null) {
                lastInvokeTime = time;
                timerId = setTimeout(timerExpired, wait);
                if (leading) {
                    result = func(...args) as ReturnType<T>;
                }
                return;
            }
            if (maxWait !== undefined) {
                timerId = setTimeout(timerExpired, wait);
                invokeFunc(lastCallTime);
                return;
            }
        }
        if (timerId === null) {
            timerId = setTimeout(timerExpired, wait);
        }
    } as DebouncedFunction<T>;

    debounced.cancel = function (): void {
        if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
        }
        lastInvokeTime = 0;
        lastArgs = undefined;
        lastCallTime = undefined;
    };

    debounced.flush = function (): ReturnType<T> {
        if (timerId !== null && lastArgs) {
            clearTimeout(timerId);
            const result = func(...lastArgs) as ReturnType<T>;
            timerId = null;
            lastArgs = undefined;
            lastCallTime = undefined;
            return result;
        }
        return result;
    };

    debounced.pending = function (): boolean {
        return timerId !== null;
    };

    return debounced;
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
    options: { leading?: boolean; trailing?: boolean } = {},
): DebouncedFunction<T> {
    const { leading = true, trailing = true } = options;
    return debounce(func, wait, {
        leading,
        trailing,
        maxWait: wait,
    });
}
