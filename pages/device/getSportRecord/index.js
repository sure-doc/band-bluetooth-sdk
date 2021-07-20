const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sportIds: undefined,
  },
  async onLoad({ mac }) {
    this.mac = mac;
    this.getSportIds();
  },

  dataTypeChange(e) {
    this.dataType = Number(e.detail.value);
  },

  async getSportIds() {
    try {
      console.info(`获取运动记录集合 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在获取运动记录集合', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetSportRecordList',
        data: {
          // 7 天内
          startTime: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
          endTime: new Date().getTime(),
        },
      });

      this.setData({
        sportIds: resp.sportIds,
      });

      console.info(`获取运动记录集合 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();

      wx.showToast({
        title: '获取运动记录集合 成功',
      });
    } catch (error) {
      console.error(`获取运动记录集合 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取运动记录集合 发生异常', icon: 'error' });
    }
  },

  async getSportDetail(event) {
    try {
      const { sportId } = event.currentTarget.dataset;

      console.info(`获取运动记录详情 mac=${this.mac}, sportId=${sportId} 开始`);
      wx.showLoading({ title: '正在获取运动记录详情', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetSportRecordFile',
        data: {
          sportId,
        },
      });

      this.setData({
        sportIds: resp.sportIds,
      });

      console.info(`获取运动记录详情 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();

      wx.showModal({
        title: '获取运动记录详情 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`获取运动记录详情 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取运动记录详情 发生异常', icon: 'error' });
    }
  },
});
