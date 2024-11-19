import { defineConfig, transformWithEsbuild } from "vite";
import reactNativeWeb from "vite-plugin-react-native-web";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import path from "path";
import { PluginItem } from "@babel/core";

const exclusionRegex =
  /node_modules(?!\/(@?expo[-/]vector-icons|lodash\..*|native-base|normalize-css-color|inline-style-prefixer))/;

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
      "inline-style-prefixer",
      "postcss-value-parser"
    ],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    },
    exclude: [
      'inline-style-prefixer'
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        /node_modules/,
        /inline-style-prefixer/,
        /postcss-value-parser/,
        /lodash\..*/,
      ]
    },
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash][extname]"
      }
    }
  },
  server: {
    port: 3000,
    cors: {
      origin: '*'
    }
  }
}));
