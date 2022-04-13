const bandBluetoothSdk = require('band-bluetooth-sdk');

bandBluetoothSdk.init({
  logger: {
    level: 'debug',
    method: ({ methodName, loggerName }, ...msgs) => {
      console.info(`[${new Date().getTime()}][${loggerName}][${methodName}]`, ...msgs);
    },
  },
});

// app.js
App({
  onLaunch() {},
  globalData: {
    userInfo: null,
  },
});
