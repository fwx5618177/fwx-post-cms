import { useState, useCallback, useRef } from "react";
import { message } from "antd";

// 加载状态类型
export interface LoadingState {
    [key: string]: boolean;
}

// 加载配置
export interface LoadingConfig {
    showMessage?: boolean;
    messageContent?: string;
    delay?: number;
    timeout?: number;
}

/**
 * 加载状态管理Hook
 * 支持多个加载状态的并发管理
 */
export const useLoading = (initialState: LoadingState = {}) => {
    const [loadingStates, setLoadingStates] = useState<LoadingState>(initialState);
    const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // 设置加载状态
    const setLoading = useCallback((key: string, loading: boolean, config?: LoadingConfig) => {
        const { showMessage = false, messageContent, delay = 0, timeout } = config || {};

        // 清除之前的定时器
        const existingTimeout = timeoutRefs.current.get(key);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            timeoutRefs.current.delete(key);
        }

        const updateState = () => {
            setLoadingStates(prev => ({
                ...prev,
                [key]: loading,
            }));

            // 显示消息
            if (showMessage && loading && messageContent) {
                message.loading({
                    content: messageContent,
                    key: `loading-${key}`,
                    duration: 0,
                });
            } else if (showMessage && !loading) {
                message.destroy(`loading-${key}`);
            }
        };

        if (delay > 0 && loading) {
            // 延迟显示加载状态
            const timeoutId = setTimeout(updateState, delay);
            timeoutRefs.current.set(key, timeoutId);
        } else {
            updateState();
        }

        // 设置超时
        if (timeout && loading) {
            const timeoutId = setTimeout(() => {
                setLoadingStates(prev => ({
                    ...prev,
                    [key]: false,
                }));
                message.destroy(`loading-${key}`);
                message.warning("操作超时，请重试");
            }, timeout);
            timeoutRefs.current.set(`${key}-timeout`, timeoutId);
        }
    }, []);

    // 获取特定键的加载状态
    const isLoading = useCallback(
        (key: string): boolean => {
            return loadingStates[key] || false;
        },
        [loadingStates],
    );

    // 检查是否有任何加载状态
    const hasAnyLoading = useCallback((): boolean => {
        return Object.values(loadingStates).some(Boolean);
    }, [loadingStates]);

    // 清除所有加载状态
    const clearAllLoading = useCallback(() => {
        // 清除所有定时器
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current.clear();

        // 清除所有消息
        Object.keys(loadingStates).forEach(key => {
            message.destroy(`loading-${key}`);
        });

        setLoadingStates({});
    }, [loadingStates]);

    // 包装异步函数，自动管理加载状态
    const withLoading = useCallback(
        <T extends (...args: unknown[]) => Promise<unknown>>(key: string, fn: T, config?: LoadingConfig): T => {
            return (async (...args: Parameters<T>) => {
                setLoading(key, true, config);
                try {
                    const result = await fn(...args);
                    return result;
                } finally {
                    setLoading(key, false);
                }
            }) as T;
        },
        [setLoading],
    );

    return {
        loadingStates,
        setLoading,
        isLoading,
        hasAnyLoading,
        clearAllLoading,
        withLoading,
    };
};
