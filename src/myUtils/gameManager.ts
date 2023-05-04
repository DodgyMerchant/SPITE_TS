import { DebugScene } from "../scenes/DebugScene";
import { sc_MyScene } from "../scenes/abstract/sc_MyScene";

/**
 * Phaser Game Manager CLass.
 * General Phaser Utility
 */
export class GameManager {
  Game: Phaser.Game;
  /**
   * the targeted frames per second
   */
  FPS_Target: number;

  /**
   * one second calculated in frames.
   */
  OneSec: number;

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

    this.FPS_Target = this.Game.loop.targetFps;
    this.OneSec = this.Game.loop.targetFps;

    console.log("Used renderer: ", this.Game.renderer.constructor.name);
  }

  /**
   * Phaser Scene utility bundle.
   */
  static Scene = {
    /**
     *
     * Creates scene and/or adds it to update group.
     * If scene not present in system creates scene.
     * @param ScenePlugin
     * @param key key string to add the scene/look for.
     * @param SceneClass a scene class to switch to.
     * @returns Scene Instance.
     */
    Add(
      ScenePlugin: Phaser.Scenes.ScenePlugin,
      key: string,
      SceneClass: new (...args: any) => Phaser.Scene
    ): Phaser.Scene | null {
      // this.Game.scene.getIndex("");

      let scene = ScenePlugin.get(key);
      if (scene == null && SceneClass) {
        return ScenePlugin.add(key, SceneClass, false);
      } else {
        return scene;
      }
    },

    UniqueAdd(ScenePlugin: Phaser.Scenes.ScenePlugin, SceneClass: new (...args: any) => Phaser.Scene): Phaser.Scene | null {
      return this.Add(ScenePlugin, SceneClass.name, SceneClass);
    },

    /**
     * the sene order.
     *
     * the "top" scene is the last one in the scene list that is active.
     */
    Order: {
      /**
       * get the top scene.
       * @param ScenePlugin
       * @returns
       */
      getTop(ScenePlugin: Phaser.Scenes.ScenePlugin): Phaser.Scene {
        let list = ScenePlugin.manager.scenes;
        return list[list.length - 1];
      },

      /**
       * check if given scene is ontop.
       * @param scene
       * @returns
       */
      isTop(scene: Phaser.Scene): boolean {
        return this.getTop(scene.scene) == scene;
      },
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

    /**
     * the order of game objects within a scene.
     *
     * the "top" scene is the last one in the scene list that is active.
     */
    Order: {
      /**
       * get top object
       * @param obj
       * @returns
       */
      getTop(obj: Phaser.GameObjects.GameObject): Phaser.GameObjects.GameObject {
        let list = obj.scene.children.list;

        return list[list.length - 1];
      },

      /**
       * check if object is ontop
       * @param scene
       * @returns
       */
      isTop(obj: Phaser.GameObjects.GameObject): boolean {
        return this.getTop(obj) == obj;
      },
    },
  };

  /**
   * Phaser Camera utility bundle.
   *
   * Notice for default pahser usage!!
   *
   * The camera view port and view, in world view, are weirdly intermingled with each other when it comes to property and function names.
   * This object solves this by making this shit usables and not confusing as fuck.
   *
   * In default phaser the camera is always the size of the port and only the zoom x/y values allow for changes in view width and height.
   * That meins alot of properties and funktion work with the "default", not zoomed in view.
   * This is fuckign stupid.
   *
   * All funktions here: if it says view it means the zoomed in view.
   */
  static Camera = {
    /**
     * the actual in world shown view.
     * With zoom applied and all.
     */
    View: {
      /**
       * sets tthe cameras world view to the given width and heigth values.
       * @param camera camera to set view.
       * @param width width ofthe wold view.
       * @param height width ofthe wold view. defaults to width.
       * @returns edited camera
       */
      SetSize(camera: Phaser.Cameras.Scene2D.Camera, width: number, height: number = width): Phaser.Cameras.Scene2D.Camera {
        return camera.setZoom(camera.width / width, camera.height / height);
      },

      /**
       * sets the given cameras top left position in the game world.
       * @param camera camera to edit.
       * @param x x coordinate of the top left position of the camera in the game world.
       * @param y y coordinate of the top left position of the camera in the game world.
       * @returns the camera.
       */
      SetPos(camera: Phaser.Cameras.Scene2D.Camera, x: number, y: number) {
        return camera.setScroll(x - this.GetZoomOffsetX(camera), y - this.GetZoomOffsetY(camera));
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

      /**
       * Gets the x coordinate of the top left edge of the view, in world zoom applied view.
       * @param camera camera to get the x coordinate from.
       * @returns x coordinate.
       */
      GetX(camera: Phaser.Cameras.Scene2D.Camera): number {
        return camera.worldView.x;
      },
      /**
       * Gets the y coordinate of the top left edge of the view, in world zoom applied view.
       * @param camera camera to get the y coordinate from.
       * @returns y coordinate.
       */
      GetY(camera: Phaser.Cameras.Scene2D.Camera): number {
        return camera.worldView.y;
      },
      /**
       * Gets the width the view, in world zoom applied view.
       * @param camera camera to get the width of.
       * @returns width of view.
       */
      GetWidth(camera: Phaser.Cameras.Scene2D.Camera): number {
        return camera.worldView.width;
      },
      /**
       * Gets the width the view, in world zoom applied view.
       * @param camera camera to get the width of.
       * @returns width of view.
       */
      GetHeight(camera: Phaser.Cameras.Scene2D.Camera): number {
        return camera.worldView.height;
      },

      /**
       * gets the camera zoom offset that occurs when applying zoom.
       * The offset is the distance on the x axis from the top left corner of the unzoomed view and the top left corner of the zoomed in view.
       * @param camera
       * @returns offset x axis
       */
      GetZoomOffsetX(camera: Phaser.Cameras.Scene2D.Camera): number {
        return (camera.width - camera.displayWidth) * 0.5;
      },
      /**
       * gets the camera zoom offset that occurs when applying zoom.
       * The offset is the distance on the y axis from the top left corner of the unzoomed view and the top left corner of the zoomed in view.
       * @param camera
       * @returns offset y axis
       */
      GetZoomOffsetY(camera: Phaser.Cameras.Scene2D.Camera): number {
        return (camera.height - camera.displayHeight) * 0.5;
      },
    },
  };

  static Anim = {
    /**
     * get animation frame index from sprite object.
     * @param spriteObj target object.
     * @returns index of current animation frame.
     */
    GetIndex(spriteObj: Phaser.GameObjects.Sprite): number | undefined {
      return spriteObj.anims.currentFrame?.index;
    },

    /**
     *  get current frame of sprite object object.
     * @param index number index of animation frame in animation from sprite object.
     * @param spriteObj target object.
     * @returns animation frame object, or undefiend if no animation is set in obj or index out of bounds.
     */
    GetFrame(spriteObj: Phaser.GameObjects.Sprite, index: number): Phaser.Animations.AnimationFrame | undefined {
      return spriteObj.anims.currentAnim?.frames[index];
    },
  };
}
