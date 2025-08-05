import { useState, useEffect, useCallback } from "react";
import { message, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import { PostCosConf, BeforeUploadValueType, ExtendedUploadFile } from "@/request/interface";
import { getBase64 } from "@/request/lib";
import { PreviewState, OSSUploadProps } from "../types";
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
    const [fileList, setFileList] = useState<UploadFile[]>(value as UploadFile[]);

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
            message.error(error instanceof Error ? error.message : String(error));
        }
    }, [uploadDir]);

    useEffect(() => {
        initOSSConfig();
    }, [initOSSConfig]);

    // 预览处理
    const handlePreview = useCallback(async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewState({
            visible: true,
            image: file.url || (file.preview as string),
            title: file.name,
        });
    }, []);

    // 文件变化处理
    const handleChange: UploadProps["onChange"] = useCallback(
        ({ fileList: newFileList }) => {
            onChange?.([...newFileList]);
            setFileList(newFileList);
        },
        [onChange],
    );

    // 文件移除处理
    const handleRemove = useCallback(
        (file: UploadFile) => {
            const files = (value || []).filter(v => v.url !== file.url);
            onChange?.(files);
        },
        [value, onChange],
    );

    // 上传前处理
    const beforeUpload = useCallback(
        (file: RcFile): BeforeUploadValueType => {
            if (!OSSData) return false;

            const filename = file.uid + "_" + file.name;
            const tmpKey = OSSData.key?.substring(0, OSSData.key.lastIndexOf("*")) || "";

            const extendedFile = file as unknown as ExtendedUploadFile;
            extendedFile.dist = tmpKey + filename;
            extendedFile.url = "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/" + extendedFile.dist;

            return file;
        },
        [OSSData],
    );

    // 获取上传数据
    const getUploadData = useCallback(
        (file: ExtendedUploadFile): PostCosConf => {
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
