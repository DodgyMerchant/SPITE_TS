import { Player } from "../../gameObj/player";
import { MyGameManager as MGM, gameManager } from "../../main";
import { sc_MyScene } from "../abstract/sc_MyScene";

const ANIMS: {
  [i: string]: string;
} = {
  anim1: "aaa",
  anim2: "eee",
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
    /**
     * repeat: 0,
     * yoyo: true,
     * yoyos one time :D
     */

    this.load.setPath("src/assets/");
    // this.load.image("mapImg", "assets/mapImg.png");

    this.load.image("img_player_idle_stand", "player/idle/img_player_idle_stand.png");

    MGM.Load.strip(
      this,
      {
        key: "sheet_player_idle_idle",
        url: "player/idle/spr_player_idle_idle.png",
        frameConfig: { frameWidth: 16, frameHeight: 22 },
      },
      {
        key: "an_player_idle_idle",
        // frameRate: 1,
        frameRate: 0,
        skipMissedFrames: true,
        repeat: -1,
        // repeat: 0,
        // yoyo: true,
      }
    );

    let prop: string;
    for (const key in ANIMS) {
      if (Object.prototype.hasOwnProperty.call(ANIMS, key)) {
        prop = ANIMS[key];
        console.log("log: prop: ", prop);
      }
    }
  }

  create() {
    super.create();

    let { width, height } = this.scale;

    // img_player_idle_stand
    // sheet_player_idle_idle
    // an_player_idle_idle
    this.player = MGM.GmObj.Add.AddnUpdate(this, new Player(this, width * 0.5, height * 0.5, "img_player_idle_stand"));
  }

  update(time: number, delta: number): void {
    super.update(time, delta);

    // console.log("sc_Game update");

    //#region debug

    if (this.player)
      this.DEBUG.AddText([
        "",
        "Player///////////",
        "active: " + this.player.active,
        "visible: " + this.player.visible,
        "x/y: " + this.player.x + "/" + this.player.y,
        "Anim///////////",
        "key: " + this.player.texture.key,
        "index: " + this.player.anims.currentFrame.index + " / " + this.player.anims.getTotalFrames(),
        "cus.i: " + this.player.prog,
        "isPlaying: " + this.player.anims.isPlaying,
        "forward: " + this.player.anims.forward,
        "inReverse: " + this.player.anims.inReverse,
        "yoyo: " + this.player.anims.yoyo,
        "repeat: " + this.player.anims.repeat,
        "repeatCounter: " + this.player.anims.repeatCounter,
      ]);
    //#endregion debug
  }
}
