import React from "react";
import { RiArticleLine, RiUserLine, RiEyeLine, RiHeartLine } from "react-icons/ri";
import styles from "@styles/pages/dashboard.module.scss";

/**
 * 仪表盘页面
 * @description 展示系统概览数据
 */
const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <RiArticleLine />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statTitle}>文章总数</div>
                        <div className={styles.statValue}>1,128</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <RiUserLine />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statTitle}>用户总数</div>
                        <div className={styles.statValue}>93</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <RiEyeLine />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statTitle}>总浏览量</div>
                        <div className={styles.statValue}>8,846</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <RiHeartLine />
                    </div>
                    <div className={styles.statContent}>
                        <div className={styles.statTitle}>总点赞数</div>
                        <div className={styles.statValue}>256</div>
                    </div>
                </div>
            </div>

            <div className={styles.charts}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>文章发布趋势</h3>
                    <div className={styles.chartPlaceholder}>文章发布趋势图表</div>
                </div>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>用户增长趋势</h3>
                    <div className={styles.chartPlaceholder}>用户增长趋势图表</div>
                </div>
            </div>

            <div className={styles.lists}>
                <div className={styles.listCard}>
                    <h3 className={styles.listTitle}>最新文章</h3>
                    <div className={styles.listPlaceholder}>最新文章列表</div>
                </div>
                <div className={styles.listCard}>
                    <h3 className={styles.listTitle}>活跃用户</h3>
                    <div className={styles.listPlaceholder}>活跃用户列表</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
