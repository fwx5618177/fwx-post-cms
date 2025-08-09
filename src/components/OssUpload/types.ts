import { UploadFile, UploadProps } from "antd";
import { uploadOSSDir, uploadStyle } from "@/request";

// OSS上传组件属性接口
export interface OSSUploadProps {
    value?: UploadFile[];
    onChange?: (fileList: UploadFile[]) => void;
    accept?: UploadProps["accept"];
    uploadDir?: uploadOSSDir;
    directory?: boolean;
    multiple?: boolean;
    maxCount?: number;
    listType?: UploadProps["listType"];
    uploadStyle?: uploadStyle;
}

// 上传配置
export interface UploadConfig {
    action: string;
    listType: UploadProps["listType"];
    fileList: UploadFile[];
    accept: UploadProps["accept"];
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
    uploadProps: UploadProps;
    fileList: UploadFile[];
    maxCount: number;
    listType: UploadProps["listType"];
}

// 上传按钮属性
export interface UploadButtonProps {
    listType: UploadProps["listType"];
}

// 预览模态框属性
export interface PreviewModalProps {
    previewState: PreviewState;
    onCancel: () => void;
}
