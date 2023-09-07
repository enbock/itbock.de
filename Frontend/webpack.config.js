const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    entry: './Application/index.ts',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.tsx', '.ts', '.js'],
                    alias: {}
                }
            },
            {
                test: /\.css$/i,
                loader: 'css-loader',
                options: {
                    exportType: 'string',
                    import: false
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.svg$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'Application/public',
                    globOptions: {
                        ignore: ['**/index.html']
                    }
                },
                {
                    from: 'Application/theme',
                    to: 'theme'
                }
            ]
        }),

        new HtmlWebpackPlugin({
            template: 'Application/public/index.html'
        })
    ],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true
    },
    resolve: {
        fallback: {
            'typescript': false
        },
        alias: {
            Application: path.resolve(__dirname, 'Application'),
            Core: path.resolve(__dirname, 'Core'),
            Infrastructure: path.resolve(__dirname, 'Infrastructure')
        }
    },
    devServer: {
        port: 3001,
        static: {
            directory: path.join(__dirname, 'Application/public')
        }
    }
};


module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
    }
    return config;
};
