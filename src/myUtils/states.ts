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

/**
 * Basic state class.
 */
export abstract class StateClass implements SimpleState {
  /**
   * name of the state.
   *
   * read only!
   */
  readonly name: string;

  /**
   *
   * @param name name of the state.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * return state name
   * @returns
   */
  toString(): string {
    return this.name;
  }
}

//Object
/**
 * State Object.
 *
 * Object that has state interface abilities.
 */
export type StateObject<StateType> = {
  /**
   * get this objects state.
   */
  StateGet(): StateType;
  /**
   * set this objects state.
   * @param newState new object state.
   */
  StateSet(newState: StateType): void;
};

/**
 * A state Object that has complex states
 *
 * Object that has state interface abilities.
 */
export type StateComplexObject<StateType> = {
  /**
   * get this objects state.
   */
  StateGet(): StateType;
  /**
   * set this objects state.
   * @param stateObj state object to apply state changes to.
   * @param newState new object state.
   */
  StateSet(stateObj: object, newState: StateType): void;
};

/**
 * interface for nested states.
 * So that a nested state can refrence the parent.
 */
export interface NestedStateInterface<IndexType, ParentType extends MultiStateInterface<IndexType> | undefined> {
  /**
   * multi state parent
   */
  parent: ParentType | undefined;
}

/**
 * root of nested interfaces.
 * nested states cant reach beyond that as parent refrence will always be undefined.
 */
export interface RootStateInterface<IndexType> extends NestedStateInterface<IndexType, undefined> {
  /**
   * @override
   * End of nested states.
   */
  parent: undefined;
}

/**
 * interface for nested states.
 * So that a nested state can change the state of any state up the chain.
 */
export interface MultiStateInterface<IndexType> {
  /**
   * finds state up the chain and switches the state with another state.
   * @param fromState
   * @param toState
   */
  MultiStateSwitch(stateObj: object, fromState: IndexType, toState: IndexType): boolean;
}

/**
 * state that runs an update every step, apply and undo.
 */
export interface ActiveComplexState extends ComplexState {
  /**
   * function run every step.
   */
  stateUpdate: Function;
  /**
   * function run once on change to (apply) or from (undo) this stare.
   */
  stateApply: Function | undefined;
  /**
   * function run once on change to (apply) or from (undo) this stare.
   */
  stateUndo: Function | undefined;
}

/**
 * A state that has a substate.
 * Wich is in itself a multi state or a complex state.
 */
export abstract class StateMultiClass<SubStateType extends ComplexState>
  extends StateClass
  implements StateComplexObject<SubStateType>, ComplexState
{
  /**
   * Current sub state.
   */
  private _state: SubStateType;

  /**
   * create a State with substates.
   * @param name name of the state.
   * @param state current substate of this state.
   */
  constructor(name: string, state: SubStateType) {
    super(name);

    this._state = state;
  }

  apply(stateObj: object): void {
    this._state.apply(stateObj);
  }
  undo(stateObj: object): void {
    this._state.undo(stateObj);
  }

  StateGet(): SubStateType {
    return this._state;
  }
  StateSet(stateObj: object, newSubState: SubStateType): void {
    this._state.undo(stateObj);
    this._state = newSubState;
    this._state.apply(stateObj);
  }

  /**
   * return this and active substates names.
   * works recursivly.
   */
  toString(): string {
    return super.toString() + ", " + this._state.toString();
  }
}
