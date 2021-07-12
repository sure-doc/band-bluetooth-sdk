- 安装
- Api
  - 初始化
    - [初始化-init](#初始化-init)
    - [监听初始化完成-onInitialized](#监听初始化完成-onInitialized)
  - 扫描设备
    - [扫描设备-scanDevice](#扫描设备-scandevice)
    - [获取扫描到的设备信息-getScanDevices](#获取扫描到的设备信息-getScanDevices)
  - 连接
    - [连接设备-connectDevice](#连接设备-connectDevice)
    - [断开连接-disconnectDevice](#断开连接-disconnectDevice)
    - [监听设备连接状态变更-onConnectionStateChange](#监听设备连接状态变更-onConnectionStateChange)
    - [获取已连接设备信息-getConnectedDevices](#获取已连接设备信息-getConnectedDevices)
    - [获取手机已连接设备信息-getMobileDeviceMac](#获取手机已连接设备信息-getMobileDeviceMac)
  - 绑定
    - [请求绑定-bindDevice](#请求绑定-bindDevice)
    - [连接并请求绑定-connectAndBindDevice](#连接并请求绑定-connectAndBindDevice)
  - 数据
    - [开启数据同步-startDataSync](#开启数据同步-startDataSync)
    - [监听数据同步-onUploadData](#监听数据同步-onUploadData)
  - 其他
    - [解析二维码-parseQrcode](#解析二维码-parseQrcode)

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
    level: 'debug', // 默认 warn
    method: ({ methodName, loggerName, logLevel, loggingMethod }, ...msgs) => {
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
  mac: 'xxxx',
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
  mac: 'xxxx',
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
  mac: 'xxxx',
});
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
  mac: 'xxxx',
});
```

### 监听设备连接状态变更-onConnectionStateChange

```ts
import { onConnectionStateChange } from 'band-bluetooth-sdk';

onConnectionStateChange({
  /** 监听指定 mac 设备变更，可选 */
  mac: 'xxxx',
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

---

### 请求绑定-bindDevice

```ts
import { bindDevice } from 'band-bluetooth-sdk';

try {
  const resp = await bindDevice({
    mac: '',
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
  mac: 'xxx',
  // ...参数与 bindDevice 一致
});
```

### 开启数据同步-startDataSync

```js
import { startDataSync } from 'band-bluetooth-sdk';

onConnectionStateChange({
  /** 设备 mac */
  mac: 'xxxx',
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

### 解析二维码-parseQrcode

```js
import { parseQrcode } from 'band-bluetooth-sdk';

const qrcode = '.....';
const qrcodeInfo = parseQrcode(qrcode);

console.info(qrcodeInfo); // { mac: '', sn: '' }
```
