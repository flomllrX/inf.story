/* eslint-disable @typescript-eslint/no-var-requires */
// @generated: @expo/next-adapter@2.0.0-beta.9
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const { withExpo } = require("@expo/next-adapter");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const webpack = require("webpack");

module.exports = withExpo(
  withFonts(
    withImages({
      projectRoot: __dirname,
      webpack(config, options) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /react-native-code-push/,
            "../mock/CodePush.js"
          )
        );
        return config;
      }
    })
  )
);
