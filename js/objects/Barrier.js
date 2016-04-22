import GlobalVars from "./GlobalVars";
import playGame from "../States/PlayGame";

class Barrier extends Phaser.Sprite {
  constructor(game, speed, tintColor) {
    super(game);
    var positions = [(game.width - GlobalVars.tunnelWidth) / 2, (game.width + GlobalVars.tunnelWidth)/2];
    var position = game.rnd.between(0, 1);
    Phaser.Sprite.call(this, game, positions[position], -100, "barrier");
    var cropRect = new Phaser.Rectangle(0, 0, GlobalVars.tunnelWidth /2, 24);
    this.crop(cropRect);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(position, 0.5);
    this.tint = tintColor;
    this.body.velocity.y = speed;
    this.placeBarrier = true;
    this.body.immovable = true;

    console.log("barrier placed");
  }

  update() {
    if (this.placeBarrier && this.y > GlobalVars.barrierGap) {
      this.placeBarrier = false;
      playGame.prototype.addBarrier(this.game, this.parent, this.tint);
    }
    if (this.y > this.game.height) {
      this.destroy();
    }
  }
}
export default Barrier;
