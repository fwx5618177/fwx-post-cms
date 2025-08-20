import React, { useState } from "react";
import SimpleOssUpload from "@/components/OssUpload";
import { v4 as uuidv4 } from "uuid";
import api from "./api";

type UploadStyle = "click" | "dragger";
type UploadDir = "upload" | "image" | "file" | "video" | "kaboom" | "3DModel";

interface LiteUploadFile {
    uid?: string;
    url?: string;
    dist: string;
    name: string;
    size?: number;
    type?: string;
}

interface FormI {
    directory: string;
    dragger: UploadStyle;
    list: string;
    path: UploadDir;
    resoureParent: string;
    uploadFile: LiteUploadFile[];
}

const OSSUpload: React.FC = () => {
    const [listType, setListType] = useState<string>("text");
    const [uStyle, setUStyle] = useState<UploadStyle>("click");
    const [uploadPath, setUploadPath] = useState<UploadDir>("image");
    const [directoryStatus, setDirectoryStatus] = useState<boolean>(false);
    const [resource, setResource] = useState<string>("");
    const [uploadFiles, setUploadFiles] = useState<LiteUploadFile[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = uploadFiles.map(ci => ({
            uuid: uuidv4(),
            createdAt: new Date(),
            url: ci.url || "",
            relativePath: ci.dist,
            name: ci.name,
            size: String(ci.size || 0),
            type: ci.type || "",
            resoureParent: resource,
        }));
        const data = await api.createData(result.length > 1 ? result : result[0]);
        // eslint-disable-next-line no-console
        console.info("上传成功:", data);
    };

    return (
        <>
            <h3 style={{ margin: 12 }}>OSS Upload</h3>
            <div
                style={{ margin: 12, background: "#232428", border: "1px solid #36373a", borderRadius: 6, padding: 12 }}
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <label>
                            List Type
                            <select value={listType} onChange={e => setListType(e.target.value)}>
                                {["text", "picture", "picture-card"].map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Dragger Type
                            <select value={uStyle} onChange={e => setUStyle(e.target.value as UploadStyle)}>
                                {(["click", "dragger"] as UploadStyle[]).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Upload Path
                            <select value={uploadPath} onChange={e => setUploadPath(e.target.value as UploadDir)}>
                                {["upload", "image", "file", "video", "kaboom", "3DModel"].map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            directory switch
                            <input
                                type="checkbox"
                                checked={directoryStatus}
                                onChange={e => setDirectoryStatus(e.target.checked)}
                            />
                        </label>
                        <label style={{ gridColumn: "1 / -1" }}>
                            Resource
                            <input
                                placeholder="Please input your key words"
                                value={resource}
                                onChange={e => setResource(e.target.value)}
                            />
                        </label>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <SimpleOssUpload
                                uploadDir={`${uploadPath}/${resource || ""}` as any}
                                onChangeFiles={(files: any[]) => setUploadFiles(files as LiteUploadFile[])}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <button type="submit">Submit</button>
                        <button
                            type="button"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setListType("text");
                                setUStyle("click");
                                setUploadPath("image");
                                setDirectoryStatus(false);
                                setResource("");
                                setUploadFiles([]);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default OSSUpload;
