- [初始化-init](#初始化-init)
- [监听初始化完成-onInitialized](#监听初始化完成-oninitialized)
- [扫描设备-scanDevice](#扫描设备-scandevice)
- [连接设备-connectDevice](#连接设备-connectdevice)
- [监听设备连接状态变更-onConnectionStateChange](#监听设备连接状态变更-onconnectionstatechange)

### 初始化-init

```js
const { init } from 'band-bluetooth-sdk';

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
const { onInitialized } from 'band-bluetooth-sdk';

// 如果已初始化则立即执行
onInitialized(() => {
  console.info('initialized')
});

```

### 扫描设备-scanDevice

```js
const { scanDevice } from 'band-bluetooth-sdk';

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

### 连接设备-connectDevice

```js
const { connectDevice } from 'band-bluetooth-sdk';

connectDevice({
  /** 搜索指定 mac，默认空，扫描所有设备 */
  mac: 'xxxx',
  /** 超时时间 ms, 默认 10 秒 */
  timeout: 10 * 1000;
});

```

### 监听设备连接状态变更-onConnectionStateChange

```js
const { onConnectionStateChange } from 'band-bluetooth-sdk';

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
