class boot extends Phaser.State {
  constructor() {
    super();
  }

  preload() {
    this.game.load.image("loading", "assets/sprites/loading.png");
  }
  create() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.state.start("Preload");
  }
}

export default boot;
