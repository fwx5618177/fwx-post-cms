import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "./api";
import type { PostCosConf, uploadOSSDir } from "../request/interface";

interface SimpleOSSUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    accept?: string;
    uploadDir?: uploadOSSDir;
}

const OSSUploadBase: React.FC<SimpleOSSUploadProps> = ({
    value = "",
    onChange,
    accept = "image/*",
    uploadDir = "upload",
}) => {
    const [ossData, setOssData] = useState<PostCosConf | null>(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const init = useCallback(async () => {
        try {
            const result = (await api.ossSignature({
                allowPrefix: `${uploadDir}/*`,
                username: "fwx",
                password: "123",
            })) as PostCosConf;
            setOssData(result);
        } catch (error) {
            console.error("获取OSS签名失败:", error);
        }
    }, [uploadDir]);

    useEffect(() => {
        init();
    }, [init]);

    const handlePick = () => inputRef.current?.click();

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
        const file = e.target.files?.[0];
        if (!file || !ossData) return;
        setUploading(true);
        try {
            const tmpKey = (ossData.key?.substring(0, ossData.key.lastIndexOf("*")) || "").trim();
            const filename = `${Date.now()}_${file.name}`;
            const objectKey = tmpKey + filename;

            const form = new FormData();
            form.append("key", objectKey);
            form.append("policy", ossData.policy);
            form.append("q-sign-algorithm", ossData.qSignAlgorithm);
            form.append("q-ak", ossData.qAk);
            form.append("q-key-time", ossData.qKeyTime);
            form.append("q-signature", ossData.qSignature);
            form.append("file", file);

            const res = await fetch("https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com", {
                method: "POST",
                body: form,
            });
            if (!res.ok) throw new Error(`上传失败: ${res.status}`);
            const url = `https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/${objectKey}`;
            onChange?.(url);
        } catch (err) {
            console.error(err);
            alert("上传失败，请重试");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button type="button" onClick={handlePick} disabled={uploading} style={{ padding: "6px 12px" }}>
                {uploading ? "上传中…" : value ? "更换封面" : "上传封面"}
            </button>
            {value && (
                <img src={value} alt="cover" style={{ width: 120, height: 68, objectFit: "cover", borderRadius: 4 }} />
            )}
            <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} style={{ display: "none" }} />
        </div>
    );
};

export default OSSUploadBase;
