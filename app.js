const bandBluetoothSdk = require('band-bluetooth-sdk');

bandBluetoothSdk.init();

// app.js
App({
  onLaunch() {},
  globalData: {
    userInfo: null,
  },
});
