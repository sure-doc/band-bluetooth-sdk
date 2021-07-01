const bandBluetoothSdk = require('band-bluetooth-sdk');

Page({
  data: {
    state: 'loading',
    error: undefined,
    success: false,
  },

  /** 初始化 */
  async onLoad() {
    let scanRes;
    try {
      scanRes = await new Promise((resolve, reject) => {
        wx.scanCode({
          scanType: ['qrCode'],
          success: resolve,
          fail: reject,
        });
      });
    } catch (error) {
      wx.navigateBack();
      return;
    }
    console.info('扫描结果', scanRes);
    const { mac } = bandBluetoothSdk.parseQrcode(scanRes.result);

    let result;
    try {
      result = await bandBluetoothSdk.connectAndBindDevice({
        mac,
        // 监听状态变更
        onStateChange: ({ state }) => {
          console.info('onStateChange', state);
          this.setData({ state });
        },
        // 确认绑定，返回绑定结果给手环
        onConfirmBind: async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 300);
          });

          // 如果失败则返回：
          // return {
          //   success: false,
          //   errorMsg: '绑定失败了',
          // };

          return {
            success: true,
          };
        },
      });
    } catch (error) {
      this.setData({
        error: {
          code: error.code,
          msg: error.message,
        },
      });
      return;
    }
    console.info(`请求绑定成功: ${JSON.stringify(resp)}`);
    this.setData({
      success: true,
    });
  },

  _setData(changedData) {
    const nextData = { ...changedData };

    this.setData(nextData);
  },
});
