import Phaser from "phaser";
import sc_Init from "./scenes/gameScenes/sc_Init";
import { GameManager } from "./myUtils/gameManager";
import { CGSManager, CGS_Frame } from "./gameObj/abstract/CGS";
import { PBIManager, PBI_List } from "./gameObj/abstract/PBI";

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
  input: {
    keyboard: true,
    gamepad: true,
    
  },
  
};

// type MegaAnim = {
//   /**
//    * Base key to use with the sheetPrefix and animPrefix.
//    */
//   baseKey: string;
//   /**
//    * key for associated animation object in the phaser animation manager.
//    */
//   animKey: string;
//   /**
//    * key for associated Sprite Sheet object in the phaser animation manager.
//    */
//   sheetKey: string;
//   /**
//    * origin point x value of the sprites.
//    * Added from the top left corner.
//    */
//   originX: number;
//   /**
//    * origin point y value of the sprites.
//    * Added from the top left corner.
//    */
//   originY: number;
//   /**
//    * Progress based index system progress numbers.
//    */
//   PBI?: PBI_List;
//   /**
//    * Contact ground system
//    */
//   CGS?: CGS_Frame[];

//   /**
//    * DONT YOU DARE DEFINE THIS!!!
//    *
//    * Jk. doesnt matter, it gets overwritten.
//    * @override
//    */
//   frames?: string | Phaser.Types.Animations.AnimationFrame[] | undefined;
// };

type MegaAnimConfig = Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig &
  Phaser.Types.Animations.Animation & {
    /**
     * Base key to use with the sheetPrefix and animPrefix.
     */
    baseKey?: string;
    originX: number;
    originY: number;
    /**
     * Progress based index system progress numbers.
     */
    PBI?: PBI_List;
    /**
     * Contact ground system
     */
    CGS?: CGS_Frame[];

    /**
     * DONT NEED TO DEFINE!!
     * Gets generated!
     * @override
     */
    frames?: string | Phaser.Types.Animations.AnimationFrame[] | undefined;
    /**
     * Unique key without a prefix.
     * Gets assembled with the sheetPrefix and animPrefix.
     * overwritten.
     * @override
     */
    key: string;
  };

/**
 * My Phaser Game Manager Class.
 * Phaser Utility for this project.
 */
export class SPITEManager extends GameManager implements PBIManager, CGSManager {
  constructor(GameConfig?: Phaser.Types.Core.GameConfig | undefined) {
    super(GameConfig);
  }

  //#region CGS

  CGSget(key: string): CGS_Frame[] | undefined {
    return this.CGS_Map.get(key);
  }
  CGSset(key: string, frameList: CGS_Frame[]): void {
    this.CGS_Map.set(key, frameList);
  }
  /**
   * map containing all PBI entries
   */
  private CGS_Map = new Map<string, CGS_Frame[]>();

  //#endregion CGS
  //#region PBI

  PBIget(key: string): PBI_List | undefined {
    return this.PBI_Map.get(key);
  }
  PBIset(key: string, list: PBI_List): void {
    this.PBI_Map.set(key, list);
  }

  /**
   * map containing all PBI entries
   */
  private PBI_Map = new Map<string, PBI_List>();

  //#endregion PBI

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
          (fileKey: string, _dataType: string, _TextureObject: Phaser.Textures.Texture) => {
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
     * @param PBI_Manager
     * @param sheetPrefix prefix for SpriteSheet keys added to all baseKey properties for key generation.
     * @param animPrefix prefix for Animation keys added to all baseKey properties for key generation.
     * @param strips
     * @returns
     */
    OmegaStip(
      scene: Phaser.Scene,
      PBI_Manager: PBIManager,
      CGS_Manager: CGSManager,
      sheetPrefix: string,
      animPrefix: string,
      strips: MegaAnimConfig[]
    ) {
      let anim;

      strips.forEach((strip) => {
        /*
         * "key" property is used two times so needs to be overwritten and prepaired.
         */
        strip.baseKey = strip.key;
        strip.key = sheetPrefix + strip.baseKey;

        //create sprite sheets
        scene.load.spritesheet(strip);

        //callback for completed sprite sheet
        scene.load.on("filecomplete-spritesheet-" + strip.key, (fileKey: string) => {
          strip.key = animPrefix + strip.baseKey;
          strip.frames = fileKey;

          anim = scene.anims.create(strip);

          /**
           * set origin for every frame
           */
          if (anim) {
            anim.frames.forEach((animFrame) => {
              animFrame.frame.customPivot = true;
              animFrame.frame.pivotX = strip.originX / animFrame.frame.width;
              animFrame.frame.pivotY = strip.originY / animFrame.frame.height;

              // animFrame.frame.x = strip.originX;
              // animFrame.frame.y = strip.originY;
            });
          }

          //PBI
          if (strip.PBI) PBI_Manager.PBIset(strip.key, strip.PBI);

          //CGS
          if (strip.CGS) CGS_Manager.CGSset(strip.key, strip.CGS);
        });
      });
    },
  };
}

export const gameManager: SPITEManager = new SPITEManager(config);
