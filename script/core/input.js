export default class Input {
    constructor(p, game) {
        this.p = p;
        this.game = game;
    }

    pressed(x, y) {
        this.game.upgrade(x, y);
        this.game.update(x, y);
        this.game.watch(x, y);
    }

    released(x, y) {

    }

    mouseIsPressed(mx, my) {
        this.game.shot(mx, my);
    }

    mouseWheel(delta) {
        this.game.zoom(delta);
    }

    keyPressed(key) {

    }

    keyReleased(key) {
        this.game.move(0, 0);
    }

    keyIsPressed(key) {
        let dx = 0;
        let dy = 0;

        if (this.p.keyIsDown('a')) dx -= 1;
        if (this.p.keyIsDown('d')) dx += 1;
        if (this.p.keyIsDown('w')) dy -= 1;
        if (this.p.keyIsDown('s')) dy += 1;

        // 斜め移動が早くならないよう制御
        if (dx !== 0 && dy !== 0) {
            dx *= Math.SQRT1_2;
            dy *= Math.SQRT1_2;
        }

        this.game.move(dx, dy);
    }

    keyIsReleased() {
        let dx = 0;
        let dy = 0;

        this.game.move(dx, dy);
    }
}