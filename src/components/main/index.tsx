import React from "react";
import { RiArrowUpSLine, RiThumbUpLine } from "react-icons/ri";
import styles from "@/styles/pages/main.module.scss";

const MainPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <section>
                <h3>数据统计</h3>
                <div className={styles.grid3}>
                    <div className={styles.card}>
                        <div className={styles.cardMeta}>
                            <img className={styles.avatar} src="https://joeschmoe.io/api/v1/random" />
                            <div>
                                <div className={styles.cardTitle}>Card title</div>
                                <div className={styles.cardDesc}>This is the description</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardMeta}>
                            <img className={styles / avatar} src="https://joeschmoe.io/api/v1/random" />
                            <div>
                                <div className={styles.cardTitle}>Card title</div>
                                <div className={styles.cardDesc}>This is the description</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardMeta}>
                            <img className={styles / avatar} src="https://joeschmoe.io/api/v1/random" />
                            <div>
                                <div className={styles.cardTitle}>Card title</div>
                                <div className={styles.cardDesc}>This is the description</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                style={{
                    marginTop: 8,
                }}
            >
                <h3>服务</h3>
                <div className={styles.grid4}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>Active</div>
                        <div className={styles.metricValue}>
                            <RiArrowUpSLine /> 11.28%
                        </div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>Million Seconds</div>
                        <div className={styles.metricValue}>--:--:--</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>Day Level</div>
                        <div className={styles.metricValue}>D 天 H 时 m 分 s 秒</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>Feedback</div>
                        <div className={styles.metricValue}>
                            <RiThumbUpLine /> 1128
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainPage;
