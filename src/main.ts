import Phaser from "phaser";
import sc_Init from "./scenes/gameScenes/sc_Init";
import { GameManager } from "./myUtils/gameManager";

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

/**
 * My Phaser Game Manager Class.
 * Phaser Utility for this project.
 */
export class SPITEManager extends GameManager {
  /**
   * Phaser Loading utility bundle.
   *
   * Use only in scene preload method.
   */
  static Load = {
    /**
     * create a sprite animation from a image file.
     * Sheet will be accessible under the given key in the "spriteSheetConfig" object.
     * Animation will be accessible under the given key in the "animationConfig" object.
     * @param scene Scene to use.
     * @param spriteSheetConfig The key to use for this file, or a file configuration object, or array of them.
     * @param animationConfig The configuration settings for the Animation.  "frames" property will be overwritten by mext parameter.
     * @param frameConfig The configuration object for the animation frames.  Leave empty to use all frames in strip in default order: left to right.
     */
    strip(
      scene: Phaser.Scene,
      spriteSheetConfig: Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig,
      animationConfig: Phaser.Types.Animations.Animation,
      frameConfig?: Phaser.Types.Animations.GenerateFrameNumbers
    ) {
      scene.load
        .spritesheet(spriteSheetConfig)
        .on(
          "filecomplete-spritesheet-" + spriteSheetConfig.key,
          (fileKey: string, dataType: string, TextureObject: Phaser.Textures.Texture) => {
            //setting frames
            if (frameConfig) animationConfig.frames = scene.anims.generateFrameNumbers(fileKey, frameConfig);
            else animationConfig.frames = fileKey;

            scene.anims.create(animationConfig);
          }
        );
    },

    /**
     * real dirty mass sprite strip loading
     * @param scene
     * @param strips
     */
    OmegaStip(
      scene: Phaser.Scene,
      sheetPrefix: string,
      animPrefix: string,
      strips: (Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig &
        Phaser.Types.Animations.Animation & {
          /**
           * Unique key without a prefix.
           * Gets assembled with the sheetPrefix and animPrefix.
           * @override
           */
          key?: string;
          /**
           * DONT YOU DARE DEFINE THIS!!!
           *
           * Jk. doesnt matter, it gets overwritten.
           * @override
           */
          frames?: string | Phaser.Types.Animations.AnimationFrame[] | undefined;
          /**
           * overwritten.
           */
          baseKey?: string;
          frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig | undefined;
          originX: number;
          originY: number;
          /**
           * Progress based index system progress numbers.
           */
          PBI?: number[];
          /**
           * Contact ground system
           */
          CGS?: {
            /**
             * index of animation
             */
            index: number;
            contacts: {
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
            }[];
          }[];
        })[]
    ) {
      /**
       * "key" property is used two times so needs to be overwritten and prepaired.
       */
      strips.forEach((strip) => {
        strip.baseKey = strip.key;
        strip.key = sheetPrefix + strip.baseKey;
      });

      scene.load.spritesheet(strips);

      strips.forEach((strip) => {
        scene.load.on("filecomplete-spritesheet-" + strip.key, (fileKey: string) => {
          strip.key = animPrefix + strip.baseKey;
          strip.frames = fileKey;
          scene.anims.create(strip);
        });
      });
    },
  };
}

export const gameManager: SPITEManager = new SPITEManager(config);
