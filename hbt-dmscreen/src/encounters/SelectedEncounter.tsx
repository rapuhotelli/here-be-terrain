import React, { Component } from 'react';
import styled from 'styled-components';

import { IEncounter } from '../../../hbt-common/interfaces';
import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Section, SectionTitle } from '../styled_components/Page';
import { LabeledSelect } from '../styled_components/SelectInput';
import EncounterLayer from './EncounterLayer';

const ActionsContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const LayerSelection = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 80%;
  padding-top: ${0.8 * 9 / 16 * 100}%;
`;

const BackImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const ShowToScreenButton = styled(Button)`
  margin-right: 4px;
`;

interface Props {
  campaign: string;
  encounter: string;
}
interface State {
  encounterData?: IEncounter;
  selectedLayerId: string;
}

export default class SelectedEncounter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedLayerId: 'fogofwar',
    };

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
    const { encounterData, selectedLayerId } = this.state;
    return (
      <Section>
        <SectionTitle>Selected encounter: {encounter}</SectionTitle>
        <ActionsContainer> 
          <ShowToScreenButton onClick={this.showSelectedEncounterOnScreen}>
            Show encounter to screen
          </ShowToScreenButton>
          <LayerSelection>
            <LabeledSelect value={selectedLayerId} labelText='Edit layer:' onChange={(e: any) => {
              this.setState({ selectedLayerId: e.target.value });
            }}>
              <option value='fogofwar'>Fog of war</option>
              <option value='fire'>Fire</option>
            </LabeledSelect>
          </LayerSelection>
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
          <EncounterLayer campaign={campaign} encounter={encounter} selected={selectedLayerId === 'fogofwar'} zIndex={selectedLayerId === 'fogofwar' ? 2 : 1} layerId='fogofwar' color='black'></EncounterLayer>
          <EncounterLayer campaign={campaign} encounter={encounter} selected={selectedLayerId === 'fire'} zIndex={selectedLayerId === 'fire' ? 2 : 1} layerId='fire' color='#ef4209'></EncounterLayer>
        </CanvasContainer>
      </Section>
    );
  }
}