import React from "react";
import { Link } from "react-router-dom";
import styles from "@styles/pages/503.module.scss";

const ServiceUnavailable = () => {
    return (
        <div className={styles.serviceUnavailable}>
            <div className={styles.content}>
                <h1 className={styles.title}>503</h1>
                <p className={styles.subtitle}>抱歉，服务暂时不可用。</p>
                <Link to="/" className={styles.button}>
                    返回首页
                </Link>
            </div>
        </div>
    );
};

export default ServiceUnavailable;
