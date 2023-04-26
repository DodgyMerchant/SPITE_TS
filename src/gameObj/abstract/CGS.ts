/**
 *
 */
export enum CGS_TYPE {
  /**
   *
   */
  NEW,
  /**
   *
   */
  CONTINUED,
  /**
   *
   */
  END,
}

export type CGS_Contact = {
  /**
   * type of contact.
   */
  type: CGS_TYPE;
  /**
   * x coordinate of contact relative to top left corner of sprite.
   */
  x: number;
  /**
   * y coordinate of contact relative to top left corner of sprite.
   */
  y: number;
};

export type CGS_Frame = {
  /**
   * animation index a.k.a. frame.
   */
  index: number;
  contacts: CGS_Contact[];
};

export type CGSManager = {
  /**
   * set CGS entry for a key.
   *
   * undefined if no entry exists.
   * @param key
   */
  CGSget(key: string): CGS_Frame[] | undefined;
  /**
   * set CGS entry for a key.
   * @param key
   * @param frameList
   */
  CGSset(key: string, frameList: CGS_Frame[]): void;
};
