- [安装](#安装)
- [`band-bluetooth-sdk` 更新日志](docs/VERSIONS.md)
- [demo 更新日志](CHANGELOG.md)
- Api

  - 初始化
    - [初始化-init](#初始化-init)
    - [监听初始化完成-onInitialized](#监听初始化完成-oninitialized)
  - 扫描设备
    - [扫描设备-scanDevice](#扫描设备-scandevice)
    - [获取扫描到的设备信息-getScanDevices](#获取扫描到的设备信息-getscandevices)
  - 连接
    - [连接设备-connectDevice](#连接设备-connectdevice)
    - [断开连接-disconnectDevice](#断开连接-disconnectdevice)
    - [获取设备连接状态-getConnectionState](#获取设备连接状态-getconnectionstate)
    - [监听设备连接状态变更-onConnectionStateChange](#监听设备连接状态变更-onconnectionstatechange)
    - [获取已连接设备信息-getConnectedDevices](#获取已连接设备信息-getconnecteddevices)
    - [获取手机已连接设备信息-getMobileDeviceMac](#获取手机已连接设备信息-getmobiledevicemac)
  - 绑定/解绑
    - [请求绑定-bindDevice](#请求绑定-binddevice)
    - [连接并请求绑定-connectAndBindDevice](#连接并请求绑定-connectandbinddevice)
    - [解除绑定-unbindDevice](#解除绑定-unbinddevice)
  - 数据
    - [开启数据同步-startDataSync](#开启数据同步-startdatasync)
    - [监听数据同步-onUploadData](#监听数据同步-onuploaddata)
  - [发送请求-requestDevice](#发送请求-requestdevice)
    - [发送请求-说明](#发送请求-说明)
    - [发送请求-错误码](#发送请求-错误码)
    - [获取绑定信息-requestType=GetBindInfo](#获取绑定信息-requesttypegetbindinfo)
    - [获取设备信息-requestType=GetDeviceInfo](#获取设备信息-requesttypegetdeviceinfo)
    - [获取心率配置-requestType=GetHrSetting](#获取心率配置-requesttypegethrsetting)
    - [设置心率配置-requestType=SetHrSetting](#设置心率配置-requesttypesethrsetting)
    - [获取血氧配置-requestType=GetBloodOxygenSetting](#获取血氧配置-requesttypegetbloodoxygensetting)
    - [设置血氧配置-requestType=SetBloodOxygenSetting](#设置血氧配置-requesttypesetbloodoxygensetting)
    - [获取运动记录集合-requestType=GetSportRecordList](#获取运动记录集合-requesttypegetsportrecordlist)
    - [获取运动记录详情-requestType=GetSportRecordFile](#获取运动记录详情-requesttypegetsportrecordfile)
  - [ota\_升级-startUpgrade](#ota_升级-startUpgrade)
  - 其他
    - [解析二维码-parseQrcode](#解析二维码-parseqrcode)

---

### 安装

yarn:

```bash
yarn add band-bluetooth-sdk
```

npm:

```bash
npm install band-bluetooth-sdk
```

### 初始化-init

```js
import { init } from 'band-bluetooth-sdk';

init({
  // 可选
  logger: {
    /**
     * trace/debug/info/warn/error
     **/
    level: 'debug', // 默认 warn
    method: (
      {
        /** trace/debug/info/warn/error */
        methodName,
        /**
         * TRACE: 0;
         * DEBUG: 1;
         * INFO: 2;
         * WARN: 3;
         * ERROR: 4;
         * SILENT: 5;
         */
        logLevel,
        /** 内部调用 logger 的名称 */
        loggerName,
        /** 内置的输出日志方法 */
        loggingMethod,
      },
      ...msgs
    ) => {
      console[methodName](`${loggerName}-${logLevel}`, ...msgs);
      // 或者
      loggingMethod(`${methodName}-${loggerName}-${logLevel}`, ...msgs);
    },
  },
});
```

### 监听初始化完成-onInitialized

```js
import { onInitialized } from 'band-bluetooth-sdk';

// 如果已初始化则立即执行
onInitialized(() => {
  console.info('initialized');
});
```

### 扫描设备-scanDevice

```js
import { scanDevice } from 'band-bluetooth-sdk';

const stopScanDevice = scanDevice({
  /** 搜索指定 mac，默认空，扫描所有设备 */
  mac: 'AAAAAAAAAAAA',
  /** 是否扫描到首个设备则停止扫描，默认 false */
  first: true,
  /** 超时时间 ms, 默认不超时 */
  timeout: 10 * 1000;
  /** 扫描到设备回调 */
  onDeviceFound: (device) => {
    console.info('found device', device);
  },
});

// 停止扫描
stopScanDevice();
```

### 获取扫描到的设备信息-getScanDevices

```js
import { getScanDevices } from 'band-bluetooth-sdk';
const getScanDevices = getScanDevices();

console.info('getScanDevices', getScanDevices);
```

### 连接设备-connectDevice

```js
import { connectDevice } from 'band-bluetooth-sdk';

connectDevice({
  /** 搜索指定 mac，默认空，扫描所有设备 */
  mac: 'AAAAAAAAAAAA',
  /** 超时时间 ms, 默认 10 秒 */
  timeout: 10 * 1000;
});

```

### 获取已连接设备信息-getConnectedDevices

```js
import { getConnectedDevices } from 'band-bluetooth-sdk';
const getConnectedDevices = getConnectedDevices();
console.info('getConnectedDevices', getConnectedDevices);
```

### 断开连接-disconnectDevice

```js
import { disconnectDevice } from 'band-bluetooth-sdk';

disconnectDevice({
  /** 设备 mac */
  mac: 'AAAAAAAAAAAA',
});
```

### 获取设备连接状态-getConnectionState

```js
import { getConnectionState } from 'band-bluetooth-sdk';

const state = getConnectionState({
  /** 设备 mac */
  mac: 'AAAAAAAAAAAA',
});

console.info(state); // { connected: false, connecting: false }
```

### 获取手机已连接设备信息-getMobileDeviceMac

```js
import { getMobileDeviceMac } from 'band-bluetooth-sdk';
const getMobileDeviceMac = await getConnectedDevices();
console.info('getMobileDeviceMac', getMobileDeviceMac); // 安卓端需要手机触发连接后才可以获取，退出小程序后将会断开连接
```

### 断开连接-disconnectDevice

```js
import { disconnectDevice } from 'band-bluetooth-sdk';

disconnectDevice({
  /** 设备 mac */
  mac: 'AAAAAAAAAAAA',
});
```

### 监听设备连接状态变更-onConnectionStateChange

```ts
import { onConnectionStateChange } from 'band-bluetooth-sdk';

onConnectionStateChange({
  /** 监听指定 mac 设备变更，可选 */
  mac: 'AAAAAAAAAAAA',
  /** 变更回调 */
  onChange: (result) => {
    // 设备 mac
    console.info(result.mac)
    // 变更后 state
    console.info(result.state) // { connecting: true, connected: false }
    // 变更前 state
    console.info(result.prevState) // { connecting: false, connected: false }
  };
});

```

### 请求绑定-bindDevice

```ts
import { bindDevice } from 'band-bluetooth-sdk';

try {
  const resp = await bindDevice({
    mac: 'AAAAAAAAAAAA',
    // 绑定账号，解绑时传的 `bindUserId` 需要与绑定时传的 `userId` 一致
    userId: 'xxxx',
    // 监听状态变更
    onStateChange: ({ state }) => {
      console.info('onStateChange', state);
    },
    // 确认绑定，返回绑定结果给手环
    onConfirmBind: async () => {
      // 请求保存

      // 如果失败则返回：
      // return {
      //   success: false,
      //   errorMsg: '绑定失败了',
      // };

      return {
        success: true,
      };
    },
  });

  console.info('绑定成功', resp); // { state: 'success' }
} catch (error) {
  const code = error.code;
  const errorMessage = error.message;
  console.info('绑定失败', code, errorMessage);
}

// ---- bindDevice Error
export enum ErrorCode {
  /** 未知错误 */
  Unknown = 1,
  /** 找不到设备 */
  NotFoundDevice = 2,
  /** 设备未连接 */
  NotConnected = 3,
  /** 用户拒绝 */
  UserDeny = 4,
  /** 设备拒绝绑定，正在充电中 */
  DeviceCharging = 5,
  /** 设备拒绝绑定，已被其他用户绑定 */
  DeviceAlreadyBind = 6,
  /** onConfirmBind 发生异常 */
  OnConfirmBindError = 7,
  /** onConfirmBind 函数返回结果中 success 不为 true */
  OnConfirmBindResultNotSuccess = 8,
}
```

### 连接并请求绑定-connectAndBindDevice

```js
import { connectAndBindDevice } from 'band-bluetooth-sdk';

connectAndBindDevice({
  mac: 'AAAAAAAAAAAA',
  // ...参数与 bindDevice 一致
});
```

### 解除绑定-unbindDevice

```js
import { unbindDevice } from 'band-bluetooth-sdk';

- 注意：需要先调用 `开启数据同步-startDataSync`

unbindDevice({
  mac: 'AAAAAAAAAAAA',
  // 需要与绑定时传的 `userId` 一致
  bindUserId: 'xxxx',
});
```

### 开启数据同步-startDataSync

```js
import { startDataSync } from 'band-bluetooth-sdk';

startDataSync({
  /** 设备 mac */
  mac: 'AAAAAAAAAAAA',
  /**
   * 用户信息，可选
   */
  userInfo: {
    /** 体重，可选 */
    weight: 60,
    /** 身高，可选 */
    height: 170,
    /** 出生日期(时间戳 ms)，可选 */
    birthday: 11111111111,
    /** 年龄；不传时，如果传入出生日期，则根据出生日期计算 */
    age: 16,
    /** 性别, 男=1，女=0 */
    gender: 1,
    /** 用户昵称，可选 */
    nickName: 'myName',
  },
});
```

### 监听数据同步-onUploadData

```ts
import { onUploadData } from 'band-bluetooth-sdk';

onUploadData({
  onUpload: ({ mac, data }) => {
    if (data.type === 'normal') {
      console.info(data);
    }

    if (data.type === 'file') {
      console.info(data);
    }
  },
});

// 文件类型
interface NormalData {
  /** 类型 */
  type: 'normal';
  /** 时间戳 */
  ts: number;
  /** 类别 id */
  categoryId: number;
  /** 命令 id */
  commandId: number;
  /** 数据 **/
  data: any;
  /** 是否请求 */
  isReq: boolean;
  /** 是否响应 */
  isRsp: boolean;
  /** 序号 */
  seq: number;
}

// 文件类型
interface FileData {
  /** 类型 */
  type: 'normal';
  /** 时间戳 */
  ts: number;
  /** 文件名称 */
  fileName: string;
  /** 文件类型 */
  fileType: FileType;
  /** 文件头，不一定有 */
  fileHeader?: FileHeader;
  /** 文件列表 */
  fileList: any[];
}
```

## 发送请求-requestDevice

### 发送请求-说明

`requestDevice` 需要在执行完 [startDataSync](#开启数据同步-startDataSync) 之后执行

### 发送请求-错误码

1000000 成功  
1000001 未知错误  
1000002 内存申请失败  
1000003 错误的参数  
1000004 不支持的命令  
1000005 正忙  
1000006 pb 解码错误  
1000007 pb 编码错误  
1000008 传输层错误  
1000009 未绑定状态，不支持改操作  
1000010 文件不存在  
1000011 当前状态不支持该指令  
1003001 手机未打开定位服务  
1003002 手机无定位权限

### 获取绑定信息-requestType=GetBindInfo

````js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await bandBluetoothSdk.requestDevice({
  mac: this.mac,
  requestType: 'GetBindInfo',
});

/**
 *
 * ```
 * resp: {
 *   /** 是否被绑定 **/
 *   isBond?: boolean
 *   /** 绑定时间戳，单位秒 **/
 *   timestamp?: number
 *   /** 传入的 userId **/
 *   account?: string
 *   /** 6个字节设备mac地址 **/
 *   mac: string
 *   /** 6个字节被绑手机mac地址 **/
 *   masterMac: string
 * }
 * ```
 */
````

### 获取设备信息-requestType=GetDeviceInfo

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: 'AAAAAAAAAAAA',
  requestType: 'GetDeviceInfo',
});
```

### 获取心率配置-requestType=GetHrSetting

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: 'AAAAAAAAAAAA',
  requestType: 'GetHrSetting',
});
```

### 设置心率配置-requestType=SetHrSetting

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: 'AAAAAAAAAAAA',
  requestType: 'SetHrSetting',
  // 查看下方 HrSetting
  data: {
    ...
  },
});
```

```ts
/** 心率开关 */
enum HrSettingSwitch {
  Invalid = 0,
  Closed = 1,
  Opened = 2,
}

/**
 * 心率相关设置
 */
interface HrSetting {
  /** 手环日常心率检测开关 - HrSwitch */
  hrSwitch: HrSettingSwitch;
  /** 手环日常心率周期检测间隔（单位：s） - HrInterval */
  hrInterval: number;

  /** 日常最大心率预警开关 - HrDailyWarnEn */
  hrDailyWarnSwitch: HrSettingSwitch;
  /** 日常最大心率预警值 - HrDailyWarnVal */
  hrDailyWarnValue: number;

  /** 运动最大心率预警开关 - HrSportWarnEn */
  hrSportWarnSwitch: HrSettingSwitch;
  /** 运动最大心率预警值 - HrSportWarnVal */
  hrSportWarnValue: number;
}
```

### 获取血氧配置-requestType=GetBloodOxygenSetting

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: 'AAAAAAAAAAAA',
  requestType: 'GetBloodOxygenSetting',
});
```

### 设置血氧配置-requestType=SetBloodOxygenSetting

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: 'AAAAAAAAAAAA',
  requestType: 'SetBloodOxygenSetting',
  // 查看下方 BloodOxygenSetting
  data: {
    // ...
  },
});
```

```ts
/**
 * 手环血氧检测类型：
 * 0：睡眠血氧
 * 1：全天血氧 (暂不支持)
 */
enum BloodOxygenSettingType {
  /** 睡眠血氧 */
  SleepBloodOxygen = 0,
  /** 全天血氧 */
  AllDayBloodOxygen = 1,
}

/**
 * 血氧相关配置
 */
interface BloodOxygenSetting {
  /** 手环血氧检测类型 */
  type: BloodOxygenSettingType;
  /** 手环血氧检测类型开关 */
  switch: boolean;
  /** 手环血氧周期检测间隔（单位s） */
  interval: number;
}
```

### 获取日常记录数据-requestType=GetDailyRecordData

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: this.mac,
  requestType: 'GetDailyRecordData',
  data: {
    // 暂时只支持获取近期记录（与上一次上传间隔时间内的记录）
    recordType: 0,
    // 查看下方类型 DataType
    dataType: 0,
  },
});
```

```ts
enum RecordType {
  /** 近期记录（与上一次上传间隔时间内的心率记录） */
  Recent = 0,
}

enum DataType {
  /** 心率 */
  Hr = 0,
  /** 血氧 */
  BloodOxygen = 1,
  /** 睡眠 */
  Sleep = 2,
  /** 日常活动 */
  DailyActivity = 3,
  /** 日常活动及状态 */
  DailyActivityAndStatus = 4,
}
```

### 获取运动记录集合-requestType=GetSportRecordList

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: this.mac,
  requestType: 'GetSportRecordList',
  data: {
    /** 开始时间戳 ms */
    startTime: new Date().getTime() - 60 * 60 * 1000,
    /** 结束时间戳 ms */
    endTime: new Date().getTime(),
  },
});

// 返回运动记录 id 集合
console.info(resp.sportIds);
```

### 获取运动记录详情-requestType=GetSportRecordFile

```js
import { requestDevice } from 'band-bluetooth-sdk';

const resp = await requestDevice({
  mac: this.mac,
  requestType: 'GetSportRecordFile',
  data: {
    /** 通过 GetSportRecordList 获取到的运动记录 id */
    sportId: 'xxxxxxxxxxxx',
  },
});
```

### ota\_升级-startUpgrade

```js
import { startUpgrade } from 'band-bluetooth-sdk';

let cancel;

const startUpgradeRes = await startUpgrade({
  mac: 'xxxx',
  otaFile,
  onStateChange: (state) => {
    console.info(state);
  },
  onUploadFilePercent: (percent) => {
    console.info(percent);
  },
  canceler: (_cancel) => {
    cancel = _cancel;
  },
});

// 取消
cancel();
```

### 解析二维码-parseQrcode

```js
import { parseQrcode } from 'band-bluetooth-sdk';

const qrcode = '.....';
const qrcodeInfo = parseQrcode(qrcode);

console.info(qrcodeInfo); // { mac: '', sn: '' }
```
