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

  // Optional: include modules manually if needed
  dependencies: {
    // Example: force Reanimated to be autolinked
    'react-native-reanimated': {
      root: path.resolve(__dirname, 'node_modules/react-native-reanimated'),
    },
  },
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
