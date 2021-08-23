## [0.0.1-alpha.20]

### Added

- 解析新增日常汇总数据

## [0.0.1-alpha.19]

### Added

- 解析点测血氧

### Improved

- connectDevice 安卓连接设备，内部查找设备逻辑优化
- connectDevice 优化发生异常是错误信息

## [0.0.1-alpha.18]

### Added

- add `repository`, `homepage`

## [0.0.1-alpha.17]

### Added

- add `README.md`

## [0.0.1-alpha.16]

### Changed

- `requestDevice` api `requestType='GetSportRecordList'`

  - `data` 字段修改:

    `StartTime` 修改为 `startTime`, 由单位 秒 修改为 毫秒

    `EndTime` 修改为 `endTime`, 由单位 秒 修改为 毫秒

  - 返回值修改：
    `{ SportIds: [] }` 修改为 `{ sportIds: [] }`

  ```ts
  // 修改前
  const resp = await requestDevice({
    mac: 'AAAAAAAAAAAA',
    requestType: 'GetSportRecordList',
    data: {
      StartTime: Math.round(new Date().getTime() - 3600), // 秒
      EndTime: Math.round(new Date().getTime()), // 秒
    },
  });

  console.info(resp.SportIds);

  // 修改后
  const resp = await requestDevice({
    mac: 'AAAAAAAAAAAA',
    requestType: 'GetSportRecordList',
    data: {
      // StartTime 修改为 startTime
      startTime: new Date().getTime() - 3600000, // 毫秒
      // EndTime 修改为 endTime
      endTime: dayjs().valueOf(), // 毫秒
    },
  });

  console.info(resp.sportIds);
  ```

- `requestDevice` api `requestType='GetSportRecordList'`

  - `data` 字段修改: `SportIds` 修改为 `sportId`

  ```ts
  // 修改前
  await requestDevice({
    mac,
    requestType: 'GetSportRecordFile',
    data: { SportIds: sportId },
  });

  // 修改后
  await requestDevice({
    mac,
    requestType: 'GetSportRecordFile',
    data: { sportId: sportId },
  });
  ```

## [0.0.1-alpha.15]

### Changed

- `requestDevice` api 的 `requestType` 参数: `GetBloodOxygenOSetting` 更正为 `GetBloodOxygenSetting`
- `requestDevice` api 的 `requestType` 参数: `SetBloodOxygenOSetting` 更正为 `SetBloodOxygenSetting`

## [0.0.1-alpha.12]

### Changed

- 支持新版本广播协议

---

### Added 新添加的功能

### Changed 对现有功能的变更

### Removed 已经移除的功能

### Fixed 对 bug 的修复

### Improved 优化现有功能
