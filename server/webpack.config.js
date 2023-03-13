const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  output: {
    publicPath: "/",
    path: path.join(__dirname, "/dist"),
    filename: "server.[name].js",
    globalObject: "this",
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "./src/utils/"),
      mongo: path.resolve(__dirname, "./src/mongo"),
    },
    extensions: [".ts", ".js"],
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
    ],
  },
  plugins: [],
  externals: [nodeExternals()],
};
