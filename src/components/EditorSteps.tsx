import React from "react";
import styles from "@styles/components/editor-steps.module.scss";

export type PublishStep = "draft" | "review" | "confirm" | "published";

export interface EditorStepsProps {
    current: PublishStep;
    onChange?: (step: PublishStep) => void;
}

const STEP_ORDER: PublishStep[] = ["draft", "review", "confirm", "published"];

const STEP_LABEL: Record<PublishStep, string> = {
    draft: "草稿",
    review: "复审",
    confirm: "确认",
    published: "已发布",
};

const EditorSteps: React.FC<EditorStepsProps> = ({ current, onChange }) => {
    const currentIndex = STEP_ORDER.indexOf(current);
    return (
        <div className={styles.steps} role="group" aria-label="发布流程步骤">
            {STEP_ORDER.map((step, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                const isClickable = index <= currentIndex + 1;
                return (
                    <div key={step} className={styles.stepWrap}>
                        <button
                            type="button"
                            className={`${styles.step} ${isActive ? styles.active : ""} ${
                                isCompleted ? styles.completed : ""
                            }`}
                            onClick={() => isClickable && onChange?.(step)}
                            aria-current={isActive ? "step" : undefined}
                            aria-disabled={!isClickable}
                            title={STEP_LABEL[step]}
                        >
                            <span className={styles.dot} />
                            <span className={styles.label}>{STEP_LABEL[step]}</span>
                        </button>
                        {index < STEP_ORDER.length - 1 && <span className={styles.connector} />}
                    </div>
                );
            })}
        </div>
    );
};

export default EditorSteps;
