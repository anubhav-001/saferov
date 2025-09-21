var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/princ/Desktop/SafeRove-Final-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/princ/Desktop/SafeRove-Final-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/princ/Desktop/SafeRove-Final-main/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\princ\\Desktop\\SafeRove-Final-main";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    define: {
      "import.meta.env.VITE_GOOGLE_MAPS_API_KEY": JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBvOkBwv90yBvOkBwv90yBvOkBwv90yBvOk"),
      "import.meta.env.VITE_WEATHER_API_KEY": JSON.stringify(env.VITE_WEATHER_API_KEY || "your_openweather_api_key_here"),
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
      const fs = __require("fs");
      if (fs.existsSync(envPath)) {
        const envConfig = __require("file:///C:/Users/princ/Desktop/SafeRove-Final-main/node_modules/dotenv/lib/main.js").config({ path: envPath });
        if (envConfig.parsed) {
          for (const [key, value] of Object.entries(envConfig.parsed)) {
            if (key.startsWith(prefix)) {
              env[key] = value;
            }
          }
        }
      }
    } catch (e) {
    }
  }
  return env;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcmluY1xcXFxEZXNrdG9wXFxcXFNhZmVSb3ZlLUZpbmFsLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHByaW5jXFxcXERlc2t0b3BcXFxcU2FmZVJvdmUtRmluYWwtbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcHJpbmMvRGVza3RvcC9TYWZlUm92ZS1GaW5hbC1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIC8vIExvYWQgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuXG4gIHJldHVybiB7XG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiBcIjo6XCIsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgIH0sXG4gICAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIGRlZmluZToge1xuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0dPT0dMRV9NQVBTX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9HT09HTEVfTUFQU19BUElfS0VZIHx8ICdBSXphU3lCdk9rQnd2OTB5QnZPa0J3djkweUJ2T2tCd3Y5MHlCdk9rJyksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfV0VBVEhFUl9BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkoZW52LlZJVEVfV0VBVEhFUl9BUElfS0VZIHx8ICd5b3VyX29wZW53ZWF0aGVyX2FwaV9rZXlfaGVyZScpLFxuICAgICAgJ3Byb2Nlc3MuZW52Jzoge31cbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcIkBcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ0Bnb29nbGVtYXBzL2pzLWFwaS1sb2FkZXInLFxuICAgICAgICAncmVhY3QnLFxuICAgICAgICAncmVhY3QtZG9tJyxcbiAgICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcblxuZnVuY3Rpb24gbG9hZEVudihtb2RlOiBzdHJpbmcsIHJvb3Q6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpIHtcbiAgY29uc3QgZW52OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGVudkZpbGVzID0gW1xuICAgIC8qKiBkZWZhdWx0IGZpbGUgKi8gYC5lbnZgLFxuICAgIC8qKiBtb2RlIGZpbGUgKi8gYC5lbnYuJHttb2RlfWAsXG4gICAgLyoqIG1vZGUgbG9jYWwgZmlsZSAqLyBgLmVudi4ke21vZGV9LmxvY2FsYCxcbiAgXTtcblxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZW52RmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZW52UGF0aCA9IHBhdGgucmVzb2x2ZShyb290LCBmaWxlKTtcbiAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGVudlBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGVudkNvbmZpZyA9IHJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZyh7IHBhdGg6IGVudlBhdGggfSk7XG4gICAgICAgIGlmIChlbnZDb25maWcucGFyc2VkKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZW52Q29uZmlnLnBhcnNlZCkpIHtcbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG4gICAgICAgICAgICAgIGVudltrZXldID0gdmFsdWUgYXMgc3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFNpbGVudGx5IGlnbm9yZSBtaXNzaW5nIGVudiBmaWxlc1xuICAgIH1cbiAgfVxuICByZXR1cm4gZW52O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBMFQsU0FBUyxvQkFBb0I7QUFDdlYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxpQkFBaUIsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM5RSxRQUFRO0FBQUEsTUFDTiw0Q0FBNEMsS0FBSyxVQUFVLElBQUksNEJBQTRCLDBDQUEwQztBQUFBLE1BQ3JJLHdDQUF3QyxLQUFLLFVBQVUsSUFBSSx3QkFBd0IsK0JBQStCO0FBQUEsTUFDbEgsZUFBZSxDQUFDO0FBQUEsSUFDbEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsaUJBQWlCO0FBQUEsUUFDZixTQUFTLENBQUMsY0FBYztBQUFBLFFBQ3hCLHlCQUF5QjtBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyxRQUFRLE1BQWMsTUFBYyxRQUFnQjtBQUMzRCxRQUFNLE1BQThCLENBQUM7QUFDckMsUUFBTSxXQUFXO0FBQUE7QUFBQSxJQUNLO0FBQUE7QUFBQSxJQUNILFFBQVEsSUFBSTtBQUFBO0FBQUEsSUFDTixRQUFRLElBQUk7QUFBQSxFQUNyQztBQUVBLGFBQVcsUUFBUSxVQUFVO0FBQzNCLFFBQUk7QUFDRixZQUFNLFVBQVUsS0FBSyxRQUFRLE1BQU0sSUFBSTtBQUN2QyxZQUFNLEtBQUssVUFBUSxJQUFJO0FBQ3ZCLFVBQUksR0FBRyxXQUFXLE9BQU8sR0FBRztBQUMxQixjQUFNLFlBQVksVUFBUSxvRkFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM1RCxZQUFJLFVBQVUsUUFBUTtBQUNwQixxQkFBVyxDQUFDLEtBQUssS0FBSyxLQUFLLE9BQU8sUUFBUSxVQUFVLE1BQU0sR0FBRztBQUMzRCxnQkFBSSxJQUFJLFdBQVcsTUFBTSxHQUFHO0FBQzFCLGtCQUFJLEdBQUcsSUFBSTtBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFNBQVMsR0FBRztBQUFBLElBRVo7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUOyIsCiAgIm5hbWVzIjogW10KfQo=
