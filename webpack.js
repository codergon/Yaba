const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  return {
    mode: argv.mode,
    devtool: argv.mode === "development" ? "inline-source-map" : "source-map",
    devServer: {
      hot: true,
      port: 9000,
    },
    entry: {
      app: path.join(__dirname, "./src/popup/index.js"),
      foreground: path.resolve("src/injectedScript/index.tsx"),
    },
    output: {
      publicPath: "/",
      filename: "[name].js",
      path: path.resolve(__dirname, "./build"),
    },

    optimization: { concatenateModules: true },
    module: {
      rules: [
        {
          use: "ts-loader",
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react",
                  {
                    plugins: ["@babel/plugin-proposal-class-properties"],
                  },
                ],
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.(css|scss)$/i,
          exclude: /src\/injectedScript\/styles/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(css|scss)$/i,
          include: /src\/injectedScript\/styles/,
          use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(ttf|otf|woff|woff2)$/i,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),

      new MiniCSSExtractPlugin({
        filename: "styles/foreground.css",
      }),
      new webpack.ProvidePlugin({
        React: "react",
      }),
      new HtmlWebpackPlugin({
        hash: true,
        chunks: ["app"],
        filename: "index.html",
        manifest: "manifest.json",
        title: "Yaba - Bookmark Tabs and Annotate Pages",
        meta: {
          charset: "utf-8",
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
          "theme-color": "#ffffff",
        },
      }),
      new HtmlWebpackPlugin({
        filename: "foreground.html",
        template: "src/injectedScript/index.html",
        chunks: ["foreground"],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve("src/static"),
            to: path.resolve("build"),
          },
          { from: "src/background/*.js", to: "[name][ext]" },
          { from: "src/contentScript/*.js", to: "[name][ext]" },
        ],
      }),
      new CleanWebpackPlugin(),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
      },
    },
  };
};
