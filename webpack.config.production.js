const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  outputConfig,
  copyPluginPatterns,
  scssConfig,
  entryConfig,
  terserPluginConfig,
} = require("./env.config");
const webpack = require("webpack");
const dotenv = require("dotenv");
const { InjectManifest } = require("workbox-webpack-plugin");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

dotenv.config();

module.exports = (env, options) => {
  return {
    devtool: "source-map",
    mode: options.mode,
    entry: entryConfig,
    experiments: {
      asyncWebAssembly: true,
      layers: true,
    },
    ignoreWarnings: [
      {
        module: /cardano_serialization_lib_bg.js/,
      },
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css?$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.json$/,
          loader: "json-loader",
          type: "javascript/auto",
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env"]],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
          type: "javascript/auto",
          loader: "file-loader",
          options: {
            publicPath: "../",
            name: "[path][name].[ext]",
            context: path.resolve(__dirname, "src/assets"),
            emitFile: false,
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: "javascript/auto",
          exclude: /images/,
          loader: "file-loader",
          options: {
            publicPath: "../",
            context: path.resolve(__dirname, "src/assets"),
            name: "[path][name].[ext]",
            emitFile: false,
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
    output: {
      filename: "js/[name].bundle.js",
      path: path.resolve(__dirname, outputConfig.destPath),
      publicPath: "",
    },
    optimization: {
      minimizer: [new TerserPlugin(terserPluginConfig)],
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin(copyPluginPatterns),
      new MiniCssExtractPlugin({ filename: scssConfig.destFileName }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inject: true,
        minify: false,
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new InjectManifest({
        swSrc: "./src/service-worker.js",
        swDest: "service-worker.js",
        maximumFileSizeToCacheInBytes: 5000000,
      }),
      sentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "deconapp",
        project: "javascript-react",
      }),
    ],
  };
};
