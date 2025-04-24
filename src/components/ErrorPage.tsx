import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/components/error-page.module.scss";

interface ErrorPageProps {
    status: number;
    title: string;
    message: string;
}

/**
 * 错误页面组件
 * @description 用于显示各种错误状态的页面
 */
const ErrorPage: React.FC<ErrorPageProps> = ({ status, title, message }) => {
    return (
        <div className={styles.errorPage}>
            <div className={styles.errorContent}>
                <h1 className={styles.status}>{status}</h1>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <Link to="/" className={styles.backButton}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
