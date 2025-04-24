import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/pages/404.module.scss";

const NotFound = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.subtitle}>抱歉，您访问的页面不存在。</p>
                <Link to="/" className={styles.button}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
