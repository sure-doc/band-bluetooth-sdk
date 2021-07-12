const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  data: {
    mobileConnectedDevices: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  async onShow() {
    //  获取当前手机已连接设备信息
    const mobileConnectedDevices = await bandBluetoothSdk.getMobileDeviceMac();
    this.setData({
      mobileConnectedDevices,
    });
  },
});
