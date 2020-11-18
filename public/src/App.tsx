import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Analysis, Interviews, Projects, routes } from './routes';
import { Provider } from 'react-redux';
import { store } from './store';

import 'globals/variables.scss';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={routes.analysis} component={Analysis}/>
              <Route exact={true} path={routes.project} component={Interviews}/>
              <Route exact={true} path={routes.interview} component={Analysis}/>
              <Route exact={true} path={routes.projects} component={Projects}/>
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
