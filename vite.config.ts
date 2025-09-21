import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBwv90yBvOkBwv90yBvOkBwv90yBvOk'),
      'import.meta.env.VITE_WEATHER_API_KEY': JSON.stringify(env.VITE_WEATHER_API_KEY || 'your_openweather_api_key_here'),
      'process.env': {}
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
      ],
    },
    optimizeDeps: {
      include: [
        '@googlemaps/js-api-loader',
        'react',
        'react-dom',
        'react-router-dom',
      ],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
  };
});

function loadEnv(mode: string, root: string, prefix: string) {
  const env: Record<string, string> = {};
  const envFiles = [
    /** default file */ `.env`,
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ];

  for (const file of envFiles) {
    try {
      const envPath = path.resolve(root, file);
      const fs = require('fs');
      if (fs.existsSync(envPath)) {
        const envConfig = require('dotenv').config({ path: envPath });
        if (envConfig.parsed) {
          for (const [key, value] of Object.entries(envConfig.parsed)) {
            if (key.startsWith(prefix)) {
              env[key] = value as string;
            }
          }
        }
      }
    } catch (e) {
      // Silently ignore missing env files
    }
  }
  return env;
}
