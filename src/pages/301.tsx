import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/pages/301.module.scss";

const MovedPermanently = () => {
    return (
        <div className={styles.movedPermanently}>
            <div className={styles.content}>
                <h1 className={styles.title}>301</h1>
                <p className={styles.subtitle}>抱歉，该页面已永久移动。</p>
                <Link to="/" className={styles.button}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default MovedPermanently;
