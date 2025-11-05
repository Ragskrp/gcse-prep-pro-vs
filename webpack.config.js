// d:\New Gcse pro - VS\webpack.config.js
module.exports = {
  optimization: {
    minimizer: [
      new (require('terser-webpack-plugin'))({
        cache: true,
        parallel: true,
        sourceMap: false, // Or true if you want source maps
      }),
    ],
  },
};