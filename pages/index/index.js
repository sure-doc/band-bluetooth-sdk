const bandBluetoothSdk = require('band-bluetooth-sdk');

const InitConnectionState = {
  connecting: false,
  connected: false,
};

Page({
  data: {
    /** 已连接设备 */
    connectedDevices: [],
    /** 设备连接状态： { [mac]: { connecting: boolean, connected: boolean } } */
    _connectionStateMap: {},
  },

  /** 初始化 */
  onLoad() {
    bandBluetoothSdk.onInitialized(() => {
      console.info('初始化完成');
      this._listenConnectionStateChange();
      this._listenDataUpload();
    });
  },
  /** 扫码绑定 */
  scanQrcodeBind() {
    wx.navigateTo({
      url: '/pages/bind/scan-qrcode/index',
    });
  },

  /** 扫描设备 */
  scanDevice() {
    wx.navigateTo({
      url: '/pages/scan-device/index',
    });
  },

  /** 查看当前连接的设备 */
  getConnectedDevice() {
    wx.navigateTo({
      url: '/pages/device/connectDevices/index',
    });
  },
  /** 查看已连接/已配对设备 */
  getMobileConnectDevice() {
    wx.navigateTo({
      url: '/pages/device/mobileConnectDevices/index',
    });
  },

  /** 查看当前已扫描到的设备 */
  getScanDevice() {
    wx.navigateTo({
      url: '/pages/device/scanDevices/index',
    });
  },

  /** 断开连接 */
  disconnectDevice(event) {
    const { mac } = event.currentTarget.dataset;
    console.info(`断开连接设备 mac=${mac}`);
    bandBluetoothSdk.disconnectDevice({ mac });
    bandBluetoothSdk.getConnectedDevices();
  },

  /** 跳转到设备详情 */
  navigateDeviceDetail(event) {
    const { mac } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/device/index?mac=${mac}`,
    });
  },

  /** 跳转系统微信授权管理页 */
  openAppAuthorizeSetting() {
    wx.openAppAuthorizeSetting();
  },

  /** 跳转系统蓝牙设置页 */
  openSystemBluetoothSetting() {
    wx.openSystemBluetoothSetting();
  },

  /** 检查蓝牙 */
  async checkBluetooth() {
    if (wx.getSetting) {
      const setting = await new Promise((resolve) => {
        wx.getSetting({ success: resolve });
      });

      const { authSetting } = setting;

      console.info('setting', setting);

      if (authSetting['scope.bluetooth'] === false) {
        wx.showModal({ content: '请允许小程序使用蓝牙', showCancel: false });
        return;
      }
      if (authSetting['scope.userLocation'] === false) {
        wx.showModal({ content: '请允许小程序使用定位', showCancel: false });
        return;
      }
    }

    if (wx.getAppAuthorizeSetting) {
      const appAuthorizeSetting = wx.getAppAuthorizeSetting();
      const { bluetoothAuthorized, locationAuthorized } = appAuthorizeSetting;

      if (bluetoothAuthorized === 'denied') {
        wx.showModal({ content: '请允许微信使用蓝牙', showCancel: false });
        return;
      }

      if (locationAuthorized === 'denied') {
        wx.showModal({ content: '请允许微信使用定位', showCancel: false });
        return;
      }
    }
    if (wx.getSystemSetting) {
      const { bluetoothEnabled, locationEnabled } = wx.getSystemSetting();

      if (!bluetoothEnabled) {
        wx.showModal({ content: '请打开系统蓝牙', showCancel: false });
        return;
      }
      if (!locationEnabled) {
        wx.showModal({ content: '请打开系统定位', showCancel: false });
        return;
      }
    }
  },

  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.info('res', res);
      },
    });
  },

  /** 监听连接状态变更 */
  _listenConnectionStateChange() {
    bandBluetoothSdk.onConnectionStateChange({
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

  /** 监听数据上传 */
  _listenDataUpload() {
    bandBluetoothSdk.onUploadData({
      onUpload: ({ mac, data }) => {
        if (data.type === 'normal') {
          console.info(`监听到普通数据上传 mac=${mac} normalData=${JSON.stringify(data)}`);
          return;
        }

        if (data.type === 'file') {
          console.info(`监听到文件数据上传 mac=${mac} fileData=${JSON.stringify(data)}`);
          return;
        }
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

    // connectedDevices
    const connectedDevices = this._getNextConnectedDevices(changedData);
    // console.log(connectedDevices);
    if (connectedDevices) nextData.connectedDevices = connectedDevices;

    this.setData(nextData);
  },

  _getNextConnectedDevices(changedData) {
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
