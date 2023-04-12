import { Player } from "../../gameObj/player";
import { MyGameManager, gameManager } from "../../main";
import { sc_MyScene } from "../abstract/sc_MyScene";

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
  }

  create() {
    super.create();

    let { width, height } = this.scale;

    // img_player_idle_stand
    // sheet_player_idle_idle
    // an_player_idle_idle
    this.player = MyGameManager.GmObj.Add.AddnUpdate(this, new Player(this, width * 0.5, height * 0.5, "img_player_idle_stand"));
  }

  update(time: number, delta: number): void {
    super.update(time, delta);

    // console.log("sc_Game update");

    //#region debug

    this.DEBUG.AddText([
      "",
      "Player///////////",
      "active: " + this.player?.active,
      "visible: " + this.player?.visible,
      "x/y: " + this.player?.x + "/" + this.player?.y,
      "key: " + this.player?.texture.key,
      "index: " + this.player?.anims.currentFrame?.index,
    ]);

    //#endregion debug
  }
}
