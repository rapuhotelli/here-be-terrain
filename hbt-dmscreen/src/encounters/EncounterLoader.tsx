import React, { Component } from 'react';
import styled from 'styled-components';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Section, SectionTitle } from '../styled_components/Section';
import SelectedEncounter from './SelectedEncounter';

const ReloadScreenButton = styled(Button)`
  display: block;
  margin-bottom: 8px;
`;

const EncounterButton = styled(Button)`
  display: block;
  margin: 8px 8px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const EncounterList = styled.div`
  flex-shrink: 0;
  width: 30%;
`;

const EncounterSection = styled.div`
  flex: 1;
`;

type EncounterKey = string;
interface Campaigns {
  [campaignName: string]: EncounterKey[];
}
interface State {
  campaigns: Campaigns;
  selectedCampaign?: string;
  selectedEncounter?: EncounterKey;
  selectedEncounterReady?: boolean;
}

export default class EncounterLoader extends Component<Object, State> {
  constructor(props: Object) {
    super(props);

    this.state = {
      campaigns: {},
    };

    this.loadEncounter = this.loadEncounter.bind(this);
    this.reloadScreen = this.reloadScreen.bind(this);
  }
  componentDidMount() {
    socket.on(EncounterEvents.LIST_UPDATE, (data: Campaigns) => {
      this.setState({ campaigns: data });
    });
    socket.on(EncounterEvents.READY, () => {
      this.setState({ selectedEncounterReady: true });
    });
    socket.emit(EncounterEvents.LIST_LOAD);
  }

  componentWillUnmount() {
    socket.off(EncounterEvents.LIST_UPDATE);
    socket.off(EncounterEvents.READY);
  }

  loadEncounter(campaign: string, encounter: string) {
    this.setState({
      selectedCampaign: campaign,
      selectedEncounter: encounter,
      selectedEncounterReady: false,
    });
    socket.emit(EncounterEvents.LOAD, campaign, encounter);
  }
  
  reloadScreen() {
    socket.emit(EncounterEvents.RELOAD);
  }

  render() {
    const {
      campaigns,
      selectedCampaign,
      selectedEncounter,
      selectedEncounterReady,
    } = this.state;
    return (
      <Section>
        <SectionTitle main>Encounter Loader</SectionTitle>
        <FlexContainer>
          <EncounterList>
            <ReloadScreenButton onClick={this.reloadScreen}>Reload Screen</ReloadScreenButton>
            {Object.keys(campaigns).map((campaignName) => {
              const encounters = campaigns[campaignName];
              return (
                <Section key={campaignName}>
                  <SectionTitle>{campaignName}</SectionTitle>
                  {encounters.map((encounterKey) => (
                    <EncounterButton key={encounterKey}
                      onClick={() => this.loadEncounter(campaignName, encounterKey)}>
                      {encounterKey} >
                    </EncounterButton>
                  ))}
                </Section>
              );
            })}
          </EncounterList>
          <EncounterSection>
            {selectedEncounter && selectedCampaign && selectedEncounterReady
              ? (<SelectedEncounter campaign={selectedCampaign} encounter={selectedEncounter} />)
              : (<SectionTitle>No encounter selected!</SectionTitle>)
            }
          </EncounterSection>
        </FlexContainer>

      </Section>
    );
  }
}