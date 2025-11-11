const path = require('path');

module.exports = {
  reactNativePath: path.resolve(__dirname, 'node_modules/react-native'),

  project: {
    ios: {},
    android: {
      packageName: 'com.lightawakereimagined',
      sourceDir: './android/app',
    },
  },

  assets: ['./assets/fonts'],
};


// module.exports = {
//   reactNativePath: '.',
//   project: {
//     ios: {},
//     android: {
//       packageName: 'com.lightawakereimagined',
//       sourceDir: './android/app',
//     },
//   },
//   assets: ['./assets/fonts'],
// };
