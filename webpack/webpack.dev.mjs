import path from "node:path";
import { env } from "node:process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
// import fs from "node:fs";

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import webpack from "webpack";

// const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Config = {
	mode: "development",
	devtool: "source-map",
	entry: "../src/index.tsx",
	context: __dirname,

	plugins: [
		new ReactRefreshWebpackPlugin(),
		new Dotenv(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../src/index.html"),
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
	],

	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].bundle.js",
		publicPath: "/",
		// chunkFilename: "[name].bundle.js",
	},

	devServer: {
		port: env.PORT ? env.PORT : "auto", // TODO: add env variable for port
		hot: true,
		compress: true,
		historyApiFallback: true,

		static: [
			{
				publicPath: env.PUBLIC_URL ? `${env.PUBLIC_URL}` : "/",
			},

			// https://webpack.js.org/configuration/dev-server/#devserverwatchfiles
			// {
			// 	watch: {
			// 		ignored: [
			// 			// path.resolve(__dirname, "../dist"),
			// 			path.resolve(__dirname, "../node_modules"),
			// 		],
			// 	},
			// },
		],

		open: [env.PUBLIC_URL ? `${env.PUBLIC_URL}` : "/"],

		client: {
			logging: "info",
			overlay: {
				warnings: true,
				errors: true,
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
						jsc: {
							parser: {
								syntax: "typescript",
							},
							transform: {
								react: {
									development: true,
									refresh: true,
								},
							},
						},
					},
				},
			},

			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},

			{
				test: /\.svg$/,
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
