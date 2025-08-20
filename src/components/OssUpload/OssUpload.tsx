import React from "react";
import { OSSUploadProps, UploadPropsLite } from "./types";
import { useOSSUpload } from "./hooks/useOSSUpload";
import { UploadStyleElement } from "./components/UploadStyleElement";
import { PreviewModal } from "./components/PreviewModal";

/**
 * OSS上传组件
 * 支持多种上传样式和文件类型
 * 重构后的版本，组件职责更加单一
 */
const OSSUpload: React.FC<OSSUploadProps> = ({
    value = [],
    onChange,
    accept = "*",
    uploadDir = "upload",
    directory = false,
    multiple = false,
    maxCount = 50,
    listType = "picture-card",
    uploadStyle = "click",
}) => {
    const {
        fileList,
        previewState,
        handlePreview,
        handleChange,
        handleRemove,
        beforeUpload,
        getUploadData,
        closePreview,
    } = useOSSUpload({
        value,
        onChange,
        uploadDir,
    });

    // 构建上传属性配置
    const uploadProps: UploadPropsLite = {
        action: "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com",
        listType,
        fileList,
        accept: accept as string,
        directory,
        multiple,
        maxCount,
        onPreview: handlePreview,
        onChange: handleChange as any,
        onRemove: handleRemove,
        data: getUploadData,
        beforeUpload,
    };

    return (
        <>
            <UploadStyleElement
                uploadStyle={uploadStyle}
                uploadProps={uploadProps}
                fileList={fileList}
                maxCount={maxCount}
                listType={listType}
            />
            <PreviewModal previewState={previewState} onCancel={closePreview} />
        </>
    );
};

export default OSSUpload;
