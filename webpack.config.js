const webpack = require("@nativescript/webpack");
const expoWebpackConfig = require("./metro.config");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return {
    ...webpack.resolveConfig(expoWebpackConfig),
    ...(env.mode === "development" && {
      watchFolders: [path.resolve(__dirname, "/node_modules")],
    }),
    mode:
      env.mode === "development" || process.env.NODE_ENV === "development"
        ? "development"
        : "production",
  };
};
