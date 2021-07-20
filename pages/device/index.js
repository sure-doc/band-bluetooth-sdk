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
    try {
      console.info(`开启同步 mac=${this.mac}`);
      wx.showLoading({ title: '正在开启同步', mask: true });
      await bandBluetoothSdk.startDataSync({
        mac: this.mac,
      });
      console.info(`开启同步 mac=${this.mac} 成功`);
      wx.hideLoading();
      wx.showToast({ title: '开启同步 成功' });
    } catch (error) {
      console.error(`开启同步 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '开启同步 失败', icon: 'error' });
    }
  },

  /** 获取设备信息 */
  async getDeviceInfo() {
    try {
      console.info(`获取设备信息 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在获取设备信息', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetDeviceInfo',
      });

      console.info(`获取设备信息 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();
      wx.showModal({
        title: '获取设备信息 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`获取设备信息 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取设备信息 失败', icon: 'error' });
    }
  },

  /** 获取心率配置 */
  async getHrSetting() {
    try {
      console.info(`获取心率配置 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在获取心率配置', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetHrSetting',
      });

      console.info(`获取心率配置 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();
      wx.showModal({
        title: '获取心率配置 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`获取心率配置 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取心率配置 失败', icon: 'error' });
    }
  },

  /** 设置心率配置 */
  async setHrSetting() {
    try {
      console.info(`设置心率配置 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在设置心率配置', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'SetHrSetting',
        data: {
          // 手环日常心率检测开关
          hrSwitch: 2,
          // 手环日常心率周期检测间隔（单位：s）
          hrInterval: 5 * 60, // 5分钟

          // 日常最大心率预警开关
          hrDailyWarnSwitch: 2,
          // 日常最大心率预警值
          hrDailyWarnValue: 120,

          // 运动最大心率预警开关
          hrSportWarnSwitch: 2,
          // 运动最大心率预警值
          hrSportWarnValue: 160,
        },
      });

      console.info(`设置心率配置 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();

      wx.showModal({
        title: '设置心率配置 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`设置心率配置 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '设置心率配置 失败', icon: 'error' });
    }
  },

  /** 获取血氧配置 */
  async getBloodOxygenSetting() {
    try {
      console.info(`获取血氧配置 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在获取血氧配置', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'GetBloodOxygenSetting',
      });

      console.info(`获取血氧配置 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();
      wx.showModal({
        title: '获取血氧配置 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`获取血氧配置 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '获取血氧配置 失败', icon: 'error' });
    }
  },

  /** 设置血氧配置 */
  async setBloodOxygenSetting() {
    try {
      console.info(`设置血氧配置 mac=${this.mac} 开始`);
      wx.showLoading({ title: '正在设置血氧配置', mask: true });

      const resp = await bandBluetoothSdk.requestDevice({
        mac: this.mac,
        requestType: 'SetBloodOxygenSetting',
        data: {
          /** 手环血氧检测类型 */
          type: 0,
          /** 手环血氧检测类型开关 */
          switch: true,
          /** 手环血氧周期检测间隔（单位s） */
          interval: 5 * 60,
        },
      });

      console.info(`设置血氧配置 mac=${this.mac} 结果: `, resp);
      wx.hideLoading();

      wx.showModal({
        title: '设置血氧配置 结果',
        content: JSON.stringify(resp),
        showCancel: false,
      });
    } catch (error) {
      console.error(`设置血氧配置 mac=${this.mac} 发生异常: `, error);
      wx.hideLoading();
      wx.showToast({ title: '设置血氧配置 失败', icon: 'error' });
    }
  },

  /** 获取日常数据记录 */
  getDailyRecordData() {
    wx.navigateTo({
      url: `getDailyRecord/index?mac=${this.mac}`,
    });
  },

  /** 获取运动记录 */
  getSportRecord() {
    wx.navigateTo({
      url: `getSportRecord/index?mac=${this.mac}`,
    });
  },
});
