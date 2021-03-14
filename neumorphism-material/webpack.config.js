const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Html = require('html-webpack-plugin');
const Compression = require('compression-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
})

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    mode: "development",
    devtool: "source-map",
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            reloadAll: true
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                loader: 'file-loader',
                options: {
                    name: "[name].[ext]",
                    publicPath: "/images/",
                    outputPath: "/images/"
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}