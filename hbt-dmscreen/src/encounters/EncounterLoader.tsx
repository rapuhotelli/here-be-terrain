import React, { Component } from 'react';
import styled from 'styled-components';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Section, SectionTitle } from '../styled_components/Section';

const EncounterButton = styled(Button)`
  display: block;
  margin: 8px 8px;
`;

type EncounterKey = string;
interface Campaigns {
  [campaignName: string]: EncounterKey[];
}
interface State {
  campaigns: Campaigns;
}

export default class EncounterLoader extends Component<Object, State> {
  constructor(props: Object) {
    super(props);

    this.state = {
      campaigns: {},
    };

    this.loadEncounter = this.loadEncounter.bind(this);
  }
  componentDidMount() {
    socket.on(EncounterEvents.UPDATE_LIST, (data:Campaigns) => {
      this.setState({ campaigns: data });
    });
    socket.emit(EncounterEvents.LOAD_LIST);
  }

  componentWillUnmount() {
    socket.off(EncounterEvents.UPDATE_LIST);
  }

  loadEncounter(campaign: string, encounter: string) {
    socket.emit(EncounterEvents.LOAD, campaign, encounter);
  }

  render() {
    const { campaigns } = this.state;
    return (
      <Section>
        <SectionTitle main>Encounter Loader</SectionTitle>
        {Object.keys(campaigns).map((campaignName) => {
          const encounters = campaigns[campaignName];
          return (
            <Section key={campaignName}>
              <SectionTitle>{campaignName}</SectionTitle>
              {encounters.map((encounterKey) => (
                <EncounterButton key={encounterKey}
                  onClick={() => this.loadEncounter(campaignName, encounterKey)}>
                  {encounterKey}
                </EncounterButton>
              ))}
            </Section>
          );
        })}
      </Section>
    );
  }
}