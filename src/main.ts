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
  height: 800,
  pixelArt: true,
  scene: [sc_Init],
};

/**
 * My Custom Phaser Game Manager CLass.
 */
class GameManager {
  Game: Phaser.Game;

  Scales = {
    PortWidth: 800,
    PortHeight: 800,
    ViewWidth: 100,
    ViewHeight: 100,
  };

  constructor(GameConfig?: Phaser.Types.Core.GameConfig | undefined) {
    this.Game = new Phaser.Game(GameConfig);

    console.log("Used renderer: ", this.Game.renderer.constructor.name);
  }
  //#region Scenes

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

  SceneUniqueAdd(SceneClass: new (...args: any) => Phaser.Scene): Phaser.Scene {
    return this.SceneAdd(SceneClass.name, SceneClass);
  }

  //#endregion Scenes
  //#region Preload

  loadStrip(
    scene: Phaser.Scene,
    spriteSheetConfig: Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig,
    animationCOnfig: Phaser.Types.Animations.Animation,
    frameConfig: Phaser.Types.Animations.GenerateFrameNumbers
  ) {
    scene.load
      .spritesheet(spriteSheetConfig)
      .on(
        "filecomplete-spritesheet-sheet_player_idle_idle",
        (fileKey: string, dataType: string, TextureObject: Phaser.Textures.Texture) => {
          animationCOnfig.frames = scene.anims.generateFrameNumbers(fileKey, frameConfig);
          scene.anims.create(animationCOnfig);
        }
      );
  }

  //#endregion Preload
  //#region Game Objects

  /**
   * adds an object to the update group.
   * Optionally adds it to the scene.
   * @param scene game scene to reference.
   * @param child GameObject to add.
   * @param addToScene if it should be added to scenen.
   * @returns game object instance
   */
  gameObjectAddUpdate<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T, addToScene: boolean | undefined): T {
    scene.GroupAlive?.add(child, addToScene);
    return child;
  }

  /**
   * adds an GameObject INstance to the scene and adds it to the update group.
   * @param scene game scene to reference.
   * @param child GameObject to add.
   * @returns game object instance
   */
  gameObjectAdd<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T) {
    return this.gameObjectAddUpdate(scene, child, true);
  }

  //#endregion Game Objects
  //#region camera

  Camera = {};

  //#endregion camera
}

export const gameManager: GameManager = new GameManager(config);
