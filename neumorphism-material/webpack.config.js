const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCSS = require('mini-css-extract-plugin');
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
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCSS.loader,
                    {
                      loader: 'css-loader',
                      options: {
                          sourceMap: true
                      }
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                          plugins: () => [autoprefixer()]
                      }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
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
        new Html({
            filename: "index.html",
            template: "./index.html"
        }),
        new MiniCSS({
            filename: "main.css"
        }),
        new Compression({
            threshold: 0,
            minRatio: 0.5
        })
    ]
}