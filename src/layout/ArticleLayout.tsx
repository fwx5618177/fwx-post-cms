import React from "react";
import { Outlet } from "react-router-dom";
import { RiArticleLine } from "react-icons/ri";
import styles from "@styles/layouts/article.module.scss";

const ArticleLayout = () => {
    return (
        <div className={styles.articleLayout}>
            <div className={styles.layoutHeader}>
                <div className={styles.headerIcon}>
                    <RiArticleLine />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.headerTitle}>文章管理</h2>
                    <p className={styles.headerDescription}>管理所有文章内容</p>
                </div>
            </div>

            <div className={styles.layoutContent}>
                <Outlet />
            </div>
        </div>
    );
};

export default ArticleLayout;
