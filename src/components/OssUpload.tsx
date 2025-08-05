import { InboxOutlined, PlusOutlined, UploadOutlined, FileImageOutlined } from "@ant-design/icons";
import { Button, message, Modal, Upload, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload/interface";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BeforeUploadValueType, PostCosConf, uploadOSSDir, uploadStyle, ExtendedUploadFile } from "@/request/interface";
import { getBase64 } from "@/request/lib";
import api from "./api";

interface OSSUploadProps {
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

const { Dragger } = Upload;

const OSSUploadBase = ({
    value = [],
    onChange,
    accept = "*",
    uploadDir = "upload",
    directory = false,
    multiple = false,
    maxCount = 50,
    listType = "picture-card",
    uploadStyle = "click",
}: OSSUploadProps) => {
    const { t } = useTranslation();

    const [OSSData, setOSSData] = useState<PostCosConf>();

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>(value as UploadFile[]);

    const init = useCallback(async () => {
        try {
            const result = await api.ossSignature({
                allowPrefix: `${uploadDir}/*`,
                username: "fwx",
                password: "123",
            });

            setOSSData(result as unknown as PostCosConf);
            // console.log(result)
        } catch (error) {
            message.error(error instanceof Error ? error.message : String(error));
        }
    }, [uploadDir]);

    useEffect(() => {
        init();
    }, [init]);

    const uploadProps: UploadProps = {
        action: "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com",
        listType,
        fileList: fileList,
        accept: accept as UploadProps["accept"],
        directory,
        multiple,
        maxCount,
        onPreview: (async (file: UploadFile) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile);
            }

            // console.log('preview file:', file, !file.url && !file.preview)

            setPreviewImage(file.url || (file.preview as string));
            setPreviewVisible(true);
            setPreviewTitle(file.name);
        }) as UploadProps["onPreview"],
        onChange: (({ fileList }) => {
            // console.log('OSS:', fileList)
            onChange?.([...fileList]);

            setFileList(fileList);
        }) as UploadProps["onChange"],
        onRemove: (file: UploadFile) => {
            const files = (value || []).filter(v => v.url !== file.url);

            if (onChange) {
                onChange?.(files);
            }
        },
        data: ((file: ExtendedUploadFile): PostCosConf => {
            return {
                ...(OSSData as PostCosConf),
                key: file.dist || "",
            };
        }) as unknown as UploadProps["data"],
        beforeUpload: ((file: RcFile): BeforeUploadValueType => {
            if (!OSSData) return false;

            const filename = file.uid + "_" + file.name;
            const tmpKey = OSSData.key?.substring(0, OSSData.key.lastIndexOf("*")) || "";

            const extendedFile = file as unknown as ExtendedUploadFile;
            extendedFile.dist = tmpKey + filename;
            extendedFile.url = "https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/" + extendedFile.dist;

            return file;
        }) as UploadProps["beforeUpload"],
    };

    const ListTypeOpsElement = () => {
        switch (listType) {
            case "picture":
                return (
                    <Button type="primary" icon={<FileImageOutlined />}>
                        Click Image to Upload
                    </Button>
                );
            case "picture-card":
                return (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                );
            case "text":
                return (
                    <Button type="primary" icon={<UploadOutlined />}>
                        Click to Upload
                    </Button>
                );
            default:
                return (
                    <Button type="primary" icon={<UploadOutlined />}>
                        Click to Upload
                    </Button>
                );
        }
    };

    const UploadStyleElement = () => {
        switch (uploadStyle) {
            case "click":
                return <Upload {...uploadProps}>{fileList.length >= maxCount ? null : ListTypeOpsElement()}</Upload>;
            case "dragger":
                return (
                    <Dragger
                        {...uploadProps}
                        onDrop={e => {
                            console.log("Dropped files", e.dataTransfer.files);
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">{t("component.ossupload.dragger.title")}</p>
                        <p className="ant-upload-hint">{t("component.ossupload.dragger.body")}</p>
                    </Dragger>
                );
            default:
                return <Upload {...uploadProps}>{fileList.length >= maxCount ? null : ListTypeOpsElement()}</Upload>;
        }
    };

    return (
        <>
            {UploadStyleElement()}
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </>
    );
};

export default OSSUploadBase;
