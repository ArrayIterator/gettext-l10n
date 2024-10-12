const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const baseName = 'gettext-l10n';
const libName = 'gettextL10n';

/**
 * @param {string} libraryTarget
 * @param {boolean} minify
 */
const createConfig = (libraryTarget, minify) => ({
    mode: 'production',
    entry: './src/gettext-l10n.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: `${baseName}.${libraryTarget}${minify ? '.min' : ''}.js`,
        path: path.resolve(__dirname, 'dist'),
        library: libName,
        libraryTarget: libraryTarget,
        libraryExport: 'default', // Export the default export
    },
    optimization: {
        minimize: minify,
        minimizer: minify ? [new TerserPlugin({
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        })] : [],
    },
});

// noinspection WebpackConfigHighlighting
module.exports = [
    createConfig('umd', false),
    createConfig('umd', true),
    createConfig('amd', false),
    createConfig('amd', true)
];
