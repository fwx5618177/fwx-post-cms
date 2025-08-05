import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import api from "../api";
import { RouteItem, ContentItem, FormValues, UpdateFormValues, SelectOption } from "../types";

/**
 * 表单数据管理Hook
 * 管理路由列表、内容列表等数据的获取和更新
 */
export const useFormData = () => {
    const [routeList, setRouteList] = useState<SelectOption[]>([]);
    const [versions, setVersions] = useState<SelectOption[]>([]);
    const [loadStatus, setLoadStatus] = useState<boolean>(false);
    const [detailInfos, setDetailInfos] = useState<ContentItem | null>(null);

    // 获取路由列表
    const queryRouteList = useCallback(async () => {
        try {
            const result = (await api.queryRouteList({})) as RouteItem[];

            if (result && Array.isArray(result) && result.length > 0) {
                const items: SelectOption[] = result.map(item => ({
                    label: item.label,
                    value: item.key,
                }));
                setRouteList(items);
            } else {
                setRouteList([]);
            }
        } catch (error) {
            console.error("Failed to fetch route list:", error);
            setRouteList([]);
            message.error("获取路由列表失败");
        }
    }, []);

    // 获取内容列表
    const queryContentList = useCallback(async () => {
        try {
            const result = await api.list();

            if (result && Array.isArray(result) && result.length > 0) {
                const data: SelectOption[] = result.map(item => ({
                    label: `${item?.title} - ${item?.routekeyname}`,
                    value: item?.title,
                }));
                setVersions(data);
            } else {
                setVersions([]);
            }
        } catch (error) {
            console.error("Failed to fetch content list:", error);
            setVersions([]);
            message.error("获取内容列表失败");
        }
    }, []);

    // 获取详细信息
    const getDetailInfo = useCallback(async (title: string): Promise<ContentItem | null> => {
        try {
            const result = await api.detail(title);

            if (result && Array.isArray(result) && result.length > 0) {
                const data = result[0];
                setDetailInfos(data);
                return data;
            } else {
                setDetailInfos(null);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch detail info:", error);
            setDetailInfos(null);
            message.error("获取详细信息失败");
            return null;
        }
    }, []);

    // 创建内容
    const createContent = useCallback(
        async (values: FormValues): Promise<boolean> => {
            try {
                const { content, title, name } = values;
                const contentConf = {
                    content,
                    title,
                    routekeyname: name,
                };

                const result = await api.createContent(contentConf);

                if (result && Array.isArray(result) && result.length > 0) {
                    message.success("添加成功!");
                    // 重新获取内容列表
                    await queryContentList();
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Failed to create content:", error);
                message.error("添加失败，请重试");
                return false;
            }
        },
        [queryContentList],
    );

    // 更新内容
    const updateContent = useCallback(
        async (values: UpdateFormValues): Promise<boolean> => {
            try {
                const { title, updateContent } = values;
                const result = await api.updateContent({
                    title,
                    content: updateContent,
                });

                if (result) {
                    message.success("更新成功!");
                    // 重新获取内容列表
                    await queryContentList();
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Failed to update content:", error);
                message.error("更新失败，请重试");
                return false;
            }
        },
        [queryContentList],
    );

    // 初始化数据
    useEffect(() => {
        queryRouteList();
        queryContentList();
    }, [queryRouteList, queryContentList]);

    return {
        routeList,
        versions,
        loadStatus,
        detailInfos,
        setLoadStatus,
        queryRouteList,
        queryContentList,
        getDetailInfo,
        createContent,
        updateContent,
    };
};
