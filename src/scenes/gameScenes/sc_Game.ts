import { Player } from "../../gameObj/player";
import { CGS_TYPE, SPITEManager as GM, MegaAnimConfig, gameManager } from "../../main";
import { sc_MyScene } from "../abstract/sc_MyScene";

// const ANIMS: {
//   [i: string]: string;
// } = {
//   anim1: "aaa",
//   anim2: "eee",
// };

// let prop: string;
// for (const key in ANIMS) {
//   if (Object.prototype.hasOwnProperty.call(ANIMS, key)) {
//     prop = ANIMS[key];
//     console.log("log: prop: ", prop);
//   }
// }

type NestedConfig = {
  [i: string]: MegaAnimConfig | NestedConfig;
};

const TEX: NestedConfig = {
  PLAYER: {
    COMBAT: {
      Idle: {},
    },
    Test: {
      key: "player_TEST",
      url: "player/brace/spr_player_brace_deflect.png",
      frameConfig: { frameWidth: 19, frameHeight: 23 },
      frameRate: 4,
      originX: 14,
      originY: 9,
      repeat: -1,
    },
  },
};

export default class sc_Game extends sc_MyScene {
  playerConfig: any;

  player: Player | undefined;

  constructor() {
    super({}, gameManager);
  }

  init() {
    super.init();
  }

  preload() {
    super.preload();
    /*
     * repeat: 0,
     * yoyo: true,
     * yoyos one time :D
     */

    this.load.setPath("src/assets/");
    // this.load.image("mapImg", "assets/mapImg.png");

    this.load.image("img_player_idle_stand", "player/idle/img_player_idle_stand.png");

    GM.Load.OmegaStip(this, "sheet_", "an_", [
      /*
      pingpong: 
        yoyo: true,
        repeat: -1


      
      */

      TEX.PLAYER.Test,

      //#region attack CGS

      {
        key: "player_attack_attack_recovery",
        url: "player/attack/spr_player_attack_attack_recovery.png",
        frameConfig: { frameWidth: 23, frameHeight: 20 },
        frameRate: 3,
        originX: 6,
        originY: 6,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 19 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 19 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 1, y: 19 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 19 },
            ],
          },
          //sword hit water sfx
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.NEW, x: 22, y: 19 },
              { type: CGS_TYPE.NEW, x: 20, y: 19 },
            ],
          },
        ],
      },

      {
        key: "player_attack_hurtbox",
        url: "player/attack/spr_player_attack_hurtbox.png",
        frameConfig: { frameWidth: 28, frameHeight: 29 },
        frameRate: 20,
        originX: 6,
        originY: 25,
      },
      {
        key: "player_attack_ready",
        url: "player/attack/spr_player_attack_ready.png",
        frameConfig: { frameWidth: 18, frameHeight: 28 },
        frameRate: 0,
        originX: 5,
        originY: 14,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 27 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 27 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 27 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 27 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 27 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 27 },
            ],
          },
          {
            index: 3,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 27 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 27 },
            ],
          },
        ],
      },
      {
        key: "player_attack_slash",
        url: "player/attack/spr_player_attack_slash.png",
        frameConfig: { frameWidth: 28, frameHeight: 29 },
        frameRate: 20,
        originX: 6,
        originY: 15,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 1, y: 28 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 28 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.NEW, x: 0, y: 28 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 28 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 28 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 28 },
              { type: CGS_TYPE.NEW, x: 22, y: 28 },
            ],
          },
        ],
      },

      {
        key: "player_attack_whiff",
        url: "player/attack/spr_player_attack_whiff.png",
        frameConfig: { frameWidth: 19, frameHeight: 23 },
        frameRate: 3,
        originX: 8,
        originY: 9,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.NEW, x: 2, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 10, y: 22 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.NEW, x: 3, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 10, y: 22 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.NEW, x: 2, y: 22 },
              { type: CGS_TYPE.NEW, x: 11, y: 22 },
            ],
          },
          {
            index: 3,
            contacts: [
              { type: CGS_TYPE.NEW, x: 0, y: 22 },
              { type: CGS_TYPE.NEW, x: 11, y: 22 },
            ],
          },
          {
            index: 4,
            contacts: [
              { type: CGS_TYPE.NEW, x: 1, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 11, y: 22 },
            ],
          },
          {
            index: 5,
            contacts: [
              { type: CGS_TYPE.NEW, x: 2, y: 22 },
              { type: CGS_TYPE.NEW, x: 10, y: 22 },
            ],
          },
          {
            index: 6,
            contacts: [
              { type: CGS_TYPE.NEW, x: 3, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 10, y: 22 },
            ],
          },
        ],
      },

      //#endregion attack
      //#region brace CGS

      {
        key: "player_brace_deflect",
        url: "player/brace/spr_player_brace_deflect.png",
        frameConfig: { frameWidth: 19, frameHeight: 23 },
        frameRate: 4,
        originX: 14,
        originY: 9,
        CGS: [
          {
            index: 0,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 9, y: 22 }],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 9, y: 22 },
              { type: CGS_TYPE.NEW, x: 15, y: 22 },
            ],
          },
          {
            index: 2,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 15, y: 22 }],
          },
          {
            index: 3,
            contacts: [
              { type: CGS_TYPE.NEW, x: 7, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 15, y: 22 },
            ],
          },
          {
            index: 4,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 14, y: 22 },
            ],
          },
          {
            index: 5,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 14, y: 22 },
            ],
          },
        ],
      },
      {
        key: "player_brace_idle",
        url: "player/brace/spr_player_brace_idle.png",
        frameConfig: { frameWidth: 16, frameHeight: 21 },
        frameRate: 1,
        originX: 5,
        originY: 7,
        yoyo: true,
        repeat: -1,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 20 },
              { type: CGS_TYPE.NEW, x: 7, y: 20 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 20 },
              { type: CGS_TYPE.NEW, x: 8, y: 20 },
            ],
          },
        ],
      },
      {
        key: "player_brace_ready",
        url: "player/brace/spr_player_brace_ready.png",
        frameConfig: { frameWidth: 14, frameHeight: 22 },
        frameRate: 0,
        originX: 5,
        originY: 8,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 21 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 21 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 21 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 21 },
            ],
          },
        ],
      },

      //#endregion brace
      //#region combat CGS

      {
        key: "player_combat_idle",
        url: "player/combat/spr_player_combat_idle.png",
        frameConfig: { frameWidth: 15, frameHeight: 23 },
        frameRate: 2,
        originX: 5,
        originY: 9,
        yoyo: true,
        repeat: -1,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
            ],
          },
        ],
      },
      {
        key: "player_combat_transition",
        url: "player/combat/spr_player_combat_transition.png",
        frameConfig: { frameWidth: 12, frameHeight: 23 },
        frameRate: 5,
        originX: 7,
        originY: 9,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 4, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 22 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.NEW, x: 3, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 22 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 3, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 9, y: 22 },
            ],
          },
        ],
      },
      {
        key: "player_combat_turnaround",
        url: "player/combat/spr_player_combat_turnaround.png",
        frameConfig: { frameWidth: 15, frameHeight: 23 },
        frameRate: 3,
        originX: 8,
        originY: 9,
        CGS: [
          {
            index: 0,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 10, y: 22 }],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.NEW, x: 3, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 10, y: 22 },
            ],
          },
          {
            index: 2,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 3, y: 22 }],
          },
        ],
      },
      {
        key: "player_combat_walk",
        url: "player/combat/spr_player_combat_walk.png",
        frameConfig: { frameWidth: 15, frameHeight: 23 },
        frameRate: 1,
        originX: 5,
        originY: 9,
        PBI: [1, 1, 1, 1],
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 0, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
            ],
          },
          {
            index: 1,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 6, y: 22 }],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.NEW, x: 2, y: 22 },
              { type: CGS_TYPE.CONTINUED, x: 5, y: 22 },
            ],
          },
          {
            index: 3,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 1, y: 22 }],
          },
        ],
      },
      //#endregion combat
      //#region downed

      {
        key: "player_downed_getup_backwards",
        url: "player/downed/spr_player_downed_getup_backwards.png",
        frameConfig: { frameWidth: 22, frameHeight: 19 },
        frameRate: 5,
        originX: 19,
        originY: 3,
      },

      //#endregion downed
      //#region exhausted

      //#endregion exhausted
      //#region hit

      {
        key: "player_hit_backwards",
        url: "player/hit/spr_player_hit_backwards.png",
        frameConfig: { frameWidth: 27, frameHeight: 28 },
        frameRate: 5,
        originX: 19,
        originY: 13,
      },

      //#endregion hit
      //#region idle CGS (idle walk end missing)

      {
        key: "player_idle_idle",
        url: "player/idle/spr_player_idle_idle.png",
        frameConfig: { frameWidth: 16, frameHeight: 22 },
        frameRate: 1,
        originX: 11,
        originY: 8,
        yoyo: true,
        repeat: -1,
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 8, y: 21 },
              { type: CGS_TYPE.CONTINUED, x: 12, y: 21 },
            ],
          },
          {
            index: 1,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 8, y: 21 },
              { type: CGS_TYPE.CONTINUED, x: 12, y: 21 },
            ],
          },
          {
            index: 2,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 8, y: 21 },
              { type: CGS_TYPE.CONTINUED, x: 12, y: 21 },
            ],
          },
        ],
      },
      {
        key: "player_idle_walk_end",
        url: "player/idle/spr_player_idle_walk_end.png",
        frameConfig: { frameWidth: 16, frameHeight: 23 },
        frameRate: 7,
        originX: 11,
        originY: 9,
        PBI: [1, 1],
      },
      {
        key: "player_idle_walk_loop",
        url: "player/idle/spr_player_idle_walk_loop.png",
        frameConfig: { frameWidth: 14, frameHeight: 23 },
        frameRate: 7,
        originX: 9,
        originY: 9,
        PBI: [2, 2, 1, 1, 2],
        CGS: [
          {
            index: 0,
            contacts: [
              { type: CGS_TYPE.CONTINUED, x: 7, y: 22 },
              { type: CGS_TYPE.NEW, x: 15, y: 22 },
            ],
          },
          {
            index: 1,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 13, y: 22 }],
          },
          {
            index: 2,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 11, y: 22 }],
          },
          {
            index: 3,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 10, y: 22 }],
          },
          {
            index: 4,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 9, y: 22 }],
          },
        ],
      },
      {
        key: "player_idle_walk_start",
        url: "player/idle/spr_player_idle_walk_start.png",
        frameConfig: { frameWidth: 16, frameHeight: 23 },
        frameRate: 7,
        originX: 11,
        originY: 9,
        PBI: [1, 1],
        CGS: [
          {
            index: 0,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 6, y: 22 }],
          },
          {
            index: 1,
            contacts: [{ type: CGS_TYPE.CONTINUED, x: 5, y: 22 }],
          },
        ],
      },

      //#endregion idle
      //#region standup

      {
        key: "player_standup_backward",
        url: "player/standup/spr_player_standup_backward.png",
        frameConfig: { frameWidth: 16, frameHeight: 22 },
        frameRate: 3,
        originX: 11,
        originY: 8,
      },

      //#endregion standup
    ]);
  }

  create() {
    super.create();

    let { width, height } = this.scale;

    // img_player_idle_stand
    // sheet_player_idle_idle
    // an_player_idle_idle
    this.player = GM.GmObj.Add.AddnUpdate(this, new Player(this, width * 0.5, height * 0.5, "img_player_idle_stand"));

    if (this.player.anims.currentFrame) {
    }
  }

  update(time: number, delta: number): void {
    super.update(time, delta);

    // console.log("sc_Game update");

    //#region debug

    // player
    if (this.player) {
      this.DEBUG.AddText([
        "",
        "Player///////////",
        "active: " + this.player.active,
        "visible: " + this.player.visible,
        "x/y: " + this.player.x + "/" + this.player.y,
        "origin x/y: " + this.player.displayOriginX + "/" + this.player.displayOriginY,
        "State///////////",
        "base: " + this.player.baseGet().toString(),
        "base state" + this.player.baseGet().toString(),
      ]);

      let anFr = this.player.anims.currentFrame;
      if (anFr)
        this.DEBUG.AddText([
          "",
          "Anim///////////",
          "key: " + this.player.texture.key,
          "index: " + anFr.index + " / " + this.player.anims.getTotalFrames(),
          "fps: " + this.player.anims.currentAnim?.frameRate,
          "isPlaying: " + this.player.anims.isPlaying,
          // "forward: " + this.player.anims.forward,
          // "inReverse: " + this.player.anims.inReverse,
          // "yoyo: " + this.player.anims.yoyo,
          // "repeat: " + this.player.anims.repeat,
          // "repeatCounter: " + this.player.anims.repeatCounter,
          "",
          "Frame///////////",
          "x/y: " + anFr.frame.x + "/" + anFr.frame.y,
          "pivot x/y: " + anFr.frame.pivotX.toFixed(2) + "/" + anFr.frame.pivotY.toFixed(2),
          "customPivot: " + anFr.frame.customPivot,
        ]);

      // origin circles
      if (this.DEBUG.gameGraph) {
        let grap = this.DEBUG.gameGraph;
        let main = this.cameras.main;

        let a = 1;
        let w = 0.3;

        //player

        let frame = this.player.anims.currentFrame?.frame;

        grap.lineStyle(w, 0xff0000, a);

        grap.strokeRectShape(this.player.getBounds());
        grap.fillPoint(this.player.x, this.player.y, 1);
        grap.strokeCircle(this.player.x, this.player.y, 1);

        if (frame) {
          grap.fillPoint(frame.x, frame.y, 1);
        }

        // console.log(this.player.anims.currentAnim);
        // this.player.scaleX = -this.player.scaleX;
        // this.player.rotation += 0.001;

        this.player.anims;

        //cam
        grap.lineStyle(w, 0x00ff00, 0.2);
        grap.strokeCircle(main.worldView.centerX, main.worldView.centerY, 5);
      }
    }
    //#endregion debug
  }
}
