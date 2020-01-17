import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import EncounterLoader from './encounters/EncounterLoader';
import InitiativeTracker from './initiative/InitiativeTracker';
import Navigation from './Navigation';

const Page = styled.div`
  padding: 8px;
`;

export default class App extends Component {
  render() {
    return (
      <Router>
        <Navigation />
        <Page>
          <Switch>
            <Route path='/initiative'>
              <InitiativeTracker />
            </Route>
            <Route path='/'>
              <EncounterLoader />
            </Route>
          </Switch>
        </Page>
      </Router>
    );
  }
}
