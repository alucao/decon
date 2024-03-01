const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const {
  outputConfig,
  copyPluginPatterns,
  entryConfig,
  devServer,
} = require("./env.config");
const webpack = require("webpack");
const dotenv = require("dotenv");
const { InjectManifest } = require("workbox-webpack-plugin");

dotenv.config();

module.exports = (env, options) => {
  return {
    mode: options.mode,
    entry: {
      main: entryConfig,
      /* worker: {
                import: "./src/service-worker.js",
                baseUri: 'my:service-worker.ts',
            } */
    },
    devServer,
    // Dev only
    // Target must be set to web for hmr to work with .browserlist
    // https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
    target: "web",
    experiments: {
      asyncWebAssembly: true,
      layers: true,
    },
    ignoreWarnings: [
      {
        module: /cardano_message_signing_bg.js/,
      },
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
            // We're in dev and want HMR, SCSS is handled in JS
            // In production, we want our css as files
            "style-loader",
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
          test: /\.(?:ico|gif|png|jpg|jpeg|svg|)$/i,
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
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inject: true,
        minify: false,
      }),
      new CopyPlugin(copyPluginPatterns),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      /* new InjectManifest({
                swSrc: './src/service-worker.js',
                swDest: 'service-worker.js',
                maximumFileSizeToCacheInBytes: 8000000,
            }),*/
    ],
  };
};
