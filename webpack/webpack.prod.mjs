import path from "node:path";
import { env } from "node:process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
// import fs from "node:fs";

const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPackageJson = require(path.resolve(__dirname, "../package.json"));

import webpack from "webpack";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const Config = {
	mode: "production",
	devtool: "nosources-source-map",
	// devtool: "source-map",
	entry: "../src/index.tsx",
	context: __dirname,

	plugins: [
		new Dotenv(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../src/index.html"),
		}),
		new MiniCssExtractPlugin({
			filename: projectPackageJson.name + ".[name].[chunkhash].css",
			// TODO: chunkFilename: projectPackageJson.name + "[name].[id].[chunkhash]css",
		}),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: "../tsconfig.json",
				diagnosticOptions: {
					semantic: true,
					syntactic: true,
				},
				mode: "write-references",
			},
		}),

		// new BundleAnalyzerPlugin(),
	],

	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: projectPackageJson.name + ".[name].[chunkhash].bundle.js",
		chunkFilename: projectPackageJson.name + ".[name].[chunkhash].bundle.js",
		clean: true,
		publicPath: "/",
	},

	optimization: {
		minimize: true,
		minimizer: [
			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
			// `...`,
			new CssMinimizerPlugin({
				minify: CssMinimizerPlugin.swcMinify,
			}),
		],
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,

					// https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-3
					// test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,

					name: "vendor",
					enforce: true,
					chunks: "all",
				},
			},
		},
	},

	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@src": path.resolve(__dirname, "../src"),
			"@store": path.resolve(__dirname, "../src/store"),
		},
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.join(__dirname, "../src"),
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "swc-loader",
					options: {
						minify: true,
						jsc: {
							parser: {
								syntax: "typescript",
							},
							transform: {
								react: {
									development: false,
									refresh: false,
								},
							},
							minify: {
								compress: true,
								mangle: true,
								// TODO: ecma: "", // defaults to 5 currently noop if set
							},
						},
					},
				},
			},

			{
				test: /\.(sa|sc|c)ss$/,
				include: path.join(__dirname, "../src"),
				exclude: /(node_modules|bower_components)/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
			},

			{
				test: /\.svg$/,
				include: path.join(__dirname, "../src"),
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: "@svgr/webpack",
					},
				],
			},
		],
	},
};

export default Config;
