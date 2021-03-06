module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: [
      './app/assets/javascripts/index.ts'
    ],
    output: {
      path: __dirname,
      filename: './assets/javascripts/bundle.js',
      library: {
        type: 'window'
      },
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /node_modules/
          ],
          use: [
            { loader: "babel-loader" }
          ]
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }