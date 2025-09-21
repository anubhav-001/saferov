var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/Samarth/OneDrive/Desktop/sih/sih_project_new/sih_project/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Samarth/OneDrive/Desktop/sih/sih_project_new/sih_project/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Samarth/OneDrive/Desktop/sih/sih_project_new/sih_project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Samarth\\OneDrive\\Desktop\\sih\\sih_project_new\\sih_project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    define: {
      "import.meta.env.VITE_GOOGLE_MAPS_API_KEY": JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      "import.meta.env.VITE_WEATHER_API_KEY": JSON.stringify(env.VITE_WEATHER_API_KEY),
      "process.env": {}
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__vite_injected_original_dirname, "./src")
        }
      ]
    },
    optimizeDeps: {
      include: [
        "@googlemaps/js-api-loader",
        "react",
        "react-dom",
        "react-router-dom"
      ]
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    }
  };
});
function loadEnv(mode, root, prefix) {
  const env = {};
  const envFiles = [
    /** default file */
    `.env`,
    /** mode file */
    `.env.${mode}`,
    /** mode local file */
    `.env.${mode}.local`
  ];
  for (const file of envFiles) {
    try {
      const envPath = path.resolve(root, file);
      const envConfig = __require("file:///C:/Users/Samarth/OneDrive/Desktop/sih/sih_project_new/sih_project/node_modules/dotenv/lib/main.js").config({ path: envPath });
      if (envConfig.parsed) {
        for (const [key, value] of Object.entries(envConfig.parsed)) {
          if (key.startsWith(prefix)) {
            env[key] = value;
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to load env file: ${file}`, e);
    }
  }
  return env;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTYW1hcnRoXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcc2loXFxcXHNpaF9wcm9qZWN0X25ld1xcXFxzaWhfcHJvamVjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2FtYXJ0aFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHNpaFxcXFxzaWhfcHJvamVjdF9uZXdcXFxcc2loX3Byb2plY3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1NhbWFydGgvT25lRHJpdmUvRGVza3RvcC9zaWgvc2loX3Byb2plY3RfbmV3L3NpaF9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiBcIjo6XCIsXHJcbiAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9HT09HTEVfTUFQU19BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LlZJVEVfR09PR0xFX01BUFNfQVBJX0tFWSksXHJcbiAgICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9XRUFUSEVSX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9XRUFUSEVSX0FQSV9LRVkpLFxyXG4gICAgICAncHJvY2Vzcy5lbnYnOiB7fVxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiBcIkBcIixcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICAnQGdvb2dsZW1hcHMvanMtYXBpLWxvYWRlcicsXHJcbiAgICAgICAgJ3JlYWN0JyxcclxuICAgICAgICAncmVhY3QtZG9tJyxcclxuICAgICAgICAncmVhY3Qtcm91dGVyLWRvbScsXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XHJcbiAgICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcclxuICAgICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBsb2FkRW52KG1vZGU6IHN0cmluZywgcm9vdDogc3RyaW5nLCBwcmVmaXg6IHN0cmluZykge1xyXG4gIGNvbnN0IGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG4gIGNvbnN0IGVudkZpbGVzID0gW1xyXG4gICAgLyoqIGRlZmF1bHQgZmlsZSAqLyBgLmVudmAsXHJcbiAgICAvKiogbW9kZSBmaWxlICovIGAuZW52LiR7bW9kZX1gLFxyXG4gICAgLyoqIG1vZGUgbG9jYWwgZmlsZSAqLyBgLmVudi4ke21vZGV9LmxvY2FsYCxcclxuICBdO1xyXG5cclxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZW52RmlsZXMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGVudlBhdGggPSBwYXRoLnJlc29sdmUocm9vdCwgZmlsZSk7XHJcbiAgICAgIGNvbnN0IGVudkNvbmZpZyA9IHJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZyh7IHBhdGg6IGVudlBhdGggfSk7XHJcbiAgICAgIGlmIChlbnZDb25maWcucGFyc2VkKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZW52Q29uZmlnLnBhcnNlZCkpIHtcclxuICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwcmVmaXgpKSB7XHJcbiAgICAgICAgICAgIGVudltrZXldID0gdmFsdWUgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBsb2FkIGVudiBmaWxlOiAke2ZpbGV9YCwgZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBlbnY7XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBcVksU0FBUyxvQkFBb0I7QUFDbGEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxpQkFBaUIsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM5RSxRQUFRO0FBQUEsTUFDTiw0Q0FBNEMsS0FBSyxVQUFVLElBQUksd0JBQXdCO0FBQUEsTUFDdkYsd0NBQXdDLEtBQUssVUFBVSxJQUFJLG9CQUFvQjtBQUFBLE1BQy9FLGVBQWUsQ0FBQztBQUFBLElBQ2xCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQzlDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLFFBQ2YsU0FBUyxDQUFDLGNBQWM7QUFBQSxRQUN4Qix5QkFBeUI7QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsUUFBUSxNQUFjLE1BQWMsUUFBZ0I7QUFDM0QsUUFBTSxNQUE4QixDQUFDO0FBQ3JDLFFBQU0sV0FBVztBQUFBO0FBQUEsSUFDSztBQUFBO0FBQUEsSUFDSCxRQUFRLElBQUk7QUFBQTtBQUFBLElBQ04sUUFBUSxJQUFJO0FBQUEsRUFDckM7QUFFQSxhQUFXLFFBQVEsVUFBVTtBQUMzQixRQUFJO0FBQ0YsWUFBTSxVQUFVLEtBQUssUUFBUSxNQUFNLElBQUk7QUFDdkMsWUFBTSxZQUFZLFVBQVEsMkdBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDNUQsVUFBSSxVQUFVLFFBQVE7QUFDcEIsbUJBQVcsQ0FBQyxLQUFLLEtBQUssS0FBSyxPQUFPLFFBQVEsVUFBVSxNQUFNLEdBQUc7QUFDM0QsY0FBSSxJQUFJLFdBQVcsTUFBTSxHQUFHO0FBQzFCLGdCQUFJLEdBQUcsSUFBSTtBQUFBLFVBQ2I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxLQUFLLDRCQUE0QixJQUFJLElBQUksQ0FBQztBQUFBLElBQ3BEO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFDVDsiLAogICJuYW1lcyI6IFtdCn0K
