import { useState, useEffect, useCallback } from "react";
import { PostCosConf } from "@/request";
import { getBase64 } from "@/request";
import { PreviewState, OSSUploadProps, UploadFileLite, UploadPropsLite } from "../types";
import api from "../api";

/**
 * OSS上传自定义Hook
 * 管理上传状态、配置和逻辑
 */
export const useOSSUpload = ({
    value = [],
    onChange,
    uploadDir = "upload",
}: Pick<OSSUploadProps, "value" | "onChange" | "uploadDir">) => {
    const [OSSData, setOSSData] = useState<PostCosConf>();
    const [previewState, setPreviewState] = useState<PreviewState>({
        visible: false,
        image: "",
        title: "",
    });
    const [fileList, setFileList] = useState<UploadFileLite[]>(value as UploadFileLite[]);

    // 初始化OSS配置
    const initOSSConfig = useCallback(async () => {
        try {
            const result = await api.ossSignature({
                allowPrefix: `${uploadDir}/*`,
                username: "fwx",
                password: "123",
            });

            setOSSData(result as unknown as PostCosConf);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error instanceof Error ? error.message : String(error));
        }
    }, [uploadDir]);

    useEffect(() => {
        initOSSConfig();
    }, [initOSSConfig]);

    // 预览处理
    const handlePreview = useCallback(async (file: UploadFileLite) => {
        if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewState({
            visible: true,
            image: file.url || (file.preview as string),
            title: file.name,
        });
    }, []);

    // 文件变化处理
    const handleChange: UploadPropsLite["onChange"] = useCallback(
        ({ fileList: newFileList }) => {
            onChange?.([...newFileList]);
            setFileList(newFileList);
        },
        [onChange],
    );

    // 文件移除处理
    const handleRemove = useCallback(
        (file: UploadFileLite) => {
            const files = (value || []).filter(v => v.url !== file.url);
            onChange?.(files);
        },
        [value, onChange],
    );

    // 上传前处理
    const beforeUpload = useCallback(
        (file: File) => {
            if (!OSSData) return false as any;
            const uid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const filename = uid + "_" + file.name;
            const tmpKey = OSSData.key?.substring(0, OSSData.key.lastIndexOf("*")) || "";
            const dist = tmpKey + filename;
            const url = "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/" + dist;
            // 附加到 fileList 显示
            const next = [...fileList, { uid, name: file.name, originFileObj: file, dist, url, status: "uploading" }];
            setFileList(next);
            return file as any;
        },
        [OSSData, fileList],
    );

    // 获取上传数据
    const getUploadData = useCallback(
        (file: UploadFileLite): PostCosConf => {
            return {
                ...(OSSData as PostCosConf),
                key: file.dist || "",
            };
        },
        [OSSData],
    );

    // 关闭预览
    const closePreview = useCallback(() => {
        setPreviewState(prev => ({ ...prev, visible: false }));
    }, []);

    return {
        fileList,
        previewState,
        handlePreview,
        handleChange,
        handleRemove,
        beforeUpload,
        getUploadData,
        closePreview,
    };
};
