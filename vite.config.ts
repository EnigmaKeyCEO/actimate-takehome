import { defineConfig, transformWithEsbuild } from "vite";
import reactNativeWeb from "vite-plugin-react-native-web";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import path from "path";
import { PluginItem } from "@babel/core";

const exclusionRegex = /node_modules(?!\/(@?expo[-/]vector-icons|lodash\..*|native-base|normalize-css-color|inline-style-prefixer))/;

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(exclusionRegex)) return null;

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    viteCommonjs(),
    reactNativeWeb({
      babel: {
        plugins: [
          mode === "development" && [
            "react-refresh/babel",
            {},
            "react-refresh",
          ],
        ].filter(Boolean) as PluginItem[],
      },
    }),
  ],
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "src"),
      "react-native": "react-native-web",
      "@react-native/assets-registry/registry": path.resolve(
        __dirname,
        "node_modules/react-native-web/dist/modules/AssetRegistry/index.js"
      ),
      // "@expo/vector-icons": path.resolve(
      //   __dirname,
      //   "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons"
      // ),
      "@expo/vector-icons": path.resolve(
        __dirname,
        "node_modules/@expo/vector-icons"
      ),
      "native-base": path.resolve(
        __dirname,
        "node_modules/native-base/lib/commonjs/index.js"
      ),
      "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(
        __dirname,
        "node_modules/react-native-web/dist/vendor/react-native/NativeComponent/index.js"
      ),
      "@react-native/normalize-colors": "normalize-css-color",
      "inline-style-prefixer/lib/plugins/backgroundClip": path.resolve(
        __dirname,
        "node_modules/inline-style-prefixer/lib/plugins/backgroundClip"
      ),
      "inline-style-prefixer/lib/plugins/crossFade": path.resolve(
        __dirname,
        "node_modules/inline-style-prefixer/lib/plugins/crossFade"
      ),
      "inline-style-prefixer/lib/plugins/cursor": path.resolve(
        __dirname,
        "node_modules/inline-style-prefixer/lib/plugins/cursor"
      ),
    },
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
    ],
  },
  define: {
    "process.env": {},
    __DEV__: mode === "development",
    global: "window",
  },
  optimizeDeps: {
    include: [
      "react-native-web",
      "@expo/vector-icons",
      "react-native-safe-area-context",
      "expo-asset",
      "react",
      "react/jsx-runtime",
      "use-sync-external-store",
      "use-sync-external-store/shim",
      "lodash.get",
      "lodash.isempty",
      "lodash.omitby",
      "tinycolor2",
      "inline-style-prefixer/lib/plugins/backgroundClip",
      "inline-style-prefixer/lib/plugins/crossFade",
      "inline-style-prefixer/lib/plugins/cursor",
      "@react-native/normalize-colors",
      "inline-style-prefixer/lib/plugins/filter",
      "inline-style-prefixer/lib/plugins/imageSet",
      "inline-style-prefixer/lib/plugins/logical",
      "postcss-value-parser",
      "inline-style-prefixer/lib/createPrefixer",
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
      resolveExtensions: [
        ".web.tsx",
        ".web.ts",
        ".web.jsx",
        ".web.js",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
      ],
      jsx: "automatic",
    },
  },
  build: {
    commonjsOptions: {
      include: [
        /node_modules/,
        /inline-style-prefixer/,
        /postcss-value-parser/,
        /lodash\..*/,
      ],
      requireReturnsDefault: "auto",
      defaultIsModuleExports: true,
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [
        "react-native",
        "react",
        "react/jsx-runtime",
        "react-dom",
        "use-sync-external-store",
        "use-sync-external-store/shim",
        "lodash.get",
        "lodash.isempty",
        "lodash.omitBy",
        "tinycolor2",
        "inline-style-prefixer/lib/plugins/backgroundClip",
        "inline-style-prefixer/lib/plugins/crossFade",
        "inline-style-prefixer/lib/plugins/cursor",
        "inline-style-prefixer/lib/plugins/filter",
        "inline-style-prefixer/lib/plugins/imageSet",
        "inline-style-prefixer/lib/plugins/logical",
        "inline-style-prefixer/lib/plugins/position",
        "inline-style-prefixer/lib/plugins/sizing",
        "inline-style-prefixer/lib/plugins/transition",
        "inline-style-prefixer/lib/createPrefixer",
        "postcss-value-parser",
      ],
      output: {
        globals: {
          "react-native": "ReactNative",
          react: "React",
          "react/jsx-runtime": "JSX",
          "react-dom": "ReactDOM",
          "use-sync-external-store": "useSyncExternalStore",
          "use-sync-external-store/shim": "useSyncExternalStoreShim",
          "lodash.get": "get",
          "lodash.isempty": "isEmpty",
          "lodash.omitby": "omitBy",
          tinycolor2: "tinycolor",
          "inline-style-prefixer/lib/plugins/backgroundClip": "backgroundClip",
          "inline-style-prefixer/lib/plugins/crossFade": "crossFade",
          "inline-style-prefixer/lib/plugins/cursor": "cursor",
          "inline-style-prefixer/lib/plugins/filter": "filter",
          "inline-style-prefixer/lib/plugins/imageSet": "imageSet",
          "inline-style-prefixer/lib/plugins/logical": "logical",
          "inline-style-prefixer/lib/plugins/position": "position",
          "inline-style-prefixer/lib/plugins/sizing": "sizing",
          "inline-style-prefixer/lib/plugins/transition": "transition",
          "inline-style-prefixer/lib/createPrefixer": "createPrefixer",
          "postcss-value-parser": "valueParser",
        },
      },
    },
  },
}));
