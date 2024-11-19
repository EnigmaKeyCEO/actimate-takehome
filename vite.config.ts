import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import path from "path";
import { PluginItem } from "@babel/core";

export default defineConfig(({ mode }) => ({
  plugins: [
    viteCommonjs(),
    react({
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
        "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons"
      ),
      "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(
        __dirname,
        "node_modules/react-native-web/dist/vendor/react-native/NativeComponent/index.js"
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
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['react-native'],
      output: {
        globals: {
          'react-native': 'ReactNative'
        }
      }
    }
  },
}));
