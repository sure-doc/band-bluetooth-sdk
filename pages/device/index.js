const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  data: {},

  /** 初始化 */
  onLoad(query) {
    this.mac = query.mac;
  },

  /** 绑定设备 */
  bindDevice() {
    wx.navigateTo({
      url: `bind/index?mac=${this.mac}`,
    });
  },

  /** 开启同步 */
  async startSync() {
    console.info(`开启同步 mac=${this.mac}`);
    await bandBluetoothSdk.startDataSync({
      mac: this.mac,
    });

    const resp = await bandBluetoothSdk.requestDevice({
      mac: this.mac,
      requestType: 'GetDeviceInfo',
    });

    console.info(`获取设备信息结果: ${JSON.stringify(resp)}`);
  },
});
