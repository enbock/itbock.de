const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// noinspection JSUnusedLocalSymbols
module.exports = (env, argv) => {
    const development = argv.mode === 'development';
    return {
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
                },
                {
                    test: /\.(mp3|wav)$/i,
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
                    },
                    {
                        from: 'UI/AudioInput/ui-audio-input-processor.js',
                        to: 'ui-audio-input-processor.js'
                    }
                ]
            }),

            new HtmlWebpackPlugin({
                template: 'Application/public/index.html'
            }),

            new Dotenv({})
        ],
        output: {
            filename: 'bundle.[fullhash].js',
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
                Infrastructure: path.resolve(__dirname, 'Infrastructure'),
                UI: path.resolve(__dirname, 'UI')
            }
        },
        devServer: {
            port: 3001,
            static: {
                directory: path.join(__dirname, 'Application/public')
            }
        }
    };
};
