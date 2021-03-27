module.exports = {
	entry: {
		"public-list": "./src/PublicList.tsx",
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
