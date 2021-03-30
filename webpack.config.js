const path = require("path");

module.exports = {
	entry: {
		"public-list": "./src/PublicList.tsx",
	},
	output: {
		path: path.resolve(__dirname, "public/js/"),
	},
	module: {
		rules: [
			{
				test: /.(tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/env", "@babel/react", "@babel/typescript"]
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".tsx"]
	}
}
