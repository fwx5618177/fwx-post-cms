import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/pages/500.module.scss";

const ServerError = () => {
    return (
        <div className={styles.serverError}>
            <div className={styles.content}>
                <h1 className={styles.title}>500</h1>
                <p className={styles.subtitle}>抱歉，服务器出现了错误。</p>
                <Link to="/" className={styles.button}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default ServerError;
