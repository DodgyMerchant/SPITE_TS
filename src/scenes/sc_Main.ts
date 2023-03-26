export default class sc_Main extends Phaser.Scene {
  constructor() {
    super({});
  }

  preload() {
    this.load.image("mapImg", "assets/mapImg.png");
  }

  create() {
    // Text section

    console.log("EEEE");

    const { width, height } = this.scale;
    this.add.image(width * 0.5, height * 0.5, "mapImg");
  }
}
