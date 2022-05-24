import {defineConfig, loadEnv} from 'vite'
import {createVitePlugins} from "./build/vite/plugins"
import {resolve} from "path";


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root: string = process.cwd();
  const env: Record<string, string> = loadEnv(mode, root);
  const isBuild: boolean = command === 'build';
  console.log("command", command)
  console.log("mode", mode)
  console.log("env", env)

  return {
    build: {
      target: ["chrome91"]
    },
    plugins: createVitePlugins(env, isBuild),
    resolve: {
      alias: [
        // @/xxxx => src/xxxx
        {
          find: '@',
          replacement: resolve(process.cwd(), '.', 'src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: '#',
          replacement: resolve(process.cwd(), '.', 'types') + '/',
        },
      ]
    },
    server: {
      host: "0.0.0.0",
      port: 3003,
      proxy: {
        '/api': {
          target: 'http://localhost:8082',
          rewrite: path => {
            return path.replace(/^\/api/, '')
          }
        }
      }
    },


  };
})