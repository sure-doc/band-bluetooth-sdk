const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  data: {
    mobileConnectedDevices: [],

    /** 设备连接状态： { [mac]: { connecting: boolean, connected: boolean } } */
    _connectionStateMap: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    bandBluetoothSdk.onInitialized(() => {
      console.info('初始化完成');
      this._listenConnectionStateChange();
    });
  },
  async onShow() {
    wx.showLoading({ title: '加载中' });
    //  获取当前手机已连接设备信息
    const mobileConnectedDevices = await bandBluetoothSdk.getMobileDeviceMac();

    // 初始化连接状态
    mobileConnectedDevices.forEach((device) => {
      const state = bandBluetoothSdk.getConnectionState({ mac: device.mac });
      this._setConnectionState({ mac: device.mac, state });
    });
    this._setData({
      mobileConnectedDevices,
    });
    wx.hideLoading();
  },

  onUnload() {
    // 取消监听状态变更
    this.offConnectionStateChange?.();
  },

  /** 连接设备 */
  connectDevice(event) {
    const { device } = event.currentTarget.dataset;
    console.info(`连接设备 mac=${device.mac}`);
    bandBluetoothSdk.connectDevice({
      mac: device.mac,
    });
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
        this._setConnectionState({ mac: result.mac, state: result.state });
      },
    });
  },

  /** 更新设备状态 */
  _setConnectionState({ mac, state }) {
    this._setData({
      _connectionStateMap: { ...this.data._connectionStateMap, [mac]: state },
    });
    bandBluetoothSdk.getConnectedDevices(mac);
  },

  _setData(changedData) {
    const nextData = { ...changedData };

    // scanDevices
    const mobileConnectedDevices = this._getMobileConnectedDevices(changedData);
    if (mobileConnectedDevices) nextData.mobileConnectedDevices = mobileConnectedDevices;

    this.setData(nextData);
  },

  _getMobileConnectedDevices(changedData) {
    if (!changedData.mobileConnectedDevices && !changedData._connectionStateMap) return;

    const { mobileConnectedDevices, _connectionStateMap } = { ...this.data, ...changedData };

    return mobileConnectedDevices.map((device) => {
      return {
        ...device,
        state: _connectionStateMap[device.mac] ?? InitConnectionState,
      };
    });
  },
});
