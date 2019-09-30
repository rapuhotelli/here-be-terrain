import React, { Component } from 'react';
import styled from 'styled-components';

import { InitiativeEvents } from '../../../hbt-common/socketIoEvents';
import InitiativeTracker, { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';

import socket from '../socket';
import { Section, SectionTitle } from '../styled_components/Section';
import AddCreatureInitiative from './AddCreatureInitiative';
import CurrentTurn from './CurrentTurn';
import InitiativePosition from './InitiativePosition';
import InitiativesList from './InitiativesList';

const TrackerSection = styled(Section)`
  width: 100%;
  max-width: 400px;
`;

interface Props { }
interface State {
  tracker: InitiativeTracker | null;
}

export default class InitiativeTrackerComponent extends Component<Props, State> {
  private positionFormRef: React.RefObject<InitiativePosition>;

  constructor(props: Props) {
    super(props);
    const state: State = {
      tracker: null,
    };
    this.state = state;

    this.setUpListeners = this.setUpListeners.bind(this);
    this.addCreatureInitiative = this.addCreatureInitiative.bind(this);
    this.setInitiativePosition = this.setInitiativePosition.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.delete = this.delete.bind(this);

    this.positionFormRef = React.createRef();
  }

  componentDidMount() {
    this.setUpListeners();
    socket.emit(InitiativeEvents.INIT);
  }

  componentWillUnmount() {
    socket.off(InitiativeEvents.UPDATE);
  }

  setUpListeners() {
    socket.on(InitiativeEvents.UPDATE, (tracker: InitiativeTracker) => {
      this.setState({ tracker });
      if (this.positionFormRef.current) {
        this.positionFormRef.current.updateValue(tracker.initiativePosition);
      }
    });
  }

  addCreatureInitiative(initiative: CreatureInitiative) {
    socket.emit(InitiativeEvents.ADD_CREATURE, initiative);
  }

  setInitiativePosition(newPosition: number) {
    socket.emit(InitiativeEvents.SET_POSITION, newPosition);
  }

  next() {
    socket.emit(InitiativeEvents.NEXT);
  }

  previous() {
    socket.emit(InitiativeEvents.PREVIOUS);
  }

  delete(initiative: CreatureInitiative) {
    socket.emit(InitiativeEvents.DELETE_CREATURE, initiative);
  }

  render() {
    if (!this.state.tracker) {
      return <div>Loading..</div>;
    }

    const [currentCreature, ...otherCreatures] = this.state.tracker.initiatives;

    return (
      <TrackerSection>
        <SectionTitle main>Initiative tracker</SectionTitle>
        <InitiativePosition
          ref={this.positionFormRef}
          onNext={this.next}
          onPrevious={this.previous}
          onSubmit={this.setInitiativePosition}
          position={this.state.tracker.initiativePosition} />
        <AddCreatureInitiative onSubmit={this.addCreatureInitiative} />
        <CurrentTurn initiative={currentCreature} onDelete={this.delete} />
        <InitiativesList initiatives={otherCreatures} onDelete={this.delete}/>
      </TrackerSection>
    );
  }
}

