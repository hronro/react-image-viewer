const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: ['> 0.1%', 'not ie < 9'],
    })
  ],
};
