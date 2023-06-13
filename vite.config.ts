import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from "./build/vite/plugins"
import { resolve } from "path";


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
      target: ["chrome91"],
      sourcemap: true,
      minify: false,

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
        [env.VITE_BASE_URL]: {
          secure: false,
          target: env.VITE_ORIGIN,
          rewrite(path: string) {
            if (env['VITE_KEEP_API_PREFIX'] !== 'yes') {
              return path.replace(env.VITE_BASE_URL, '')
            }
            return path
          },
          headers: {
            Origin: env.VITE_ORIGIN,
          },

        }
      }
    },


  };
})