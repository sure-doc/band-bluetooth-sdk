const bandBluetoothSdk = require('band-bluetooth-sdk');

const InitConnectionState = {
  connecting: false,
  connected: false,
};

Page({
  data: {
    /** 扫描开关 */
    scanChecked: false,
    /** 扫描的设备 */
    scanDevices: [],
    /** 扫描的设备： { [mac]: scanDevice } */
    _scanDeviceMap: {},
    /** 设备连接状态： { [mac]: { connecting: boolean, connected: boolean } } */
    _connectionStateMap: {},
  },

  onLoad() {
    bandBluetoothSdk.onInitialized(() => {
      console.info('初始化完成');
      this._listenConnectionStateChange();
    });
  },

  onUnload() {
    // 停止扫描
    this.stopScanDevice?.();
    // 取消监听状态变更
    this.offConnectionStateChange?.();
  },

  /** 切换扫描开关 */
  switchScan(event) {
    const checked = event.detail.value;
    this._setData({ scanChecked: checked });

    // 开始扫描
    if (checked) {
      this.stopScanDevice = bandBluetoothSdk.scanDevice({
        onDeviceFound: (device) => {
          console.info('扫描到设备', device);
          this._setScanDevice(device);
        },
      });
    }
    // 停止扫描
    else {
      this.stopScanDevice?.();
    }
  },

  /** 连接设备 */
  connectDevice(event) {
    const { device } = event.currentTarget.dataset;
    console.info(`连接设备 mac=${device.mac}`);
    bandBluetoothSdk.connectDevice({
      mac: device.mac,
    });
  },

  /** 断开连接 */
  disconnectDevice(event) {
    const { mac } = event.currentTarget.dataset;
    console.info(`断开连接设备 mac=${mac}`);
    bandBluetoothSdk.disconnectDevice({ mac });
  },

  /** 监听连接状态变更 */
  _listenConnectionStateChange() {
    this.offConnectionStateChange = bandBluetoothSdk.onConnectionStateChange({
      onChange: (result) => {
        console.info(
          `连接状态变更，mac=${result.mac}, state=${JSON.stringify(result.state)}, prevState=${JSON.stringify(
            result.prevState,
          )}`,
        );
        this._setConnectionState(result);
      },
    });
  },

  /** 设置设备 */
  _setScanDevice(device) {
    this._setData({
      _scanDeviceMap: {
        ...this.data._scanDeviceMap,
        [device.mac]: device,
      },
    });
  },

  /** 更新设备状态 */
  _setConnectionState({ mac, state, prevState }) {
    this._setData({
      _connectionStateMap: { ...this.data._connectionStateMap, [mac]: state },
    });
  },

  _setData(changedData) {
    const nextData = { ...changedData };

    // scanDevices
    const scanDevices = this._getNextScanDevices(changedData);
    if (scanDevices) nextData.scanDevices = scanDevices;

    this.setData(nextData);
  },

  _getNextScanDevices(changedData) {
    if (!changedData._scanDeviceMap && !changedData._connectionStateMap) return;

    const { _scanDeviceMap, _connectionStateMap } = { ...this.data, ...changedData };

    return Object.values(_scanDeviceMap).map((device) => {
      return {
        ...device,
        state: _connectionStateMap[device.mac] ?? InitConnectionState,
      };
    });
  },
});
