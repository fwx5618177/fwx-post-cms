// 移除 antd，使用原生表单与容器

const SourceCode = () => {
    const _formRef = null as unknown as HTMLFormElement | null;

    return (
        <>
            <div
                style={{ margin: 8, background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}
            >
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const path = String(fd.get("path") || "");
                        // TODO: 调用后端扫描接口
                        // eslint-disable-next-line no-console
                        console.info("scan path:", path);
                    }}
                >
                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "center" }}>
                        <label htmlFor="path">path</label>
                        <input id="path" name="path" placeholder="Input absolute path name" />
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <button type="submit">Scan</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SourceCode;
