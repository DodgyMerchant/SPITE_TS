export abstract class sc_MyScene extends Phaser.Scene {
  /**
   * group for all object to be updated
   */
  GroupAlive: Phaser.GameObjects.Group | undefined;

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);

    
  }

  init() {}

  preload() {}

  create() {
    console.log("Scene Changed To: ", this.scene.key);

    this.GroupAlive = this.add.group({
      name: "GroupAlive",
      active: true,
      runChildUpdate: true,
    });
  }
}
