const path = require('path');

module.exports = {
	entry: {
		index: './src/login',
		gamePage: './src/gamePage'
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, '../www/')
	},
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
	module: {
		rules: [
			{
                test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-typescript",
                            "solid"
                          ],
                          plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread"
                          ]
                        }
				}
			}
		]
	}
};