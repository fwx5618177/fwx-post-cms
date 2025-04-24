import React, { Component, ErrorInfo, ReactNode } from "react";
import styles from "@styles/pages/error-boundary.module.scss";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorBoundary}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>组件错误</h1>
                        <p className={styles.subtitle}>{this.state.error?.message || "抱歉，组件渲染出现错误。"}</p>
                        <button className={styles.button} onClick={() => window.location.reload()}>
                            刷新页面
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
