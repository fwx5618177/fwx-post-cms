import React, { useState, FC } from "react";
import styles from "@styles/pages/mail.module.scss";
import MonacoEditor from "@monaco-editor/react";
import { LiveProvider, LivePreview } from "react-live";
import {
    FaDesktop,
    FaMobileAlt,
    FaCheck,
    FaArrowLeft,
    FaEye,
    FaPen,
    FaTimes,
    FaExclamationTriangle,
} from "react-icons/fa";

const MAIL_TEMPLATES = [
    {
        name: "欢迎邮件",
        type: "react",
        code: `() => (
            <div style={{
                padding: '32px',
                background: 'linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)',
                color: '#222',
                borderRadius: 12,
                boxShadow: '0 2px 16px #e0e3e8',
                fontFamily: 'Segoe UI, PingFang SC, Microsoft YaHei, Arial, sans-serif',
                maxWidth: 600,
                margin: '0 auto',
                border: '1px solid #e0e3e8',
            }}>
                <h1 style={{color:'#2563eb', fontWeight:700, fontSize:'2rem', marginBottom:12}}>欢迎加入我们的社区！</h1>
                <p style={{fontSize:'1.13rem', marginBottom:18}}>亲爱的用户，感谢您的注册。我们很高兴能为您服务。</p>
                <div style={{background:'#e0e7ef', borderRadius:8, padding:'16px 20px', color:'#2563eb', fontWeight:600, margin:'18px 0'}}>立即体验我们的服务吧！</div>
                <p style={{color:'#888', fontSize:'0.98rem', marginTop:24}}>如有疑问请随时联系我们。</p>
            </div>
        )`,
    },
    {
        name: "重置密码",
        type: "html",
        code: `<div style="padding:32px;background:linear-gradient(135deg,#f8fafc 80%,#e0e7ef 100%);color:#222;border-radius:12px;box-shadow:0 2px 16px #e0e3e8;font-family:'Segoe UI',PingFang SC,Microsoft YaHei,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e3e8;"><h1 style='color:#d97706;font-weight:700;font-size:2rem;margin-bottom:12px;'>重置密码</h1><p style='font-size:1.13rem;margin-bottom:18px;'>您好，您正在请求重置密码。请点击下方按钮完成操作。</p><a href='#' style='display:inline-block;background:#2563eb;color:#fff;padding:12px 32px;border-radius:6px;font-weight:600;text-decoration:none;margin:18px 0 0 0;'>重置密码</a><p style='color:#888;font-size:0.98rem;margin-top:24px;'>如果不是您本人操作，请忽略此邮件。</p></div>`,
    },
    {
        name: "通知",
        type: "react",
        code: `() => (
            <div style={{
                padding: '32px',
                background: 'linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)',
                color: '#222',
                borderRadius: 12,
                boxShadow: '0 2px 16px #e0e3e8',
                fontFamily: 'Segoe UI, PingFang SC, Microsoft YaHei, Arial, sans-serif',
                maxWidth: 600,
                margin: '0 auto',
                border: '1px solid #e0e3e8',
            }}>
                <h2 style={{color:'#16a34a', fontWeight:700, fontSize:'1.5rem', marginBottom:10}}>系统通知</h2>
                <p style={{fontSize:'1.08rem', marginBottom:18}}>您有一条新的系统消息，请及时查收。</p>
                <ul style={{background:'#e0e7ef', borderRadius:8, padding:'14px 20px', color:'#2563eb', fontWeight:500, margin:'18px 0'}}>
                    <li>消息内容一</li>
                    <li>消息内容二</li>
                </ul>
                <p style={{color:'#888', fontSize:'0.98rem', marginTop:24}}>感谢您的关注与支持！</p>
            </div>
        )`,
    },
    {
        name: "纯HTML",
        type: "html",
        code: `<div style="padding:32px;background:linear-gradient(135deg,#f8fafc 80%,#e0e7ef 100%);color:#222;border-radius:12px;box-shadow:0 2px 16px #e0e3e8;font-family:'Segoe UI',PingFang SC,Microsoft YaHei,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e3e8;"><h2 style='color:#2563eb;font-weight:700;font-size:1.5rem;margin-bottom:10px;'>纯HTML邮件</h2><p style='font-size:1.08rem;margin-bottom:18px;'>这是一个HTML模板示例，支持自定义内容。</p><ul style='background:#e0e7ef;border-radius:8px;padding:14px 20px;color:#2563eb;font-weight:500;margin:18px 0;'><li>支持多行内容</li><li>可自定义样式</li></ul><p style='color:#888;font-size:0.98rem;margin-top:24px;'>邮件底部说明信息。</p></div>`,
    },
    {
        name: "Notion 注册验证码",
        type: "html",
        code: `<div style="max-width:480px;margin:0 auto;padding:32px 0;font-family:'Segoe UI',PingFang SC,Microsoft YaHei,Arial,sans-serif;background:#fff;border-radius:12px;box-shadow:0 2px 16px #e0e3e8;border:1px solid #e0e3e8;">
  <div style='display:flex;align-items:center;gap:10px;margin-bottom:24px;padding:0 32px;'>
    <img src='https://www.notion.so/images/logo-ios.png' alt='Notion' style='width:32px;height:32px;border-radius:6px;vertical-align:middle;'/>
    <span style='font-size:1.3rem;font-weight:700;color:#222;'>Notion</span>
  </div>
  <div style='padding:0 32px;'>
    <h2 style='color:#222;font-size:1.4rem;font-weight:700;margin-bottom:12px;'>欢迎注册 Notion</h2>
    <p style='font-size:1.08rem;color:#444;margin-bottom:18px;'>您的注册验证码如下，请在 10 分钟内输入以完成注册：</p>
    <div style='font-size:2.1rem;font-weight:700;letter-spacing:8px;background:#f5f6fa;color:#222;padding:18px 0;border-radius:8px;text-align:center;margin-bottom:18px;'>823416</div>
    <p style='color:#888;font-size:0.98rem;margin-bottom:0;'>如果不是您本人操作，请忽略此邮件。</p>
    <p style='color:#888;font-size:0.98rem;margin-top:8px;'>感谢使用 Notion！</p>
  </div>
</div>`,
    },
];
const PLATFORMS = [
    { key: "desktop", icon: <FaDesktop />, label: "桌面" },
    { key: "mobile", icon: <FaMobileAlt />, label: "移动" },
];

const STEPS = [
    { key: "draft", icon: <FaPen />, label: "草稿", desc: "编辑邮件内容" },
    { key: "review", icon: <FaEye />, label: "审核", desc: "预览并检查" },
    { key: "confirm", icon: <FaCheck />, label: "确认", desc: "确认邮件信息" },
    { key: "published", icon: <FaCheck />, label: "已发布", desc: "邮件已发布" },
];

// 步骤 props 类型
export type DraftStepProps = {
    code: string;
    templateIdx: number | null;
    platform: string;
    setPlatform: (v: string) => void;
    showTemplateModal: boolean;
    setShowTemplateModal: (v: boolean) => void;
    MAIL_TEMPLATES: typeof MAIL_TEMPLATES;
    setCode: (v: string) => void;
    setTemplateIdx: (v: number | null) => void;
    handleClearTemplate: () => void;
    next: () => void;
};
export type ReviewStepProps = {
    code: string;
    platform: string;
    templateIdx: number | null;
    prev: () => void;
    next: () => void;
};
export type ConfirmStepProps = {
    code: string;
    templateIdx: number | null;
    MAIL_TEMPLATES: typeof MAIL_TEMPLATES;
    prev: () => void;
    handlePublish: () => void;
    status: string;
    from: string;
    to: string;
    subject: string;
    setFrom: (v: string) => void;
    setTo: (v: string) => void;
    setSubject: (v: string) => void;
};
export type PublishedStepProps = {
    setStep: (v: StepKey) => void;
};

// 工具函数
function isReactCode(code: string) {
    const trimmed = code.trim();
    return (
        /^\(\s*\)\s*=>/.test(trimmed) ||
        /^function\s*\(/.test(trimmed) ||
        /^class\s+/.test(trimmed) ||
        /^return\s*\(/.test(trimmed) ||
        /^<React\.Fragment>/.test(trimmed)
    );
}

// 复用组件
const PreviewTabs: FC<{ platform: string; setPlatform: (v: string) => void }> = ({ platform, setPlatform }) => (
    <div className={styles.mailEditorTabs}>
        {PLATFORMS.map(p => (
            <div
                key={p.key}
                className={styles.mailEditorTab + (platform === p.key ? " " + styles.mailEditorTabActive : "")}
                onClick={() => setPlatform(p.key)}
            >
                {p.icon} <span>{p.label}</span>
            </div>
        ))}
    </div>
);

const PreviewPanel: FC<{
    code: string;
    platform: string;
    templateIdx: number | null;
    from?: string;
    to?: string;
    subject?: string;
}> = ({ code, platform, templateIdx, from, to, subject }) => {
    const mailBody = (
        <div className={styles.mailPreviewBody} data-platform={platform}>
            {isReactCode(code) ? (
                <LiveProvider code={code}>
                    <LivePreview />
                </LiveProvider>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: code }} />
            )}
        </div>
    );
    const mailHeader = (
        <div className={styles.mailPreviewHeader} data-platform={platform}>
            <div className="mailHeaderRow">
                <span className="mailHeaderLabel">发件人：</span>
                <span className="mailHeaderValue">{from || "noreply@example.com"}</span>
            </div>
            <div className="mailHeaderRow">
                <span className="mailHeaderLabel">收件人：</span>
                <span className="mailHeaderValue">{to || "user@yourmail.com"}</span>
            </div>
            <div className="mailHeaderRow">
                <span className="mailHeaderLabel">时间：</span>
                <span className="mailHeaderValue">2024-06-01 10:00</span>
            </div>
            <div className="mailHeaderSubject">
                主题：{subject || (templateIdx !== null ? MAIL_TEMPLATES[templateIdx].name : "邮件主题")}
            </div>
        </div>
    );
    return (
        <div className={styles.livePreviewWrap} data-platform={platform}>
            {mailHeader}
            {mailBody}
        </div>
    );
};

const TemplateModal: FC<{
    show: boolean;
    onClose: () => void;
    onSelect: (idx: number) => void;
    templateIdx: number | null;
    MAIL_TEMPLATES: typeof MAIL_TEMPLATES;
}> = ({ show, onClose, onSelect, templateIdx, MAIL_TEMPLATES }) => {
    if (!show) return null;
    const renderTemplateCardPreview = (tpl: { code: string }) => (
        <div className={styles.templateCardPreviewBody}>
            {isReactCode(tpl.code) ? (
                <LiveProvider code={tpl.code}>
                    <LivePreview />
                </LiveProvider>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: tpl.code }} />
            )}
        </div>
    );
    return (
        <div className={styles.templateModalMask} onClick={onClose}>
            <div className={styles.templateModal} onClick={e => e.stopPropagation()}>
                <div className={styles.templateModalTitle}>选择邮件模板</div>
                <div className={styles.templateCardList}>
                    {MAIL_TEMPLATES.map((tpl, idx) => (
                        <div
                            key={tpl.name}
                            className={styles.mailTemplateCard + (templateIdx === idx ? " " + styles.active : "")}
                            onClick={() => onSelect(idx)}
                            tabIndex={0}
                        >
                            <div className={styles.mailTemplateCardPreview}>{renderTemplateCardPreview(tpl)}</div>
                            <div
                                className={
                                    styles.mailTemplateCardTitle + (templateIdx === idx ? " " + styles.active : "")
                                }
                            >
                                {tpl.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 步骤组件
const DraftStep: FC<DraftStepProps> = ({
    code,
    templateIdx,
    platform,
    setPlatform,
    showTemplateModal,
    setShowTemplateModal,
    MAIL_TEMPLATES,
    setCode,
    setTemplateIdx,
    handleClearTemplate,
    next,
}) => (
    <div className={styles.draftStep}>
        <div className={styles.mailEditorMain}>
            <div className={styles.mailEditorMainLeft}>
                <div className={styles.mailEditorFormRow}>
                    <span className={styles.mailEditorFormLabel}>选择模板：</span>
                    {templateIdx === null ? (
                        <button className={styles.mailEditorFormBtn} onClick={() => setShowTemplateModal(true)}>
                            选择模板
                        </button>
                    ) : (
                        <>
                            <span style={{ color: "#2563eb", fontWeight: 600 }}>
                                {MAIL_TEMPLATES[templateIdx].name}
                            </span>
                            <button className={styles.mailEditorFormBtnClear} onClick={handleClearTemplate}>
                                清除模板
                            </button>
                        </>
                    )}
                </div>
                <div className={styles.monacoEditorWrap}>
                    <MonacoEditor
                        height="100%"
                        defaultLanguage={isReactCode(code) ? "javascript" : "html"}
                        theme="vs-dark"
                        value={code}
                        onChange={v => setCode(v || "")}
                        options={{
                            fontSize: 15,
                            minimap: { enabled: false },
                            fontFamily: "Fira Mono, monospace",
                            lineHeight: 1.7,
                            fontWeight: "500",
                            scrollbar: { vertical: "auto" },
                        }}
                    />
                </div>
                <div className={styles.draftStepActions}>
                    <button className={styles.mailEditorFormBtn} onClick={next}>
                        进入审核
                    </button>
                </div>
            </div>
            <div className={styles.mailEditorMainRight}>
                <PreviewTabs platform={platform} setPlatform={setPlatform} />
                <div className={styles.previewPanel} data-platform={platform}>
                    <PreviewPanel code={code} platform={platform} templateIdx={templateIdx} />
                </div>
            </div>
            <TemplateModal
                show={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSelect={idx => {
                    setTemplateIdx(idx);
                    setCode(MAIL_TEMPLATES[idx].code);
                    setShowTemplateModal(false);
                }}
                templateIdx={templateIdx}
                MAIL_TEMPLATES={MAIL_TEMPLATES}
            />
        </div>
    </div>
);

const ReviewStep: FC<ReviewStepProps> = ({ code, platform, templateIdx, prev, next }) => (
    <div className={styles.reviewStep}>
        <div className={styles.reviewContent}>
            <div className={styles.previewPanel} data-platform={platform}>
                <div className={styles.previewLabel}>实时预览</div>
                <PreviewPanel code={code} platform={platform} templateIdx={templateIdx} />
            </div>
            <div className={styles.reviewActions}>
                <button className={styles.rejectButton} onClick={prev}>
                    <FaTimes /> 返回编辑
                </button>
                <button className={styles.approveButton + " " + styles.primary} onClick={next}>
                    <FaCheck /> 通过审核
                </button>
            </div>
        </div>
    </div>
);

const ConfirmStep: FC<ConfirmStepProps> = ({
    code,
    templateIdx,
    MAIL_TEMPLATES,
    prev,
    handlePublish,
    status,
    from,
    to,
    subject,
    setFrom,
    setTo,
    setSubject,
}) => (
    <div className={styles.confirmStep}>
        <div className={styles.confirmMain}>
            <div className={styles.confirmForm}>
                <h3>请确认邮件信息</h3>
                <div className={styles.formRow}>
                    <label>发件人：</label>
                    <input value={from} onChange={e => setFrom(e.target.value)} className={styles.formInput} />
                </div>
                <div className={styles.formRow}>
                    <label>收件人：</label>
                    <input value={to} onChange={e => setTo(e.target.value)} className={styles.formInput} />
                </div>
                <div className={styles.formRow}>
                    <label>主题：</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} className={styles.formInput} />
                </div>
                <div className={styles.detailItem}>
                    <strong>模板：</strong>
                    {templateIdx !== null ? MAIL_TEMPLATES[templateIdx].name : "无"}
                </div>
                <div className={styles.detailItem}>
                    <strong>模式：</strong>
                    {isReactCode(code) ? "React" : "HTML"}
                </div>
                <div className={styles.detailItem}>
                    <strong>代码长度：</strong>
                    {code.length} 字符
                </div>
                <div className={styles.confirmWarning}>
                    <FaExclamationTriangle />
                    <p>发布后邮件将不可更改，请确认无误。</p>
                </div>
                <div className={styles.confirmActions}>
                    <button className={styles.backButton} onClick={prev}>
                        <FaArrowLeft /> 返回审核
                    </button>
                    <button
                        className={styles.publishButton + " " + styles.primary}
                        onClick={handlePublish}
                        disabled={status === "loading"}
                    >
                        <FaCheck /> {status === "loading" ? "发布中..." : "立即发布"}
                    </button>
                </div>
            </div>
            <div className={styles.confirmPreview}>
                <div className={styles.previewPanel} data-platform="desktop">
                    <PreviewPanel
                        code={code}
                        platform="desktop"
                        templateIdx={templateIdx}
                        from={from}
                        to={to}
                        subject={subject}
                    />
                </div>
            </div>
        </div>
    </div>
);

const PublishedStep: FC<PublishedStepProps> = ({ setStep }) => (
    <div className={styles.publishedStep}>
        <div className={styles.publishedContent}>
            <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                    <FaCheck />
                </div>
                <h2>邮件发布成功！</h2>
                <p>邮件已成功发布。</p>
                <button className={styles.backButton} onClick={() => setStep("draft")}>
                    返回继续编辑
                </button>
            </div>
        </div>
    </div>
);

const StepContentMap: {
    Draft: FC<DraftStepProps>;
    Review: FC<ReviewStepProps>;
    Confirm: FC<ConfirmStepProps>;
    Published: FC<PublishedStepProps>;
} = {
    Draft: DraftStep,
    Review: ReviewStep,
    Confirm: ConfirmStep,
    Published: PublishedStep,
};

type StepKey = "draft" | "review" | "confirm" | "published";

// 步骤条
const renderSteps = (step: StepKey, setStep: (v: StepKey) => void) => (
    <div className={styles.publishSteps}>
        {STEPS.map((s, i) => {
            const isActive = step === s.key;
            const isDone = STEPS.findIndex(st => st.key === step) > i;
            return (
                <div
                    key={s.key}
                    className={`${styles.step} ${isActive ? styles.active : ""} ${isDone ? styles.completed : ""}`}
                    onClick={() => isDone && setStep(s.key as StepKey)}
                >
                    <div className={styles.stepIcon}>{s.icon}</div>
                    <div className={styles.stepContent}>
                        <div className={styles.stepTitle}>{s.label}</div>
                        <div className={styles.stepDesc}>{s.desc}</div>
                    </div>
                    {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
                </div>
            );
        })}
    </div>
);

export default function Mail() {
    const [templateIdx, setTemplateIdx] = useState<number | null>(null);
    const [code, setCode] = useState("");
    const [platform, setPlatform] = useState("desktop");
    const [step, setStep] = useState<StepKey>("draft");
    const [status, setStatus] = useState("idle");
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [from, setFrom] = useState("noreply@example.com");
    const [to, setTo] = useState("user@yourmail.com");
    const [subject, setSubject] = useState("");

    // 选择模板后注入内容
    const handleClearTemplate = () => {
        setTemplateIdx(null);
        setCode("");
    };
    // 步骤切换
    const next = () =>
        setStep(STEPS[Math.min(STEPS.findIndex(s => s.key === step) + 1, STEPS.length - 1)].key as StepKey);
    const prev = () => setStep(STEPS[Math.max(STEPS.findIndex(s => s.key === step) - 1, 0)].key as StepKey);
    // 发布
    const handlePublish = () => {
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setStep("published");
        }, 1200);
    };

    return (
        <div className={styles.mailPage}>
            <div className={styles.header}>
                <h1>邮件中心</h1>
            </div>
            {renderSteps(step, setStep)}
            {step === "draft" && (
                <StepContentMap.Draft
                    code={code}
                    templateIdx={templateIdx}
                    platform={platform}
                    setPlatform={setPlatform}
                    showTemplateModal={showTemplateModal}
                    setShowTemplateModal={setShowTemplateModal}
                    MAIL_TEMPLATES={MAIL_TEMPLATES}
                    setCode={setCode}
                    setTemplateIdx={setTemplateIdx}
                    handleClearTemplate={handleClearTemplate}
                    next={next}
                />
            )}
            {step === "review" && (
                <StepContentMap.Review
                    code={code}
                    platform={platform}
                    templateIdx={templateIdx}
                    prev={prev}
                    next={next}
                />
            )}
            {step === "confirm" && (
                <StepContentMap.Confirm
                    code={code}
                    templateIdx={templateIdx}
                    MAIL_TEMPLATES={MAIL_TEMPLATES}
                    prev={prev}
                    handlePublish={handlePublish}
                    status={status}
                    from={from}
                    to={to}
                    subject={subject}
                    setFrom={setFrom}
                    setTo={setTo}
                    setSubject={setSubject}
                />
            )}
            {step === "published" && <StepContentMap.Published setStep={setStep as (v: StepKey) => void} />}
        </div>
    );
}
