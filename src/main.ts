import Phaser from "phaser";
import sc_Init from "./scenes/gameScenes/sc_Init";
import { DebugScene } from "./scenes/abstract/DebugScene";
import { sc_MyScene } from "./scenes/abstract/sc_MyScene";

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
    antialiasGL: false,
    pixelArt: true,
    roundPixels: false,
  },
  // width: 100,
  // height: 100,
  // zoom: 8,
  width: 800,
  height: 800,
  zoom: 1,
  pixelArt: true,
  scene: [sc_Init],
  fps: {
    forceSetTimeOut: true,
    target: 60,
  },
};

/**
 * My Custom Phaser Game Manager CLass.
 */
export class GameManager {
  Game: Phaser.Game;

  Scales = {
    PortWidth: 800,
    PortHeight: 800,
    ViewWidth: 100,
    ViewHeight: 100,
  };

  DebugScene: DebugScene;

  constructor(GameConfig?: Phaser.Types.Core.GameConfig | undefined) {
    this.DebugScene = new DebugScene(0, 0, this.Scales.PortWidth, this.Scales.PortHeight, 1);

    this.Game = new Phaser.Game(GameConfig);

    console.log("Used renderer: ", this.Game.renderer.constructor.name);
  }

  /**
   * Phaser Scene utility bundle.
   */
  Scene = {
    /**
     * Creates scene and/or adds it to update group.
     * If scene not present in system creates scene.
     * @param key key string to add the scene/look for.
     * @param SceneClass a scene class to switch to.
     * @returns Scene Instance.
     */
    Add(sceneManager: Phaser.Scenes.ScenePlugin, key: string, SceneClass: new (...args: any) => Phaser.Scene): Phaser.Scene {
      // this.Game.scene.getIndex("");

      let scene = sceneManager.get(key);
      if (scene == null && SceneClass) {
        return sceneManager.add(key, SceneClass, false);
      } else {
        return scene;
      }
    },

    UniqueAdd(sceneManager: Phaser.Scenes.ScenePlugin, SceneClass: new (...args: any) => Phaser.Scene): Phaser.Scene {
      return this.Add(sceneManager, SceneClass.name, SceneClass);
    },
  };

  /**
   * Phaser Loading utility bundle.
   */
  Load = {
    /**
     * WIP
     */
    strip(
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
    },
  };

  /**
   * Phaser Game Object utility bundle.
   */
  GameObject = {
    /**
     * adds an object to the update group.
     * Optionally adds it to the scene.
     * @param scene game scene to reference.
     * @param child GameObject to add.
     * @param addToScene if it should be added to scenen.
     * @returns game object instance
     */
    AddUpdate<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T, addToScene: boolean | undefined): T {
      scene.GroupAlive?.add(child, addToScene);
      return child;
    },

    /**
     * adds an GameObject INstance to the scene and adds it to the update group.
     * @param scene game scene to reference.
     * @param child GameObject to add.
     * @returns game object instance
     */
    Add<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T) {
      return this.AddUpdate(scene, child, true);
    },
  };

  /**
   * Phaser Camera utility bundle.
   */
  Camera = {
    /**
     * sets tthe cameras world view to the given width and heigth values.
     * @param camera camera to set view.
     * @param width width ofthe wold view.
     * @param height width ofthe wold view. defaults to width.
     * @returns edited camera
     */
    SetViewSize(camera: Phaser.Cameras.Scene2D.Camera, width: number, height: number = width): Phaser.Cameras.Scene2D.Camera {
      return camera.setZoom(camera.width / width, camera.height / height);
    },
  };
}

export const gameManager: GameManager = new GameManager(config);
