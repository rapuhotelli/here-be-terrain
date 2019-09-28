import React, { Component } from 'react';
import styled from 'styled-components';

import { IEncounter } from '../../../hbt-common/interfaces';
import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Section, SectionTitle } from '../styled_components/Section';
import EncounterLayer from './EncounterLayer';

const ActionsContainer = styled.div`
  margin-bottom: 12px;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: ${9/16 * 100}%;
`;

const BackImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

interface Props {
  campaign: string;
  encounter: string;
}
interface State {
  encounterData?: IEncounter;
}

export default class SelectedEncounter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};

    this.showSelectedEncounterOnScreen = this.showSelectedEncounterOnScreen.bind(this);
  }

  componentDidMount() {
    const { campaign, encounter } = this.props;

    socket.on(EncounterEvents.DATA_SEND, (encounterData: any) => {
      this.setState({ encounterData });
    });
    socket.emit(EncounterEvents.DATA_GET, campaign, encounter);
  }

  componentWillUnmount() {
    socket.off(EncounterEvents.DATA_SEND);
  }

  showSelectedEncounterOnScreen() {
    const { campaign, encounter } = this.props;
    socket.emit(EncounterEvents.SHOW, campaign, encounter);
  }

  render() {
    const { campaign, encounter } = this.props;
    const { encounterData } = this.state;
    return (
      <Section>
        <SectionTitle>{encounter}</SectionTitle>
        <ActionsContainer>
          <Button onClick={this.showSelectedEncounterOnScreen}>
            Show to screen
          </Button>
        </ActionsContainer>
        <CanvasContainer>
          {encounterData
            ? (
              <>
                {encounterData.layers.filter(l => l.type === 'texture')
                  .map(l => (<BackImg key={l.key} src={`/modules/${l.texture}`} />))}
              </>
            )
            : (<div>No pics</div>)
          }
          <EncounterLayer campaign={campaign} encounter={encounter} layerId='fog-of-war' color='black'></EncounterLayer>
        </CanvasContainer>
      </Section>
    );
  }
}