const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  data: {
    connectedDevices: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow() {
    //  获取当前已连接设备信息
    this.setData({
      connectedDevices: bandBluetoothSdk.getConnectedDevices(),
    });
  },
});
