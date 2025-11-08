const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {
  transformer: {
    // Optional: customize transformer options
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false, // usually false in modern RN
        inlineRequires: false,
      },
    }),
    // Keep asset plugin if using expo-asset
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    // Add any extra resolver config if needed
  },
});

module.exports = config;