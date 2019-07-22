const path = require('path');
// const webpack = require('webpack');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');


const postcssOptions = {
    ident: 'postcss',
    sourceMap: true,
    plugins: [
        require('postcss-import'),
        require('postcss-preset-env'),
    ]
};

const config = {
    entry: {
        main: [ './src/main.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash:5].js',
    },
    stats: {
        // don't display conflicting order warnings from mini-css-extract
        // these come from using vuetify with vue-google-maps
        warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1 // if true will ignore
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            browsers: 'last 2 Chrome versions'
                                        },
                                        debug: true,
                                        useBuiltIns: 'usage',
                                        corejs: 3,
                                        modules: false
                                    }
                                ]
                            ],
                            plugins: ['@babel/plugin-transform-regenerator'],
                        },
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            parserOptions: {
                                ecmaVersion: 10,
                                sourceType: 'module',
                                ecmaFeatures: {
                                    modules: true,
                                    experimentalObjectRestSpread: true,
                                }
                            },
                            plugins: [
                                'vue', 'vuetify'
                            ],
                            rules: {
                                'vue/recommended': 'error',
                                'vuetify/no-deprecated-classes': 'error',
                                'vuetify/grid-unknown-attributes': 'error',
                                'vuetify/no-legacy-grid': 'error',
                            }
                        }
                    },
                ]
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.(jpg|png|gif|woff|eot|ttf|svg)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 50000

                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    { loader: 'postcss-loader', options: postcssOptions },
                ],
            },
            {
                test: /\.s([a|c])ss$/,
                use: [
                    'vue-style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    { loader: 'postcss-loader', options: postcssOptions },
                    {
                        loader: 'sass-loader', options: {
                            implementation: require('sass'),
                            fiber: require('fibers'),
                        }
                    },
                ],
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name: 'common',
                    test: /\.(s?([ac])ss|vue)$/,
                    chunks: 'all',
                    enforce: true,
                    reuseExistingChunk: true,
                },
                vendor: {
                    name: 'vendor',
                    test: 'vendor',
                    chunks: 'initial',
                }

            },
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin({}),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:5].css',
            allChunks: true,
        }),
        new ManifestPlugin({
            fileName: 'manifest.json',
        }),
        // To strip all locales except “en”
        new MomentLocalesPlugin(),

        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        // new MomentLocalesPlugin({
        //     localesToKeep: ['es-us', 'ru'],
        // }),
    ],
};

module.exports = (env, argv) => {

    if (argv.mode === 'production') {

        config.optimization.minimizer = [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin(),
        ];

    } else {

        // any dev changed here

    }

    // console.log(config);

    return config;
};
