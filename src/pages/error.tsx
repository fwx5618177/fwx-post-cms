import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/pages/error.module.scss";

const Error = () => {
    return (
        <div className={styles.error}>
            <div className={styles.content}>
                <h1 className={styles.title}>错误</h1>
                <p className={styles.subtitle}>抱歉，发生了一些错误。</p>
                <Link to="/" className={styles.button}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default Error;
