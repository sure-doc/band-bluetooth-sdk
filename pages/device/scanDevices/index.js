const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scanDevices: [],
  },

  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      scanDevices: bandBluetoothSdk.getScanDevices(),
    });
  },
});
