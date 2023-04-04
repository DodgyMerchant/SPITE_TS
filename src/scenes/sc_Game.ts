import { Player } from "../gameObj/player";
import { gameManager } from "../main";
import { sc_MyScene } from "./sc_MyScene";

export default class sc_Game extends sc_MyScene {
  playerConfig: any;

  player: Player | undefined;

  constructor() {
    super({});
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

    this.player = gameManager.gameObjectAdd(this, new Player(this, width * 0.5, height * 0.5, ""));
    this.player.play("an_player_idle_idle");

    // let cent = this.player.getCenter();

    this.cameras.main.worldView.setSize(gameManager.Scales.ViewWidth, gameManager.Scales.ViewHeight);
    console.log("cammmmm: ", this.cameras.main, gameManager.Scales.ViewWidth, gameManager.Scales.ViewHeight);
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    // console.log("sc_Game update");

    //#region debug

    // prettier-ignore
    this.DEBUG.Add([
      "Player///////////",
      "active: "+this.player?.active,
      "visible: " + this.player?.visible,
      "x/y: "+this.player?.x +"/"+this.player?.y,
      "key: " + this.player?.texture.key,
      "name: " + this.player?.frame.name,
    ]);

    //#endregion debug
  }
}
