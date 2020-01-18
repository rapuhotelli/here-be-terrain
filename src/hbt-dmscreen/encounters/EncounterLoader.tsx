import React, { Component, useState } from 'react';
import styled, { css } from 'styled-components';

import { EncounterEvents, ScreenEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Page, PageTitle, Section, SectionTitle } from '../styled_components/Page';
import SelectedEncounter from './SelectedEncounter';

const PageHeader = styled.div`
  position: relative;
  height: 36px;
`;

const ActionBar = styled.div`
  position: absolute;
  left: 0;
`;

const OpenEncountersButton = styled(Button)`
  margin-right: 4px;
`;

const EncounterButton = styled(Button)`
  display: block;
  margin: 8px 8px;
`;

const FlexContainer = styled.div`
  display: flex;
  padding: 8px 0;
`;

const EncounterList = styled.div`
  flex-shrink: 0;
  width: 20%;
  transition: .3s;
  overflow: hidden;

  ${(props: { hide?: boolean }) => props.hide && css`
    width: 0;
  `}
`;

const EncounterSection = styled.div`
  flex: 1;
  padding-left: 8px;
  background-color: white;
  border-left: 1px solid #ddd;
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
  hideEncounters: boolean;
}

export default class EncounterLoader extends Component<Object, State> {
  constructor(props: Object) {
    super(props);

    this.state = {
      campaigns: {},
      hideEncounters: false,
    };

    this.loadEncounter = this.loadEncounter.bind(this);
    this.reloadScreen = this.reloadScreen.bind(this);
    this.toggleEncounters = this.toggleEncounters.bind(this);
  }
  componentDidMount() {
    console.log('aargh');
    socket.on(EncounterEvents.LIST_UPDATE, (data: Campaigns) => {
      this.setState({ campaigns: data });
    });
    socket.on(EncounterEvents.READY, () => {
      this.setState({
        selectedEncounterReady: true,
        // hideEncounters: true,
      });
    });
    socket.on(ScreenEvents.STARTED, () => {
      this.setState({
        selectedCampaign: undefined,
        selectedEncounter: undefined,
        selectedEncounterReady: false,
        hideEncounters: false,
      });
    });
    socket.emit(EncounterEvents.LIST_LOAD);
  }

  componentWillUnmount() {
    socket.off(EncounterEvents.LIST_UPDATE);
    socket.off(EncounterEvents.READY);
    socket.off(ScreenEvents.STARTED);
  }

  loadEncounter(campaign: string, encounter: string) {
    console.log('loadEncounter', campaign, encounter);
    this.setState({
      selectedCampaign: campaign,
      selectedEncounter: encounter,
      selectedEncounterReady: false,
    });

    socket.emit(EncounterEvents.LOAD, campaign, encounter);
  }
  
  reloadScreen() {
    socket.emit(ScreenEvents.RELOAD);
  }

  toggleEncounters() {
    this.setState(({ hideEncounters }) => ({ hideEncounters: !hideEncounters }));
  }

  render() {
    const {
      campaigns,
      selectedCampaign,
      selectedEncounter,
      selectedEncounterReady,
      hideEncounters,
    } = this.state;

    return (
      <Page>
        <PageHeader>
          <ActionBar>
            <OpenEncountersButton onClick={this.toggleEncounters}>{hideEncounters ? 'Show Encounter List' : 'Hide Encounter List'}</OpenEncountersButton>
            <Button onClick={this.reloadScreen}>Reload Screen</Button>
          </ActionBar>
          <PageTitle>Encounter Loader</PageTitle>
        </PageHeader>
        <FlexContainer>
          <EncounterList hide={hideEncounters}>
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
      </Page>
    );
  }
}