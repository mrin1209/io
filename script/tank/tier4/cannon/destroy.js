import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Destroy extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 90;
        this.gun.aim = 10;
        this.gun.recoil = 5;

        this.bullet.speed = 2;
        this.bullet.power = 75;
        this.bullet.armor = 30;
        this.bullet.penetration = 30;
        this.bullet.duration = 90;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 240;
        this.bullet.radius = 30;

        this.previewColor = Color.red;

        super.setup(param);
    }

    draw() {
        const p = this.p;

        p.push();

        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.scale(this.previewScale);

        p.rectMode(p.CORNER);

        p.stroke(Color.gun.border);
        p.strokeWeight(2);

        p.fill(Color.gun.fill);
        p.rect(
            0,
            -this.bullet.radius,
            this.gun.length,
            this.bullet.radius * 2
        );

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = this.p.random(-aim, aim);
        const angle = this.angle + spread;

        const x = this.x + Math.cos(this.angle) * this.gun.length;
        const y = this.y + Math.sin(this.angle) * this.gun.length;

        return this.add(x, y, angle);
    }
}