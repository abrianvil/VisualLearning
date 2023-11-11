// const path = require('path');

// module.exports = {
//     entry: './src/index.js',
//     output: {
//         filename: 'main.js',
//         path: path.resolve(__dirname, 'dist'),
//     },
//     mode: 'development', // or 'production'
//     devServer: {
//         static: {
//             directory: path.join(__dirname, 'dist'),
//         },
//         compress: true,
//         port: 9000,
//         open: true,
//     },
//     // include here any loaders or plugins if you are using them
// };


const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/main.js', // Corrected entry point to main.js
  output: {
    filename: 'bundle.js', // Typical naming convention for output file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // or 'production'
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from 'dist' directory
    },
    compress: true,
    port: 9000,
    open: true,
  },
  // Include here any loaders or plugins if you are using them
  // For example, to handle CSS you would need style-loader and css-loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Handles .css files
      },
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: 'file-loader', // Handles 3D models
            options: {
              outputPath: 'models/', // Output directory for models
            },
          },
        ],
      },
      // Add more loaders here for other file types (e.g., images, shaders)
    ],
  },
  // If using plugins like HtmlWebpackPlugin, add them here
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // Template file to use
    }),
  ],
};
