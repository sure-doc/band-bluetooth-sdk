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
    /** 已连接设备 */
    connectedDevices: [],
    /** 扫描的设备： { [mac]: scanDevice } */
    _scanDeviceMap: {},
    /** 设备连接状态： { [mac]: { connecting: boolean, connected: boolean } } */
    _connectionStateMap: {},
  },

  /** 初始化 */
  onLoad() {
    bandBluetoothSdk.onInitialized(() => {
      console.info('初始化完成');
      this._listenConnectionStateChange();
    });
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
    console.info('连接设备', device);
    bandBluetoothSdk.connectDevice({
      mac: device.mac,
    });
  },

  /** 连接设备 */
  disconnectDevice(event) {
    console.info('断开连接设备', device);
  },

  /** 监听连接状态变更 */
  _listenConnectionStateChange() {
    bandBluetoothSdk.onConnectionStateChange({
      onChange: (result) => {
        console.info(
          `连接状态变更，mac=${result.mac}, state=${JSON.stringify(result.state)}, prevState=${JSON.stringify(result.prevState)}`
        );
        this._setDeviceState(result);
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
  _setDeviceState({ mac, state, prevState }) {
    this._setData({
      _connectionStateMap: { ...this.data._connectionStateMap, [mac]: state },
    });
  },

  _setData(changedData) {
    const nextData = { ...changedData };

    const scanDevices = this._getScanDevices(changedData);
    if (scanDevices) nextData.scanDevices = scanDevices;

    const connectedDevices = this._getConnectedDevices(changedData);
    if (connectedDevices) nextData.connectedDevices = connectedDevices;

    console.info('nextData', nextData);
    this.setData(nextData);
  },

  _getScanDevices(changedData) {
    if (!changedData._scanDeviceMap && !changedData._connectionStateMap) return;

    const { _scanDeviceMap, _connectionStateMap } = { ...this.data, ...changedData };

    return Object.values(_scanDeviceMap).map((device) => {
      return {
        ...device,
        state: _connectionStateMap[device.mac] ?? InitConnectionState,
      };
    });
  },

  _getConnectedDevices(changedData) {
    if (!changedData._connectionStateMap) return;

    const { _connectionStateMap } = changedData;

    return Object.keys(_connectionStateMap)
      .map((mac) => {
        const state = _connectionStateMap[mac];
        return state.connected ? { mac } : undefined;
      })
      .filter((item) => !!item);
  },
});
