export type CreatureInitiative = {
  creature: string;
  initiative: number;
};

export default class InitiativeTracker {
  initiatives: CreatureInitiative[];
  initiativePosition: number;

  constructor(initiatives: CreatureInitiative[] = [], initiativePosition: number = 0) {
    this.initiatives = initiatives;
    this.initiativePosition = initiativePosition;
  }

  reset() {
    this.initiatives = [];
    this.initiativePosition = 0;
  }

  /**
   * Add or change initiative for a creature
   * @param creature 
   * @param initiative 
   */
  setCreatureInitiative({ creature, initiative }: CreatureInitiative) {
    const creatureInitiativeIndex = this.initiatives.findIndex(i => i.creature === creature);
    if (creatureInitiativeIndex > -1) {
      this.initiatives[creatureInitiativeIndex].initiative = initiative;
    } else {
      this.initiatives.push({ creature, initiative });
    }
    this.sortInitiatives();
  }

  /**
   * Set the current position in the initiative round
   * @param initiativePosition 
   */
  setPosition(initiativePosition: number) {
    this.initiativePosition = initiativePosition;
    this.sortInitiatives();
  }

  /**
   * Move to the next creature in the initiative round
   */
  nextCreature() {
    if (this.initiatives.length < 2) return;
    this.initiativePosition = this.initiatives[1].initiative;
    this.sortInitiatives();
  }

  /**
   * Move to the previous creature in the initiative round
   */
  prevCreature() {
    if (this.initiatives.length < 2) return;
    this.initiativePosition = this.initiatives[this.initiatives.length - 1].initiative;
    this.sortInitiatives();
  }

  /**
   * Remove a creature from the initiative
   * @param creature 
   */
  removeCreature(creature: string) {
    const creatureIndex = this.initiatives.findIndex(i => i.creature === creature);
    if (creatureIndex > -1) {
      this.initiatives.splice(creatureIndex, 1);
    }
  }

  sortInitiatives() {
    const sortedInitiatives = this.initiatives.sort((a, b) => b.initiative - a.initiative);
    const biggerInitiatives = sortedInitiatives.filter((i) => i.initiative > this.initiativePosition);
    const smallerInitiatives = sortedInitiatives.filter((i) => i.initiative <= this.initiativePosition);

    this.initiatives = [...smallerInitiatives, ...biggerInitiatives];
  }
}
