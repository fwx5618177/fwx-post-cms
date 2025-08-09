/**
 * API 迁移工具函数
 * 帮助识别和迁移旧的 API 调用
 */

/**
 * 检查文件是否使用了旧的 API 结构
 * @param filePath 文件路径
 * @returns 是否需要迁移
 */
export function needsMigration(filePath: string): boolean {
    // 检查是否导入了相对路径的 api
    const deprecatedPatterns = [
        /import.*api.*from.*['"]\.\/api['"]/,
        /import.*api.*from.*['"]\.\.\/api['"]/,
        /from.*['"]@\/request\/lib['"]/,
        /from.*['"]@\/request\/interface['"]/,
        /from.*['"]@\/request\/IRequest['"]/,
    ];

    // 这里应该实际读取文件内容并检查
    // 目前只是示例函数
    return deprecatedPatterns.some(pattern =>
        // 实际实现中需要读取文件内容
        pattern.test(filePath),
    );
}

/**
 * 迁移建议映射
 */
export const migrationSuggestions = {
    // 文章相关
    "/api/content/list": "articleApi.list()",
    "/api/content/detail": "articleApi.detail(id)",
    "/api/content/create": "articleApi.create(params)",

    // OSS 相关
    "/api/oss/signature": "ossApi.signature(params)",
    "/api/oss/upload": "ossApi.uploadToOSS(params)",
    "/api/oss/delete": "ossApi.deleteOSSFile(filename)",

    // 路由相关
    "/api/route/list": "routeApi.queryList(params)",
    "/api/route/createRoute": 'commonApi.post("/api/route/createRoute", params)',

    // 城市相关
    "/api/city/list": "cityApi.list()",
    "/api/model/list": "cityApi.list()",

    // Todo 相关
    "/api/todo/list": 'commonApi.get("/api/todo/list")',

    // 源码相关
    "/api/sourcelook/sourcecode": "sourceApi.submit(params)",
};

/**
 * 获取迁移建议
 * @param apiPath API 路径
 * @returns 迁移建议
 */
export function getMigrationSuggestion(apiPath: string): string {
    return migrationSuggestions[apiPath] || `commonApi.get("${apiPath}")`;
}

/**
 * 需要迁移的文件列表
 */
export const filesToMigrate = [
    {
        file: "src/components/instro.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 articleApi.detail(id) 从 @/services/api",
        priority: "medium",
    },
    {
        file: "src/components/list/index.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 commonApi 从 @/services/api",
        priority: "low",
    },
    {
        file: "src/components/dashboard/menucontent/hooks/useFormData.ts",
        issue: "使用 ../api 导入",
        suggestion: "改用 menuApi 从 @/services/api",
        priority: "medium",
    },
    {
        file: "src/components/dashboard/ossupload/index.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 commonApi.post 从 @/services/api",
        priority: "low",
    },
    {
        file: "src/components/dashboard/sidemenu/index.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 routeApi 和 commonApi 从 @/services/api",
        priority: "medium",
    },
    {
        file: "src/components/model/city/index.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 cityApi.list() 从 @/services/api",
        priority: "low",
    },
    {
        file: "src/components/OssUpload.tsx",
        issue: "使用 ./api 导入",
        suggestion: "改用 ossApi 从 @/services/api 或 @/utils/oss",
        priority: "high",
    },
    {
        file: "src/components/OssUpload/hooks/useOSSUpload.ts",
        issue: "使用 ../api 导入",
        suggestion: "改用 ossApi 从 @/services/api",
        priority: "high",
    },
];

/**
 * 打印迁移报告
 */
export function printMigrationReport(): void {
    console.log("=== API 迁移报告 ===\n");

    const highPriority = filesToMigrate.filter(f => f.priority === "high");
    const mediumPriority = filesToMigrate.filter(f => f.priority === "medium");
    const lowPriority = filesToMigrate.filter(f => f.priority === "low");

    if (highPriority.length > 0) {
        console.log("🔴 高优先级（建议优先迁移）:");
        highPriority.forEach(item => {
            console.log(`  - ${item.file}`);
            console.log(`    问题: ${item.issue}`);
            console.log(`    建议: ${item.suggestion}\n`);
        });
    }

    if (mediumPriority.length > 0) {
        console.log("🟡 中优先级:");
        mediumPriority.forEach(item => {
            console.log(`  - ${item.file}`);
            console.log(`    问题: ${item.issue}`);
            console.log(`    建议: ${item.suggestion}\n`);
        });
    }

    if (lowPriority.length > 0) {
        console.log("🟢 低优先级:");
        lowPriority.forEach(item => {
            console.log(`  - ${item.file}`);
            console.log(`    问题: ${item.issue}`);
            console.log(`    建议: ${item.suggestion}\n`);
        });
    }

    console.log(`总计需要迁移 ${filesToMigrate.length} 个文件`);
    console.log("详细迁移指南请查看: src/services/README.md");
}
