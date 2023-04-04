import { Player } from "../../gameObj/player";
import { gameManager } from "../../main";
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

    this.player = gameManager.GameObject.Add(this, new Player(this, width * 0.5, height * 0.5, ""));
    this.player.play("an_player_idle_idle");

    // let cent = this.player.getCenter();

    // this.cameras.main.
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
      "name: " + this.player?.frame.name,
    ]);

    //#endregion debug
  }
}
