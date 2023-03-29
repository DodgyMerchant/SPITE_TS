import Phaser from "phaser";
import sc_Init from "./scenes/sc_Init";
import { sc_MyScene } from "./scenes/sc_MyScene";

/*
tried fixing render context willReadFrequently warning.
if more warnings pop up this might fix it.
*/
// let myCanvas = document.createElement("canvas");
// let myCont =
//   myCanvas.getContext("2d", { willReadFrequently: true }) ?? undefined;

const config: Phaser.Types.Core.GameConfig = {
  title: "SPITE",
  type: Phaser.AUTO,
  // type: Phaser.CANVAS,
  parent: "phaser-div",
  // canvas: myCanvas,
  // context: myCont,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: false,
  },
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [sc_Init],
};

/**
 * My Custom Phaser Game Manager CLass.
 */
class GameManager {
  Game: Phaser.Game;

  constructor(GameConfig?: Phaser.Types.Core.GameConfig | undefined) {
    this.Game = new Phaser.Game(GameConfig);

    console.log("Used renderer: ", this.Game.renderer.constructor.name);
  }

  /**
   * Initializes scene.
   * If scene not present in system creates scene.
   * @param key key string to add the scene/look for.
   * @param SceneClass a scene class to switch to.
   * @returns Scene Instance.
   */
  SceneAdd(key: string, SceneClass: new (...args: any) => Phaser.Scene): Phaser.Scene {
    // this.Game.scene.getIndex("");

    let scene = this.Game.scene.getScene(key);
    if (scene == null) {
      return this.Game.scene.add(key, SceneClass);
    } else {
      return scene;
    }
  }

  gameObjectAddUpdate(scene: sc_MyScene, child: Phaser.GameObjects.GameObject, addToScene?: boolean | undefined) {
    scene.GroupAlive?.add(child, addToScene);
  }
}

export const gameManager: GameManager = new GameManager(config);
