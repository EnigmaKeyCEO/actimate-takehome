const webpack = require("@nativescript/webpack");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.mergeWebpackConfig({
    resolve: {
      alias: {
        "react-native": "react-native-web",
        "react-native/Libraries/Utilities/BackHandler": path.resolve(
          __dirname,
          "src/mocks/BackHandler.web.ts"
        ),
      },
      extensions: [".web.ts", ".web.tsx", ".js", ".jsx", ".json"],
    },
  });

  return webpack.resolveConfig();
};
