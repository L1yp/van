import {createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export function configSvgIconsPlugin(isBuild: boolean) {
    return createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        svgoOptions: isBuild,
        // default
        symbolId: 'icon-[dir]-[name]',
        /**
         * 自定义插入位置
         * @default: body-last
         */
        inject: 'body-last',

        /**
         * 自定义DOM ID
         * @default: __svg__icons__dom__
         */
        customDomId: '__svg__icons__dom__',
    });
}