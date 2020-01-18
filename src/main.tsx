import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DmScreen from './hbt-dmscreen/App';
import { initializeMainScreen } from './hbt-mainscreen/main';

import styled from 'styled-components';

const Menu = styled.div`
  max-width: 400px;
  display: grid;
  align-content: center;
  justify-content: center;
  margin: auto;
  height: 100%;
`;

enum AppMode {
  Uninitialized,
  MainScreen,
  DmScreen,
}

const AppSelect = (props: {mountNode: Element}) => {
  const { mountNode } = props;
  const [selectedAppMode, setSelectedApp] = useState<AppMode>(AppMode.Uninitialized);


  if (selectedAppMode === AppMode.MainScreen) {
    initializeMainScreen();
    // @ts-ignore
    // ReactDOM.unmountComponentAtNode(mountNode);
    mountNode.remove();
  }

  return (
    <>
      {selectedAppMode === AppMode.Uninitialized && (
        <Menu>
          <button onClick={() => setSelectedApp(AppMode.MainScreen)}>
            Main Screen
          </button>
          <button onClick={() => setSelectedApp(AppMode.DmScreen)}>
            DM Screen
          </button>
        </Menu>
      )}
      {selectedAppMode === AppMode.DmScreen && (
        <DmScreen />
      )}
    </>
  );
};

const mountNode = document.getElementById('main');
// @ts-ignore
const AppElement = <AppSelect mountNode={mountNode} />;
ReactDOM.render(
  AppElement,
  mountNode,
);

