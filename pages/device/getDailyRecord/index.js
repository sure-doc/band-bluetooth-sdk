const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataTypeOptions: [
      { value: 0, name: '心率' },
      { value: 1, name: '血氧' },
      { value: 2, name: '睡眠' },
      { value: 3, name: '日常活动' },
      { value: 4, name: '日常活动及状态' },
    ],
    dataType: 0,
  },
  async onLoad({ mac }) {
    this.mac = mac;
  },

  dataTypeChange(e) {
    this.dataType = Number(e.detail.value);
  },

  async getData() {
    try {
      console.info(`获取数据 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在获取数据', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetDailyRecordData',
        data: {
          recordType: 0, // 暂时只支持获取近期记录（与上一次上传间隔时间内的记录）
          dataType: this.dataType,
        },
      });

      console.info(`获取数据 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();

      wx.showModal({
        title: '获取数据 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`获取数据 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取数据 失败', icon: 'error' });
    }
  },
});
