import Phaser, { Game } from "phaser";
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
  static Scene = {
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
  static Load = {
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
  static GmObj = {
    /**
     * check if the given object is contained in the scenes update list.
     * IMPORTANT: If an Object was just added to a scene the object might still be in processing and this function will return a false negative!!!
     * There is no way of cleanly checking if an object is still in processing because the Display List Processing List is for some fucking reason a hidden property.
     * @param scene
     * @param child
     * @returns boolean true if exits
     */
    UpdateCheck<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T): boolean {
      return scene.sys.updateList.getActive().includes(child);
    },

    /**
     * check if the given object is contained in the scenes display list.
     * @param scene
     * @param child
     * @returns boolean true if exits
     */
    DisplayCheck<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T): boolean {
      return scene.children.exists(child);
    },

    /** adding an GameObject to a scene and scene properties */
    Add: {
      /**
       * Adds existing game object to the scene.
       * Sets all necessery variables and adds it to all lists.
       * @param scene
       * @param child
       * @returns child
       */
      Add<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T): T {
        scene.add.existing(child);

        if (child.scene != scene) child.scene = scene;

        return child;
      },
      /**
       * adds an object to the update group.
       * Optionally adds it to the scene.
       * @param scene game scene to reference.
       * @param child GameObject to add.
       * @param addToScene if it should be added to scenen.
       * @returns game object instance
       */
      ActivateUpdate<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T, addToScene: boolean | undefined): T {
        scene.GroupAlive?.add(child, false);

        if (addToScene) {
          this.Add(scene, child);
        }

        return child;
      },

      /**
       * adds an GameObject Instance to the scene and adds it to the update group.
       * @param scene game scene to reference.
       * @param child GameObject to add.
       * @returns game object instance
       */
      AddnUpdate<T extends Phaser.GameObjects.GameObject>(scene: sc_MyScene, child: T) {
        return this.ActivateUpdate(scene, child, true);
      },
    },

    /**
     * removing an GameObject from a scene and scene properties.
     * Note that removing an object from a scene or its systems may automatically set the associated booleans to false.
     * This is stupid and mentioned no where.
     *
     * Known cases of this are:
     * Removing from display list -> visible = false;
     * Removing from update list -> active = false
     *
     * MIght also be because im getting an object from a disabled scene?????
     * Need to check
     */
    Remove: {
      /**
       * remove child from the scene completely.
       * @param scene
       * @param child child to remove
       * @param skipCallback Skip calling the List.removeCallback. Default false.
       * @returns child
       */
      Remove<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T, skipCallback?: boolean | undefined): T {
        //display list
        if (GameManager.GmObj.DisplayCheck(scene, child)) this.RemoveDisp(scene, child, skipCallback);
        //update list
        if (GameManager.GmObj.UpdateCheck(scene, child)) this.RemoveUpdate(scene, child);

        return child;
      },

      /**
       * remove Game object from scene display list.
       * @param scene
       * @param child child to remove
       * @param skipCallback Skip calling the List.removeCallback. Default false.
       * @returns child
       */
      RemoveDisp<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T, skipCallback?: boolean | undefined): T {
        scene.children.remove(child, skipCallback);
        return child;
      },

      /**
       * remove Game object from scene update list.
       * @param scene
       * @param child child to remove
       * @param skipCallback Skip calling the List.removeCallback. Default false.
       * @returns child
       */
      RemoveUpdate<T extends Phaser.GameObjects.GameObject>(scene: Phaser.Scene, child: T): T {
        scene.sys.updateList.remove(child);
        return child;
      },
    },

    /** moving GameObjects between scenes */
    Move: {
      /**
       * Moves a child GameObject from one scene to the other
       * @param fromScene scene to remove GameObject from.
       * @param toScene scene to add GameObject to.
       * @param child child to move.
       * @returns child.
       */
      Move<T extends Phaser.GameObjects.GameObject>(fromScene: Phaser.Scene, toScene: Phaser.Scene, child: T): T {
        GameManager.GmObj.Remove.Remove(fromScene, child);
        GameManager.GmObj.Add.Add(toScene, child);

        return child;
      },
    },
  };

  /**
   * Phaser Camera utility bundle.
   */
  static Camera = {
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

    /**
     * sets the given cameras top left position in the game world.
     * @param camera camera to edit.
     * @param x x coordinate of the top left position of the camera in the game world.
     * @param y y coordinate of the top left position of the camera in the game world.
     * @returns the camera.
     */
    SetPosition(camera: Phaser.Cameras.Scene2D.Camera, x: number, y: number) {
      return camera.setPosition(x, y);
    },

    /**
     * sets the given cameras center position in the game world.
     * @param camera camera to edit.
     * @param x x coordinate of the center of the camera in the game world.
     * @param y y coordinate of the center of the camera in the game world.
     * @returns the camera.
     */
    SetCenter(camera: Phaser.Cameras.Scene2D.Camera, x: number, y: number) {
      return camera.centerOn(x, y);
    },
  };
}

export const gameManager: GameManager = new GameManager(config);
