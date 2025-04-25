import React from "react";
import { Outlet } from "react-router-dom";
import styles from "@styles/pages/article.module.scss";

const Article = () => {
    return (
        <div className={styles.articlePage}>
            <Outlet />
        </div>
    );
};

export default Article;
