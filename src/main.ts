import Phaser from "phaser";
import sc_Main from "./scenes/sc_Main";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [sc_Main],
};

const game = new Phaser.Game(config);
