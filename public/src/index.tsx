import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import * as serviceWorker from './serviceWorker';

import App from './App';
import './index.css';

const root = document.getElementById('root');

const render = (Component: any) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  );
};

serviceWorker.register();

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
