import React from "react";
import styles from "./index.module.scss";
import { LoadingProps } from "./types";

const Loading: React.FC<LoadingProps> = ({ type = "spinner", size = "md", className }) => {
    const loadingTypes = {
        spinner: () => <div className={`${styles.spinner} ${styles[size]}`} />,
        wave: () => (
            <div className={`${styles.wave} ${styles[size]}`}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
        ),
        circle: () => <div className={`${styles.circle} ${styles[size]}`} />,
    } as const;

    const renderLoading = () => {
        const LoadingComponent = loadingTypes[type] || loadingTypes.spinner;
        return <LoadingComponent />;
    };

    return <div className={`${styles.loading} ${className || ""}`}>{renderLoading()}</div>;
};

export default Loading;
