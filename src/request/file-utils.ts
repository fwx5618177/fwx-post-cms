/**
 * 将文件转换为base64格式
 * @param file 要转换的文件
 * @returns Promise<string> base64字符串
 */
export const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

/**
 * 验证文件类型
 * @param file 要验证的文件
 * @param acceptedTypes 接受的文件类型数组
 * @returns boolean 是否为接受的文件类型
 */
export const validateFileType = (file: File, acceptedTypes: string[]): boolean => {
    if (acceptedTypes.includes("*")) return true;

    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

    return acceptedTypes.some(type => {
        if (type.includes("/")) {
            // MIME type
            return fileType === type || fileType.startsWith(type.replace("*", ""));
        } else {
            // File extension
            return fileExtension === type.replace(".", "");
        }
    });
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns string 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 生成唯一文件名
 * @param originalName 原始文件名
 * @param prefix 前缀
 * @returns string 新的文件名
 */
export const generateUniqueFileName = (originalName: string, prefix = ""): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf("."));

    return `${prefix}${timestamp}_${random}${extension}`;
};
