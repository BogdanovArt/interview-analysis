const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    publicPath: "/",
    path: path.join(__dirname, "/dist"),
    filename: "js/[name].bundle.js",
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets/"),
      store: path.resolve(__dirname, "./src/store/"),
      utils: path.resolve(__dirname, "./src/utils/"),
      routes: path.resolve(__dirname, "./src/routes/"),
      types: path.resolve(__dirname, "./src/types/"),
      components: path.resolve(__dirname, "./src/components/"),
    },
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
              modules: {
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*",
          context: "public",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new NodePolyfillPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    sockPort: 80,
  },
};
