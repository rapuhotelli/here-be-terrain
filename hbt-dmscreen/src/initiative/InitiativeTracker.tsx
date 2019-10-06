import React, { Component } from 'react';
import styled from 'styled-components';

import { IPlayerGroup } from '../../../hbt-common/interfaces';
import { InitiativeEvents } from '../../../hbt-common/socketIoEvents';
import InitiativeTracker, { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { Keypad, KeypadButton } from '../styled_components/Keypad';
import { Page, PageTitle, Section, SectionTitle } from '../styled_components/Page';
import AddCreatureInitiative from './AddCreatureInitiative';
import InitiativePosition from './InitiativePosition';
import InitiativesList from './InitiativesList';

const emit = function (event: string, ...args: any[]) {
  socket.emit(event, ...args);
  console.log('Emitting', event, ...args);
}

const FlexContainer = styled.div`
  display: flex;
`;

const ActionSection = styled(Section)`
  flex: 1;
  padding: 0 8px;
  position: relative;
`;

const StaticSection = styled(Section)`
  position: static;
`;

const TrackerSection = styled(Section)`
  width: 100%;
  max-width: 400px;

  flex-shrink: 0;
`;

const ClearInitiativeButton = styled(Button)`
  margin-right: 8px;
`;

interface Props { }
interface State {
  tracker: InitiativeTracker | null;
  playerGroups: IPlayerGroup[] | null;
  creaturesToAdd: string[];
  showAddCreatureForm: boolean;
}

export default class InitiativeTrackerComponent extends Component<Props, State> {
  private positionFormRef: React.RefObject<InitiativePosition>;
  private initiativeFormRef: React.RefObject<AddCreatureInitiative>;

  constructor(props: Props) {
    super(props);
    const state: State = {
      tracker: null,
      playerGroups: null,
      creaturesToAdd: [],
      showAddCreatureForm: false,
    };
    this.state = state;

    this.setUpListeners = this.setUpListeners.bind(this);
    this.addCreatureInitiative = this.addCreatureInitiative.bind(this);
    this.setInitiativePosition = this.setInitiativePosition.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.delete = this.delete.bind(this);
    this.loadPlayerGroup = this.loadPlayerGroup.bind(this);
    this.selectInitiative = this.selectInitiative.bind(this);
    this.resetTracker = this.resetTracker.bind(this);
    this.addCreatures = this.addCreatures.bind(this);
    this.showAddCreatureForm = this.showAddCreatureForm.bind(this);
    this.processCreaturesToAddList = this.processCreaturesToAddList.bind(this);
    this.hideAddCreatureForm = this.hideAddCreatureForm.bind(this);

    this.positionFormRef = React.createRef();
    this.initiativeFormRef = React.createRef();
  }

  componentDidMount() {
    this.setUpListeners();
    emit(InitiativeEvents.INIT);
    emit(InitiativeEvents.GROUPS_GET);
  }

  componentWillUnmount() {
    socket.off(InitiativeEvents.UPDATE);
    socket.off(InitiativeEvents.GROUPS_SEND);
  }

  setUpListeners() {
    socket.on(InitiativeEvents.UPDATE, (tracker: InitiativeTracker) => {
      this.setState({ tracker });
      if (this.positionFormRef.current) {
        this.positionFormRef.current.updateValue(tracker.initiativePosition);
      }
    });

    socket.on(InitiativeEvents.GROUPS_SEND, (playerGroups: IPlayerGroup[]) => {
      this.setState({ playerGroups });
    });
  }

  addCreatureInitiative(initiative: CreatureInitiative, addMore: boolean = false) {
    emit(InitiativeEvents.ADD_CREATURE, initiative);
    if (addMore) {
      // simple regexs to get the creature number
      // and increment it for the next one
      const execResult = /(\d*)\s*$/.exec(initiative.creature);
      if (execResult) {
        const [prevCreatureNumber] = execResult;
        const prevCreatureName = initiative.creature.replace(/\s+\d*\s*$/, '');
        this.showAddCreatureForm({
          creature: `${prevCreatureName} ${(+(prevCreatureNumber || '1'))+1}`,
          initiative: 1,
        }, true);
      }
    } else {
      this.processCreaturesToAddList();
    }
  }

  setInitiativePosition(newPosition: number) {
    emit(InitiativeEvents.SET_POSITION, newPosition);
  }

  next() {
    emit(InitiativeEvents.NEXT);
  }

  previous() {
    emit(InitiativeEvents.PREVIOUS);
  }

  delete(initiative: CreatureInitiative) {
    emit(InitiativeEvents.DELETE_CREATURE, initiative);
  }

  loadPlayerGroup(playerGroup: IPlayerGroup) {
    this.addCreatures(playerGroup.players);
  }

  selectInitiative(initiative: CreatureInitiative, addMore: boolean) {
    if (this.initiativeFormRef.current) {
      this.initiativeFormRef.current.updateValues(initiative, addMore);
    }
  }

  resetTracker() {
    emit(InitiativeEvents.RESET);
  }

  addCreatures(creatures = ['']) {
    this.setState(({ creaturesToAdd }) => {
      return { creaturesToAdd: [...creaturesToAdd, ...creatures] };
    }, this.processCreaturesToAddList);
  }

  processCreaturesToAddList() {
    const { creaturesToAdd } = this.state;
    const newCreature = creaturesToAdd.shift();
    if (typeof newCreature === 'string') {
      this.showAddCreatureForm({
        creature: newCreature,
        initiative: 1,
      });
    } else {
      this.setState({ showAddCreatureForm: false });
    }
  }

  showAddCreatureForm(initiative: CreatureInitiative, addMore: boolean = false) {
    this.setState({ showAddCreatureForm: true });
    this.selectInitiative(initiative, addMore);
  }

  hideAddCreatureForm() {
    this.processCreaturesToAddList();
  }

  render() {
    if (!this.state.tracker) {
      return <div>Loading..</div>;
    }

    const [currentCreature] = this.state.tracker.initiatives;
    // Sort descending; Do this after getting currentCreature
    // because .sort() does it in-place too.
    const creatures = this.state.tracker.initiatives.sort((a, b) => {
      if (a.initiative < b.initiative) {
        return 1;
      }
      if (a.initiative > b.initiative) {
        return -1;
      }
      return 0;
    });
    const { playerGroups, showAddCreatureForm } = this.state;

    return (
      <Page>
        <PageTitle>Initiative tracker</PageTitle>
        <FlexContainer>
          <TrackerSection>
            <InitiativePosition
              ref={this.positionFormRef}
              onNext={this.next}
              onPrevious={this.previous}
              onSubmit={this.setInitiativePosition}
              position={this.state.tracker.initiativePosition} />
            <InitiativesList
              initiatives={creatures}
              currentCreature={currentCreature}
              onDelete={this.delete}
              onEdit={this.showAddCreatureForm} />
          </TrackerSection>
          <ActionSection>
            <StaticSection>
              <SectionTitle>Initiative actions</SectionTitle>
              <AddCreatureInitiative
                ref={this.initiativeFormRef}
                show={showAddCreatureForm}
                onSubmit={this.addCreatureInitiative}
                onCancel={this.hideAddCreatureForm} />
              <ClearInitiativeButton onClick={this.resetTracker}>Clear initiative</ClearInitiativeButton>
              <Button onClick={() => this.addCreatures()}>Add new creature</Button>
            </StaticSection>
            <Section>
              <SectionTitle>Add player groups:</SectionTitle>
              {playerGroups
                ? playerGroups.map(group => (
                  <Button key={group.name} onClick={() => this.loadPlayerGroup(group)}>{group.name}</Button>
                ))
                : undefined
              }
            </Section>
          </ActionSection>
        </FlexContainer>
      </Page>
    );
  }
}

