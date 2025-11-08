module.exports = {
    presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: [
          '.js',
          '.jsx',
          '.android.js',
          '.android.jsx',
          '.ios.js',
          '.ios.jsx',
        ],
        root: ['.'],
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
