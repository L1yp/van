import {configSvgIconsPlugin} from "./svg-icon-vite-plugin"
import vue from '@vitejs/plugin-vue';

export function createVitePlugins(viteEnv: Record<string, string>, isBuild: boolean) {
    const plugins = [
        vue(),
    ];
    plugins.push(configSvgIconsPlugin(isBuild));
    return plugins;
}