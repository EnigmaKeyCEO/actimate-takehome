const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

const defaultConfig = getDefaultConfig(__dirname);

const mergedConfig = mergeConfig(defaultConfig, {
  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...defaultConfig.resolver.assetExts],
    sourceExts: [...defaultConfig.resolver.sourceExts],
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.endsWith(".png")) {
          req.headers["Content-Type"] = "image/png";
        }
        return middleware(req, res, next);
      };
    },
  },
});

module.exports = async function (env, argv) {
  // force the mode to be development or production BEFORE creating the config
  env.mode = process.env.NODE_ENV === "development" ? "development" : "production";
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  return {
    ...mergeConfig(config, mergedConfig),
    ...(env.mode === "development" && {
      watchFolders: [path.resolve(__dirname, "node_modules")],
    }),
    mode:
      env.mode === "development" || process.env.NODE_ENV === "development"
        ? "development"
        : "production",
  };
};
