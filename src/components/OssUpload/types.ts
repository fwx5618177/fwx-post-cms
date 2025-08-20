import { uploadOSSDir, uploadStyle } from "@/request";

export type UploadListType = "text" | "picture" | "picture-card";

export interface UploadFileLite {
    uid: string;
    name: string;
    size?: number;
    type?: string;
    url?: string;
    preview?: string;
    originFileObj?: File;
    status?: "uploading" | "done" | "error" | "removed";
    dist?: string;
}

export interface UploadPropsLite {
    action?: string;
    listType?: UploadListType;
    fileList?: UploadFileLite[];
    accept?: string;
    directory?: boolean;
    multiple?: boolean;
    maxCount?: number;
    onPreview?: (file: UploadFileLite) => void;
    onChange?: (info: { fileList: UploadFileLite[] }) => void;
    onRemove?: (file: UploadFileLite) => void | boolean;
    data?: any;
    beforeUpload?: (file: File) => any;
}

// OSS上传组件属性接口（遗留封装）
export interface OSSUploadProps {
    value?: UploadFileLite[];
    onChange?: (fileList: UploadFileLite[]) => void;
    accept?: string;
    uploadDir?: uploadOSSDir;
    directory?: boolean;
    multiple?: boolean;
    maxCount?: number;
    listType?: UploadListType;
    uploadStyle?: uploadStyle;
}

// 上传配置
export interface UploadConfig {
    action: string;
    listType: UploadListType;
    fileList: UploadFileLite[];
    accept: string;
    directory?: boolean;
    multiple?: boolean;
    maxCount?: number;
}

// 预览状态
export interface PreviewState {
    visible: boolean;
    image: string;
    title: string;
}

// 上传样式元素属性
export interface UploadStyleElementProps {
    uploadStyle: uploadStyle;
    uploadProps: UploadPropsLite;
    fileList: UploadFileLite[];
    maxCount: number;
    listType: UploadListType;
}

// 上传按钮属性
export interface UploadButtonProps {
    listType: UploadListType;
}

// 预览模态框属性
export interface PreviewModalProps {
    previewState: PreviewState;
    onCancel: () => void;
}
