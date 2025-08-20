// 轻量错误提示方案：使用 console 代替 antd message，避免 UI 依赖

// 错误类型枚举
export enum ErrorType {
    NETWORK = "NETWORK",
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION",
    SERVER = "SERVER",
    CLIENT = "CLIENT",
    UNKNOWN = "UNKNOWN",
}

// 错误接口
export interface AppError {
    type: ErrorType;
    message: string;
    code?: string | number;
    details?: Record<string, unknown>;
    timestamp: Date;
}

// 错误信息映射
const ERROR_MESSAGES: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: "网络连接错误，请检查网络设置",
    [ErrorType.VALIDATION]: "输入数据格式不正确",
    [ErrorType.AUTHENTICATION]: "身份验证失败，请重新登录",
    [ErrorType.AUTHORIZATION]: "权限不足，无法执行此操作",
    [ErrorType.SERVER]: "服务器内部错误，请稍后重试",
    [ErrorType.CLIENT]: "客户端错误",
    [ErrorType.UNKNOWN]: "未知错误，请联系技术支持",
};

// 创建应用错误
export const createAppError = (
    type: ErrorType,
    message?: string,
    code?: string | number,
    details?: Record<string, unknown>,
): AppError => ({
    type,
    message: message || ERROR_MESSAGES[type],
    code,
    details,
    timestamp: new Date(),
});

// 错误处理器类
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLog: AppError[] = [];

    private constructor() {}

    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    // 处理错误
    public handleError(error: Error | AppError | unknown, showMessage = true): AppError {
        let appError: AppError;

        if (error instanceof Error) {
            appError = this.parseError(error);
        } else if (this.isAppError(error)) {
            appError = error;
        } else {
            appError = createAppError(ErrorType.UNKNOWN, String(error));
        }

        // 记录错误
        this.logError(appError);

        // 显示用户友好的错误消息
        if (showMessage) this.showErrorMessage(appError);

        return appError;
    }

    // 解析标准错误
    private parseError(error: Error): AppError {
        const message = error.message.toLowerCase();

        if (message.includes("network") || message.includes("fetch")) {
            return createAppError(ErrorType.NETWORK, error.message);
        }

        if (message.includes("unauthorized") || message.includes("401")) {
            return createAppError(ErrorType.AUTHENTICATION, error.message);
        }

        if (message.includes("forbidden") || message.includes("403")) {
            return createAppError(ErrorType.AUTHORIZATION, error.message);
        }

        if (message.includes("validation") || message.includes("invalid")) {
            return createAppError(ErrorType.VALIDATION, error.message);
        }

        if (message.includes("server") || message.includes("500")) {
            return createAppError(ErrorType.SERVER, error.message);
        }

        return createAppError(ErrorType.CLIENT, error.message);
    }

    // 检查是否为应用错误
    private isAppError(error: unknown): error is AppError {
        return (
            typeof error === "object" && error !== null && "type" in error && "message" in error && "timestamp" in error
        );
    }

    // 记录错误
    private logError(error: AppError): void {
        this.errorLog.push(error);

        // 开发环境下打印错误详情
        if (process.env.NODE_ENV === "development") {
            console.group(`🚨 ${error.type} Error`);
            console.error("Message:", error.message);
            console.error("Code:", error.code);
            console.error("Details:", error.details);
            console.error("Timestamp:", error.timestamp);
            console.groupEnd();
        }

        // 生产环境下可以发送到错误监控服务
        if (process.env.NODE_ENV === "production") {
            this.reportError(error);
        }
    }

    // 显示错误消息
    private showErrorMessage(error: AppError): void {
        const prefix = `Error(${error.type})`;
        // eslint-disable-next-line no-console
        console.error(prefix, error.message);
    }

    // 上报错误到监控服务
    private reportError(error: AppError): void {
        // 这里可以集成错误监控服务，如 Sentry
        // 暂时只记录到本地存储
        try {
            const storedErrors = localStorage.getItem("app_errors");
            const errors = storedErrors ? JSON.parse(storedErrors) : [];
            errors.push(error);

            // 只保留最近100个错误
            if (errors.length > 100) {
                errors.splice(0, errors.length - 100);
            }

            localStorage.setItem("app_errors", JSON.stringify(errors));
        } catch (e) {
            console.warn("Failed to store error in localStorage:", e);
        }
    }

    // 获取错误日志
    public getErrorLog(): AppError[] {
        return [...this.errorLog];
    }

    // 清空错误日志
    public clearErrorLog(): void {
        this.errorLog = [];
    }
}

// 导出错误处理器实例
export const errorHandler = ErrorHandler.getInstance();

// 便捷的错误处理函数
export const handleError = (error: Error | AppError | unknown, showMessage = true): AppError => {
    return errorHandler.handleError(error, showMessage);
};

// 异步操作错误处理装饰器
export const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(fn: T, showMessage = true): T => {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            handleError(error, showMessage);
            throw error;
        }
    }) as T;
};
