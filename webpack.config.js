const webpack = require("webpack");
const WebpackBar = require("webpackbar");

module.exports = {
    mode: "production",
    output: {
        filename: "bundle.js",
        publicPath: "js/"
    },

    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            query: {
                presets: [[
                    "@babel/preset-env",
                    {
                        useBuiltIns: "usage",
                        corejs: 3,
                        targets: {
                            ie: "11"
                        }
                    }
                ]],
                plugins: [
                    "@babel/plugin-proposal-private-methods",
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-proposal-numeric-separator",
                    "@babel/plugin-proposal-optional-chaining",
                ]
            }
        }]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    filename: "[name].js"
                }
            }
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        new WebpackBar(),
    ],

    performance: {
        hints: false
    },

    devtool: "source-maps"
};
