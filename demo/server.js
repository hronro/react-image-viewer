import path from 'path';
import fs from 'fs';

import Koa from 'koa';
import webpack from 'webpack';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import mount from 'koa-mount';
import convert from 'koa-convert';
import serve from 'koa-static';
import getRouter from 'koa-router';

import webpackConfig from './webpack.config';

const app = new Koa();
const router = getRouter();
const compiler = webpack(webpackConfig);

app.use(devMiddleware(compiler, {
  // display no info to console (only warnings and errors)
  noInfo: true,

  // display nothing to the console
  quiet: false,

  // public path to bind the middleware to
  // use the same as in webpack
  publicPath: webpackConfig.output.publicPath,

  // options for formating the statistics
  stats: {
      colors: true,
  },
}));

app.use(hotMiddleware(compiler));

// set static images folder
app.use(mount('/images', new Koa().use(convert(serve(path.join(__dirname, '/images'))))));

app.use(router.routes()).use(router.allowedMethods());

// send index.html for any path
router.get('*', ctx => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = fs.readFileSync(path.join(__dirname, './index.html'));
});

app.on('error', function(err){
  console.error('server error', err);
});


app.listen(3000, () => {
  console.log('Listening at 🌏  http://localhost:3000/');
});
