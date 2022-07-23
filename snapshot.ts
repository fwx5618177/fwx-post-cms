export default {
  // 从测试解析到快照路径
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace("__tests__", "__snapshots__") + snapshotExtension,

  // 从快照解析到测试路径
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace("__snapshots__", "__tests__")
      .slice(0, -snapshotExtension.length),

  // 示例测试路径，用于上述实现的预检一致性检查
  testPathForConsistencyCheck: "some/__tests__/example.test.js",
};
