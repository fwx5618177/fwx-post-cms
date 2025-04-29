import React from "react";
import styles from "./index.module.scss";
import { LoadingProps } from "./types";

const Loading: React.FC<LoadingProps> = ({ type = "spinner", size = "md", className }) => {
    const renderContent = () => {
        switch (type) {
            case "wave":
                return (
                    <div className={`${styles.wave} ${styles[size]}`}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className={styles.dot} />
                        ))}
                    </div>
                );
            case "circle":
                return <div className={`${styles.circle} ${styles[size]}`} />;
            default:
                return <div className={`${styles.spinner} ${styles[size]}`} />;
        }
    };

    return <div className={`${styles.loading} ${className || ""}`}>{renderContent()}</div>;
};

export default Loading;
