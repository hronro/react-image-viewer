import React from 'react';
import { render as reactRender } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Demo from './components/Demo';

const containerEl = document.querySelector('#container');

const render = () => reactRender(
  <AppContainer>
    <Demo />
  </AppContainer>,
  containerEl
);

render();

if(module.hot) {
  module.hot.accept('./components/Demo', render);
}
