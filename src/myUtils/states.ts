/**
 * some state stuff.
 */

// State
export type SimpleState = {
  /**
   * name of the enum.
   */
  readonly name: string;

  toString(): string;
};

export type ComplexState = SimpleState & {
  /**
   * apply state properties to object.
   * @param stateObj state object to apply states to.
   */
  apply(stateObj: object): void;

  /**
   * disable/undo state changes.
   * @param stateObj state object to unapply states to.
   */
  undo(stateObj: object): void;
};

export abstract class StateClass implements SimpleState {
  readonly name: string;

  /**
   *
   * @param name name of the enum.
   */
  constructor(name: string) {
    this.name = name;
  }

  toString(): string {
    return this.name;
  }
}

//State Object
export type StateObject<StateType> = {
  /**
   * get this objects state.
   */
  baseGet(): StateType;
  /**
   * set this objects state.
   * @param newState new object state.
   */
  baseSet(newState: StateType): void;
};
